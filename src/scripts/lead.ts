/*
 * Lead capture for a static site.
 *
 * 1. If `site.web3formsKey` is set, the request is POSTed to Web3Forms, which emails it to the
 *    inbox that owns the key. The key is public by design (it can only send to that inbox).
 * 2. If no key is set, or sending fails, we show a fallback panel: open the request in the
 *    visitor's email app, in Gmail or Outlook on the web, or copy it. Nothing is lost silently.
 */
import { site } from '../data/site';

export interface Lead {
  subject: string;
  replyTo?: string;
  name?: string;
  fields: Record<string, string>;
}

const ENDPOINT = 'https://api.web3forms.com/submit';

export const leadBackendEnabled = () => Boolean(site.web3formsKey);

export function leadText(lead: Lead) {
  return Object.entries(lead.fields)
    .map(([k, v]) => `${k}: ${v || '(none)'}`)
    .join('\n');
}

/** Returns true when the request reached the inbox. */
export async function sendLead(lead: Lead): Promise<boolean> {
  if (!site.web3formsKey) return false;
  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: site.web3formsKey,
        subject: lead.subject,
        from_name: 'obel-ai.com',
        ...(lead.replyTo ? { email: lead.replyTo, replyto: lead.replyTo } : {}),
        ...(lead.name ? { name: lead.name } : {}),
        botcheck: false,
        ...lead.fields,
      }),
    });
    const json = (await res.json().catch(() => ({}))) as { success?: boolean };
    return res.ok && json.success === true;
  } catch {
    return false;
  }
}

export function fallbackLinks(lead: Lead) {
  const to = site.email;
  const subject = encodeURIComponent(lead.subject);
  const body = encodeURIComponent(leadText(lead));
  return {
    mailto: `mailto:${to}?subject=${subject}&body=${body}`,
    gmail: `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(to)}&su=${subject}&body=${body}`,
    outlook: `https://outlook.office.com/mail/deeplink/compose?to=${encodeURIComponent(to)}&subject=${subject}&body=${body}`,
  };
}

/** Renders the "send it yourself" panel into `host`. `failed` changes the lead-in sentence. */
export function renderFallback(host: HTMLElement, lead: Lead, failed: boolean) {
  const links = fallbackLinks(lead);
  host.hidden = false;
  host.innerHTML = `
    <p class="lead-fb-title">${failed ? 'We could not send that automatically.' : 'Your request is ready.'} Send it one of these ways:</p>
    <div class="lead-fb-actions">
      <a class="btn btn-primary btn-sm" href="${links.mailto}">Open in email app</a>
      <a class="btn btn-ghost btn-sm" href="${links.gmail}" target="_blank" rel="noopener">Gmail</a>
      <a class="btn btn-ghost btn-sm" href="${links.outlook}" target="_blank" rel="noopener">Outlook</a>
      <button type="button" class="btn btn-ghost btn-sm" data-copy>Copy request</button>
    </div>
    <p class="lead-fb-note">Or email <a class="link-u text-ink" href="mailto:${site.email}">${site.email}</a> directly.</p>`;
  const copy = host.querySelector<HTMLButtonElement>('[data-copy]');
  copy?.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(`To: ${site.email}\nSubject: ${lead.subject}\n\n${leadText(lead)}`);
      copy.textContent = 'Copied';
    } catch {
      copy.textContent = 'Copy failed';
    }
  });
  host.querySelector<HTMLElement>('.lead-fb-title')?.focus?.();
}

/** Puts a button into its sending state (keeps the label, adds a spinner) and back. */
export function setSending(button: HTMLButtonElement | null, sending: boolean) {
  if (!button) return;
  button.disabled = sending;
  button.setAttribute('aria-busy', String(sending));
  button.classList.toggle('is-sending', sending);
}

/** Wires an "email + Join the waitlist" form. The form needs an email input and a status element. */
export function wireWaitlist(form: HTMLFormElement, note: HTMLElement | null, fallbackHost: HTMLElement | null) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const input = form.querySelector<HTMLInputElement>('input[type=email]');
    const email = (input?.value || '').trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      if (note) note.textContent = 'Enter a valid work email.';
      input?.focus();
      return;
    }
    const lead: Lead = {
      subject: 'IDC waitlist',
      replyTo: email,
      fields: { Request: 'Add me to the Internal Document Control waitlist.', Email: email },
    };
    const button = form.querySelector<HTMLButtonElement>('button[type=submit]');
    setSending(button, true);
    const sent = await sendLead(lead);
    setSending(button, false);
    if (sent) {
      if (note) note.textContent = 'You are on the list. We will email you when it opens.';
      form.reset();
      return;
    }
    if (note) note.textContent = '';
    if (fallbackHost) renderFallback(fallbackHost, lead, leadBackendEnabled());
  });
}
