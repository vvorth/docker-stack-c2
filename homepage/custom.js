// custom.js — Homepage: rewrite link hostnames to match how the client accessed Homepage,
// while keeping protocol/port/path/query from the label as-is.
//
// Only rewrites links whose hostname exactly matches PLACEHOLDER_HOST below — so you
// opt in per-service by using that literal hostname in the homepage.href label, e.g.:
//   homepage.href=http://myhost:8080/
// Everything else (github.com, reddit.com, your other real hosts, etc.) is left untouched.
//
// Homepage's UI is a React SPA: links are rendered/re-rendered client-side, often after
// DOMContentLoaded has already fired. A MutationObserver re-applies the rewrite whenever
// the DOM changes, and a data-attribute marker prevents re-processing already-fixed links
// (which would otherwise re-trigger the observer in a loop).

(function () {
  const currentHost = window.location.hostname; // e.g. "10.0.0.1" or "myhost.local"
  const PLACEHOLDER_HOST = 'localhost'; // the literal hostname you use in homepage.href labels
  const MARK = 'data-host-rewritten';

  function rewriteLinks() {
    document.querySelectorAll(`a[href]:not([${MARK}])`).forEach((link) => {
      try {
        const url = new URL(link.href);

        // Mark as processed regardless, so we don't keep re-checking it
        link.setAttribute(MARK, '1');

        if (url.hostname !== PLACEHOLDER_HOST) return; // only touch links using the placeholder
        if (currentHost === PLACEHOLDER_HOST) return;  // already correct (accessed via placeholder itself)

        url.hostname = currentHost; // swap host only; protocol/port/path/query stay as configured
        link.href = url.toString();
      } catch (e) {
        // ignore invalid or relative hrefs
      }
    });
  }

  // Initial pass (covers the case where links are already present)
  rewriteLinks();

  // Re-run whenever React adds/updates the DOM
  const observer = new MutationObserver(() => rewriteLinks());
  observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['href'] });
})();
