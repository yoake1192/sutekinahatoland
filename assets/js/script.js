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

document.addEventListener('DOMContentLoaded', () => {
  initReveal();
  initMarquee();
});
// ヘッダー/フッターはinclude.jsで非同期に読み込まれるため、
// メニュー操作の初期化は読み込み完了イベントを待ってから行う
document.addEventListener('includesLoaded', initMenu);
