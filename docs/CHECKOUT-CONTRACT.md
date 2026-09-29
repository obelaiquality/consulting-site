# Checkout and provisioning contract

Status: **not active.** `checkout.enabled` in `src/data/site.ts` is `false`. The site shows "coming soon" and sends workspace requests to the inbox. Version 1.1, 29 September 2026 (v1.1: provisioning trigger, replay window and launch checks corrected from Paddle's docs).

This document is the agreement between the website (this repo) and the Obel-MS control plane (Obel Cloud, `obelaiquality/obel-ms-saas`). Change it only by agreement on both sides.

## 1. Decision: Paddle Billing as merchant of record

We use **Paddle Billing** (not Paddle Classic) for every currency. Reasons:

1. Stripe does not accept South African companies. Only a US entity (Stripe Atlas) would work.
2. Paddle is the merchant of record. It is the seller to the customer, and it collects and pays VAT, GST and US sales tax in every country. We do not register for tax abroad.
3. Paddle handles subscriptions, the monthly and annual periods, one-time items (onboarding), invoices, the customer portal, dunning and card updates.
4. Paddle.js opens an overlay checkout from a static site. No website server is needed.
5. One provider gives one webhook contract, one customer record and one refund path.

Fee: about 5% + USD 0.50 per transaction, plus a conversion margin when the payment currency differs from the payout currency. The margin model uses 6.6%.

**Phase 2 (optional):** Paystack for South African customers who want EFT or lower card fees in ZAR. The website adapter (`src/scripts/checkout.ts`) is written so a second provider can be added behind the same `openCheckout(order)` call, and the control plane must accept the same order fields from either provider.

**Checked (29 Sep 2026, Paddle docs):** South Africa is a supported seller country. ZAR, USD, EUR, GBP and AUD are payment currencies. Payouts are monthly by wire or Payoneer (USD 100 minimum); the payout currency for an SA account must be confirmed at onboarding. Paddle reviews the business and approves the website domain before live checkout.

## 2. Flow

```
Website (static)            Paddle                         Control plane (Google Cloud)
----------------            ------                         ----------------------------
/checkout form
  builds OrderData  ──────▶ Checkout overlay
  (order_ref = UUID)         customer pays
                             subscription.created ────────▶ POST /v1/webhooks/paddle
                                                            1. verify Paddle-Signature (HMAC-SHA256)
                                                            2. de-duplicate by event_id
                                                            3. load the transaction from the Paddle API
                                                            4. validate items and customData
                                                            5. record the order, state = paid
                                                            6. provision in the chosen region cell
                                                            7. email the admin a set-password link
/checkout/status?order=… ◀─ redirect on checkout.completed
  polls ───────────────────────────────────────────────────▶ GET /v1/orders/{order_ref}
                                                            → { state, workspace_url? }
```

The website never holds a secret, never calls the Paddle API and never provisions anything. The webhook goes straight from Paddle to the control plane.

## 3. What the website sends (Paddle `customData`)

The website puts this object in `customData`. Paddle copies it to the transaction and the subscription, and includes it in webhooks.

| Field | Type | Rule |
| --- | --- | --- |
| `v` | number | `1` (contract version) |
| `order_ref` | string | Random UUID from the browser. Key for the status page. |
| `plan` | string | `lite`, `essentials` or `professional`. **Informational only.** |
| `billing` | string | `annual` or `monthly`. **Informational only.** |
| `region` | string | `za`, `eu`, `us` or `au`. `eu` also serves UK workspaces. |
| `company` | string | 2–120 characters. |
| `workspace` | string | Suggested slug, `[a-z0-9-]`, max 40. The control plane makes it unique. |
| `admin_name` | string | 2–120 characters. |
| `admin_email` | string | The first admin. Can differ from the Paddle customer (billing) email. |
| `ai_mode` | string | `openai` (consent given) or `local` (no external AI). |
| `ai_consent_at` | string or null | ISO time of consent when `ai_mode` is `openai`. |
| `terms_version` | string | The version of the subscription terms accepted. |
| `display_currency` | string | The currency the visitor saw. Paddle sets the charge currency. |

## 4. What the control plane must do

**Trust.** `customData` comes from the browser. Treat it as untrusted input.

1. **Signature.** Verify `Paddle-Signature` (`ts` and `h1`) with HMAC-SHA256 over `ts:raw_body` and the endpoint secret, with a timing-safe compare. Use Paddle's recommended timestamp tolerance (5 seconds; allow for clock skew only as far as Paddle's SDK does). Use the raw body, not re-serialised JSON.
2. **Idempotency and order.** Store `event_id` and return 200 for an event already processed. Return 200 within 5 seconds and do the work asynchronously. Delivery is at least once (live: up to 60 retries over 3 days) and not ordered, so compare `occurred_at` and never let an older event overwrite newer state.
3. **Source of truth.** Read the plan and the billing period from the **price IDs** on the transaction, never from `customData.plan`. Reject unknown price IDs.
4. **Validation.** `region` in the allow-list, else state `manual_review`. Slug sanitised and made unique. Email syntax checked. Strings trimmed and length-limited. Unknown fields ignored.
5. **Provisioning.** Create the tenant in the region cell, set plan limits (users, pages a month, storage), set the AI mode, create the admin user, send the set-password email. Record every step for the status API.
6. **Failure.** Any provisioning error sets `manual_review`, alerts Obel, and never refunds or cancels automatically.

**Events to handle**

| Paddle event | Action |
| --- | --- |
| `subscription.created` | **Provision** (Paddle's recommended access trigger). It carries `custom_data` and the `transaction_id`. Set state `paid`, then `provisioning`, then `ready`. |
| `transaction.paid` / `transaction.completed` | Record the payment (first and renewals). No provisioning. If it arrives before `subscription.created`, set state `paid` and wait. |
| `subscription.updated` | Apply plan changes (upgrade or downgrade limits). |
| `subscription.past_due` | Email the admin. Keep full access for 14 days. |
| `subscription.canceled` | Read-only at the end of the period. Export window of 30 days, then delete by the retention policy. |
| `subscription.paused` / `resumed` | Suspend or restore sign-in. |

## 5. Status API (read-only, public)

`GET /v1/orders/{order_ref}` returns `{ "state": "received" | "paid" | "provisioning" | "ready" | "manual_review" | "failed", "workspace_url": "https://…" }`.

- No personal data in the response. `workspace_url` only when `ready`.
- `order_ref` is a random UUID, so it cannot be guessed. Return 404 for an unknown reference.
- CORS: allow `https://obel-ai.com` only. Rate-limit by IP.

## 6. Paddle catalogue

- One product per plan. One recurring price per plan and billing period (6 prices), base currency USD, with `unit_price_overrides` by country: ZAR for ZA, EUR for the eurozone countries, GBP for GB, AUD for AU, matching `plans` in `src/data/site.ts` (monthly = annual + 15%). Paddle picks the currency from the customer's country.
- One-time onboarding prices for Essentials and Professional (`billing_cycle` null), added to the first transaction. They never enter renewals. Test this mix in the sandbox.
- Prices exclude tax. Paddle adds tax where it applies, and applies the reverse charge when a business gives a valid VAT number.
- Put the price IDs and the client-side token in `checkout` in `src/data/site.ts`. They are public by design.

## 7. Before `enabled: true`

1. Paddle account approved; sandbox tested end to end (pay, webhook, provision, email, status page).
2. Subscription terms and a refund policy published (Paddle requires Terms, Refund and Privacy pages before it approves the domain), and `checkout.termsUrl` set.
3. Privacy notice updated for GDPR and for Paddle as a processor.
4. At least one production region cell live, with the control plane deployed and monitored.
5. Security review (OWASP) of the webhook endpoint, the status API and this website flow.
6. Change the pricing billing line (`pricingTerms.billing`) to describe Paddle checkout.
7. Add a "Manage billing" link to Paddle's hosted customer portal (invoices, card, cancel; magic-link login).
