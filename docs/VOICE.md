# Obel voice

Obel is a team of quality consultants who write software. Our promise is the calm way to ISO 9001 certification. Obel-MS makes it easier for a company to get certified and to stay certified. The company earns the certificate from its certification body; we never imply that Obel certifies anyone. We sound like the best auditor you have worked with: calm, exact, practical and on your side. We write the way a well-kept quality system reads. Everything is in its place, and nothing is there for show.

## The four traits

1. **Calm.** We never rush the reader. There are no exclamation marks, no urgency tricks and no hype. Confidence comes from facts, not volume.
2. **Exact.** We name the real thing: "supplier certificate", "expiry date", "corrective action", "Quality Manager". A number beats an adjective. "Expires in 14 days" beats "stay ahead of expiries".
3. **Practical.** Every sentence helps a quality manager decide or act. We describe what happens, in the order it happens.
4. **Honest.** We say what Obel-MS does not do yet. We never inflate. Software supports ISO 9001; organisations get certified.

## How it sounds

| We write | We do not write |
| --- | --- |
| Obel-MS files each certificate under its supplier, manufacturer and product. | Say goodbye to messy folders — Obel-MS seamlessly organises everything. |
| Your team gets an email and a Teams message 30 days before a certificate expires. | Never miss an expiry again! |
| Hosting, backups and updates are included. | It's not just software, it's peace of mind. |
| Workflow Manager closes a corrective action with an effectiveness check. | Unlock the power of streamlined CAPA. |
| We do not offer single sign-on yet. It is on our roadmap. | SSO coming soon to supercharge your security! |

## Rules for every sentence

- **Use one idea per sentence.** Aim for 8 to 20 words. Vary the length a little, but never use a fragment for drama.
- **Use punctuation plainly.** Use full stops and commas. Do not use em dashes or spaced en dashes. Use a colon only to introduce a list or a label. Avoid semicolons in marketing copy. Use an en dash only in number ranges, such as "5–200".
- **Do not use contrast framing.** Avoid "not X, it's Y", "X, not Y", "not just X but Y", "without the X" and "no X, no Y, no Z". Say what the thing is.
- **Do not use a rule of three for rhythm.** List three items only when there really are three.
- **Do not use a question-then-answer device in marketing copy.** Guide headings may be questions, because they mirror what people search for.
- **Use sentence case everywhere**, in headings, buttons and labels.
- **Use plain verbs:** keep, check, file, approve, record, close, send, track.
- **Use South African / British spelling**, for example organisation and colour.
- **Use numerals** for every number, with ZAR written as R1,490.

## Banned words and phrases

seamless, seamlessly, effortless, robust, powerful, cutting-edge, next-generation, game-changer, revolutionise, supercharge, elevate, unlock, empower, leverage, streamline, delve, navigate (figurative), journey, landscape, tapestry, peace of mind, world-class, best-in-class, simply, just (as a softener), truly, genuinely, actually, really, very, "in today's fast-paced world", "at its core", "designed to", "it's worth noting", "whether you're", "say goodbye to", "look no further", "here's the thing", "the best part", "that's it".

## Headlines

- A headline is a calm, true statement of what the reader gets. It is not a slogan and not a pun.
- Keep it under 10 words when you can. Let the Syne type carry the weight.
- Good: "Every supplier certificate, current and on file." / "Corrective actions that close properly." / "Priced for small quality teams."
- The home hero is "The calm way to ISO 9001 certification." It names the outcome the customer wants, in the brand's calm register. Every other headline stays plain and specific.

## Buttons and labels

- A button says exactly what happens: "Book a demo", "See pricing", "Join the waitlist", "Send request".
- Error and status text says what happened and what to do next. It never apologises and never jokes.

## Before you publish

Run the checks in `docs/BUILD-SPEC.md` §4 and this voice guide. Then run:

```bash
grep -rn "—" src --include='*.astro' --include='*.ts' | grep -v "^\s*//\|/\*\|\* "
```

Every hit must be in a comment or a number range.
