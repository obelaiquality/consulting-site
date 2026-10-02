/*
 * Checkout adapter (Paddle Billing, Paddle.js v2). The website opens the checkout inline in the page,
 * with the order details in customData; the payment provider sends its webhook straight to the Obel
 * control plane, which verifies it and provisions the workspace. No secret and no provisioning logic
 * lives here. Contract: docs/CHECKOUT-CONTRACT.md.
 */
import { checkout, type Billing, type PlanId } from '../data/site';

export interface OrderData {
  v: 1;
  order_ref: string;
  plan: PlanId;
  billing: Billing;
  region: string;
  company: string;
  workspace: string;
  admin_name: string;
  admin_email: string;
  ai_mode: 'openai' | 'local';
  ai_consent_at: string | null;
  terms_version: string;
  display_currency: string;
}

/** The part of a Paddle.js checkout event that the page shows (amounts in major units). */
export interface PaddleTotals {
  currency_code: string;
  totals: { subtotal: number; discount: number; tax: number; total: number };
  recurring_totals?: { subtotal: number; tax: number; total: number } | null;
}
export interface PaddleEvent { name?: string; data?: PaddleTotals }

declare global {
  interface Window { Paddle?: any }
}

export const slugify = (s: string) =>
  s.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40);

/** Order reference: always a UUID v4 from the browser's crypto (no fallback). */
export const newOrderRef = () => crypto.randomUUID();
export const isOrderRef = (s: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(s);

/** Slug rules shared with the control plane (docs/CHECKOUT-CONTRACT.md §3). The server enforces them. */
export const reservedSlugs = ['www', 'app', 'api', 'admin', 'status', 'eu', 'za', 'us', 'au', 'uk', 'mail', 'support', 'help', 'billing', 'login', 'auth', 'static', 'cdn', 'docs', 'obel', 'obel-ms'];
export const slugOk = (s: string) => /^[a-z][a-z0-9-]{1,38}[a-z0-9]$/.test(s) && !reservedSlugs.includes(s);

export const statusUrl = (ref: string) => `/checkout/status?order=${encodeURIComponent(ref)}`;

/** Paddle.Initialize takes one callback, so the page subscribes here. */
const listeners = new Set<(e: PaddleEvent) => void>();
export const onPaddleEvent = (fn: (e: PaddleEvent) => void) => { listeners.add(fn); return () => listeners.delete(fn); };

let loading: Promise<any> | null = null;
function loadPaddle(): Promise<any> {
  if (loading) return loading;
  loading = new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = 'https://cdn.paddle.com/paddle/v2/paddle.js';
    s.async = true;
    s.onload = () => {
      const P = window.Paddle;
      if (!P) { loading = null; return reject(new Error('Paddle.js did not load')); }
      if (checkout.environment === 'sandbox') P.Environment.set('sandbox');
      P.Initialize({ token: checkout.clientToken, eventCallback: (e: PaddleEvent) => listeners.forEach((fn) => fn(e)) });
      resolve(P);
    };
    s.onerror = () => { loading = null; s.remove(); reject(new Error('Paddle.js did not load')); };
    document.head.appendChild(s);
  });
  return loading;
}

/** The class of the element that holds the inline checkout frame. */
export const FRAME_TARGET = 'obel-paddle-checkout';

/**
 * Opens the Paddle checkout inline in the element with class FRAME_TARGET.
 * Resolves false (and does nothing) while checkout is not active or Paddle.js cannot load.
 */
export async function openCheckout(order: OrderData): Promise<boolean> {
  const priceId = checkout.prices[order.plan]?.[order.billing];
  if (!checkout.enabled || !checkout.clientToken || !priceId) return false;
  if (!isOrderRef(order.order_ref)) return false;
  const items = [{ priceId, quantity: 1 }];
  const onboarding = checkout.onboardingPrices[order.plan];
  if (onboarding) items.push({ priceId: onboarding, quantity: 1 });
  let Paddle: any;
  try { Paddle = await loadPaddle(); } catch { return false; }   // the caller falls back to the email request
  Paddle.Checkout.open({
    items,
    customer: { email: order.admin_email },
    customData: order,
    settings: {
      displayMode: 'inline',
      variant: 'one-page',
      frameTarget: FRAME_TARGET,
      frameInitialHeight: 450,
      frameStyle: 'width: 100%; min-width: 312px; background-color: transparent; border: none;',
      theme: 'light',
      locale: 'en',
      allowLogout: false,
      successUrl: new URL(statusUrl(order.order_ref), window.location.origin).href,
    },
  });
  return true;
}

export function closeCheckout() {
  try { window.Paddle?.Checkout?.close(); } catch { /* nothing open */ }
}

/** "ZAR 20,562.00" style amounts for Paddle totals, in the checkout currency. */
export const fmtTotal = (amount: number, currency: string) => {
  try { return new Intl.NumberFormat('en-GB', { style: 'currency', currency, currencyDisplay: 'code' }).format(amount).replace(/ /g, ' '); }
  catch { return `${currency} ${amount.toFixed(2)}`; }
};
