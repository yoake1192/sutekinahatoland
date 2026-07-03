/* ハンバーガーメニュー・reveal演出・鳩マーキーなど、共通の挙動をまとめたファイル */

// ===== スクロールでふわっと表示 =====
function initReveal() {
  const targets = document.querySelectorAll('.reveal');
  if (!targets.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('on');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: .15 });
  targets.forEach((el) => io.observe(el));
}

// ===== ハンバーガーメニュー(ヘッダー読み込み後に実行) =====
function initMenu() {
  const btn = document.querySelector('.menu-btn');
  const drawer = document.getElementById('drawer');
  const overlay = document.getElementById('drawerOverlay');
  const closeBtn = document.getElementById('drawerClose');
  if (!btn || !drawer || !overlay) return;

  function toggleMenu(open) {
    btn.setAttribute('aria-expanded', open);
    btn.setAttribute('aria-label', open ? 'メニューを閉じる' : 'メニューを開く');
    drawer.classList.toggle('open', open);
    overlay.classList.toggle('show', open);
  }

  btn.addEventListener('click', () => toggleMenu(btn.getAttribute('aria-expanded') !== 'true'));
  overlay.addEventListener('click', () => toggleMenu(false));
  drawer.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => toggleMenu(false)));
  if (closeBtn) closeBtn.addEventListener('click', () => toggleMenu(false));
}

// ===== 鳩マーキー(personal.htmlのみ・要素がなければ何もしない) =====
function initMarquee() {
  const track = document.getElementById('marqueeTrack');
  if (!track) return;
  const baseSet = [...track.children].map((el) => el.cloneNode(true));

  function fillMarquee() {
    const setWidth = track.scrollWidth;
    track.style.setProperty('--loop-width', setWidth + 'px');
    const need = Math.ceil((window.innerWidth + setWidth) / setWidth) + 1;
    for (let i = 1; i < need; i++) {
      baseSet.forEach((el) => track.appendChild(el.cloneNode(true)));
    }
  }
  window.addEventListener('load', fillMarquee);
}

// ===== ギャラリー タブ切り替え(gallery.htmlのみ・要素がなければ何もしない) =====
function initGalleryTabs() {
  const tabs = document.querySelectorAll('.tab');
  const arts = document.querySelectorAll('.art');
  const empty = document.getElementById('empty');
  if (!tabs.length || !arts.length) return;

  function showCat(cat) {
    let count = 0;
    arts.forEach((a) => {
      const show = a.dataset.cat === cat;
      a.hidden = !show;
      if (show) {
        count++;
        a.style.animation = 'none';
        a.offsetHeight; // アニメーション再生用リセット
        a.style.animation = '';
      }
    });
    if (empty) empty.hidden = count > 0;
    tabs.forEach((t) => t.setAttribute('aria-selected', t.dataset.cat === cat));
  }

  tabs.forEach((t) => t.addEventListener('click', () => showCat(t.dataset.cat)));
  showCat(tabs[0].dataset.cat); // 初期表示
}

// ===== ライトボックス(gallery.htmlのみ・要素がなければ何もしない) =====
function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');
  const arts = document.querySelectorAll('.art');
  if (!lightbox || !lightboxImg || !lightboxClose) return;

  arts.forEach((a) => {
    a.addEventListener('click', () => {
      const img = a.querySelector('img');
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightbox.classList.add('show');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeLightbox() {
    lightbox.classList.remove('show');
    document.body.style.overflow = '';
  }
  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });
}

// ===== 上に戻るボタン(footer.html読み込み後・要素がなければ何もしない) =====
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  function toggle() {
    if (window.scrollY > window.innerHeight * 0.6) {
      btn.classList.add('show');
    } else {
      btn.classList.remove('show');
    }
  }

  window.addEventListener('scroll', toggle, { passive: true });
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  toggle();
}

document.addEventListener('DOMContentLoaded', () => {
  initReveal();
  initMarquee();
  initGalleryTabs();
  initLightbox();
});
// ヘッダー/フッターはinclude.jsで非同期に読み込まれるため、
// メニュー操作・戻るボタンの初期化は読み込み完了イベントを待ってから行う
document.addEventListener('includesLoaded', () => {
  initMenu();
  initBackToTop();
});
