/*
 * /early.js: runs in <head> before paint (loaded by BaseLayout, not deferred).
 * 1. Picks the price currency: ?currency=, a saved choice, the time zone, then the browser language. No network call.
 * 2. Marks JS so reveal styles apply; a fail-safe removes the mark if the motion engine never boots.
 * A file instead of inline scripts, so the Content-Security-Policy can allow scripts from 'self' only.
 */
import { currencyCodes } from '../data/site';

export const GET = () => {
  const body = `(function () {
  var codes = ${JSON.stringify(currencyCodes)};
  var pick = function () {
    try { var q = (new URLSearchParams(location.search).get('currency') || '').toUpperCase(); if (codes.indexOf(q) > -1) { localStorage.setItem('obel-currency', q); return q; } } catch (e) {}
    try { var s = localStorage.getItem('obel-currency'); if (codes.indexOf(s) > -1) return s; } catch (e) {}
    var tz = ''; try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch (e) {}
    if (/^Africa\\/(Johannesburg|Maseru|Mbabane)$/.test(tz)) return 'ZAR';
    if (/^Europe\\/(London|Belfast|Guernsey|Isle_of_Man|Jersey)$/.test(tz)) return 'GBP';
    if (/^(Europe\\/|Atlantic\\/(Canary|Madeira|Azores))/.test(tz)) return 'EUR';
    if (/^Australia\\//.test(tz)) return 'AUD';
    if (tz) return 'USD';
    var l = (navigator.language || '').toUpperCase();
    if (/-ZA$/.test(l)) return 'ZAR'; if (/-GB$/.test(l)) return 'GBP'; if (/-AU$/.test(l)) return 'AUD';
    if (/-(AT|BE|CY|DE|EE|ES|FI|FR|GR|HR|IE|IT|LT|LU|LV|MT|NL|PT|SI|SK)$/.test(l)) return 'EUR';
    return 'ZAR';
  };
  document.documentElement.dataset.currency = pick();
  window.__setCurrency = function (c) {
    if (codes.indexOf(c) < 0) return;
    document.documentElement.dataset.currency = c;
    try { localStorage.setItem('obel-currency', c); } catch (e) {}
    document.dispatchEvent(new CustomEvent('currencychange', { detail: c }));
  };
  document.documentElement.classList.add('js');
  setTimeout(function () { if (!window.__motion) document.documentElement.classList.remove('js'); }, 2500);
})();
`;
  return new Response(body, { headers: { 'Content-Type': 'text/javascript; charset=utf-8' } });
};
