/*
 * Checkout adapter (Paddle Billing, Paddle.js v2 overlay). The website only opens the checkout with the
 * order details in customData; the payment provider sends its webhook straight to the Obel control plane,
 * which verifies it and provisions the workspace. No secret and no provisioning logic lives here.
 * Contract: docs/CHECKOUT-CONTRACT.md.
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

let loading: Promise<any> | null = null;
function loadPaddle(onCompleted: () => void): Promise<any> {
  if (loading) return loading;
  loading = new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = 'https://cdn.paddle.com/paddle/v2/paddle.js';
    s.async = true;
    s.onload = () => {
      const P = window.Paddle;
      if (!P) { loading = null; return reject(new Error('Paddle.js did not load')); }
      if (checkout.environment === 'sandbox') P.Environment.set('sandbox');
      P.Initialize({
        token: checkout.clientToken,
        eventCallback: (e: { name?: string }) => { if (e?.name === 'checkout.completed') onCompleted(); },
      });
      resolve(P);
    };
    s.onerror = () => { loading = null; s.remove(); reject(new Error('Paddle.js did not load')); };
    document.head.appendChild(s);
  });
  return loading;
}

/** Opens the Paddle overlay. Resolves false (and does nothing) while checkout is not active. */
export async function openCheckout(order: OrderData): Promise<boolean> {
  const priceId = checkout.prices[order.plan]?.[order.billing];
  if (!checkout.enabled || !checkout.clientToken || !priceId) return false;
  const items = [{ priceId, quantity: 1 }];
  const onboarding = checkout.onboardingPrices[order.plan];
  if (onboarding) items.push({ priceId: onboarding, quantity: 1 });
  if (!isOrderRef(order.order_ref)) return false;
  const done = () => { window.location.href = statusUrl(order.order_ref); };
  let Paddle: any;
  try { Paddle = await loadPaddle(done); } catch { return false; }   // the caller falls back to the email request
  Paddle.Checkout.open({
    items,
    customer: { email: order.admin_email },
    customData: order,
    settings: {
      displayMode: 'overlay',
      theme: 'light',
      locale: 'en',
      allowLogout: false,
      successUrl: new URL(statusUrl(order.order_ref), window.location.origin).href,
    },
  });
  return true;
}
