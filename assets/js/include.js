/* ヘッダー/フッターなど共通パーツの読み込み
   <div data-include="header.html"></div> のような要素を探し、
   中身をfetchで読み込んでその場に差し込みます。

   注意: file:// で直接開くとブラウザのCORS制限により動作しません。
   VS CodeのLive Serverなどローカルサーバー経由か、公開後のURLで確認してください。 */
(function () {
  const targets = document.querySelectorAll('[data-include]');

  const loaders = Array.from(targets).map((el) => {
    const file = el.getAttribute('data-include');
    return fetch(file)
      .then((res) => {
        if (!res.ok) throw new Error(`${file} の読み込みに失敗しました (status: ${res.status})`);
        return res.text();
      })
      .then((html) => {
        el.outerHTML = html;
      })
      .catch((err) => {
        console.error('[include.js]', err);
      });
  });

  Promise.all(loaders).then(() => {
    document.dispatchEvent(new Event('includesLoaded'));
  });
})();
