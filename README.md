# VMA Management LLC — website

One-page marketing site for VMA Management LLC. Plain static HTML, CSS, and vanilla
JavaScript. No framework, no build step, no npm, no CDN. Built to the spec in
[`BRIEF.md`](BRIEF.md).

The single goal of the page is to get a local business owner to book a 20-minute call
on the embedded calendar at `#book`.

---

## ⚠️ Fill these in before you launch

Three placeholders ship in the repo. The site works without them, but it is not
finished until all three are done.

### 1. Founder name — required

Find and replace **every** `[FOUNDER NAME]` in `index.html` with your real name. All of
them are in the "Who you're dealing with" section:

- the opening sentence, "I'm [FOUNDER NAME]." — live text
- the signature line, "— [FOUNDER NAME]" — live text
- the `alt` text and the caption inside the commented-out founder photo block, so they
  are already correct if you switch that block on later

This is the single most important placeholder — the section exists to name one
accountable human.

### 2. Booking calendar — required

Open `index.html`, find the block marked `<!-- BOOKING EMBED -->`, and paste your
calendar's **embed** URL between the quotes:

```html
<div class="book__embed" data-booking-src="https://your-calendar-url-here" ...>
```

The calendar then loads lazily, inside the page, with no redirect off-site. Until you
fill it in, visitors see a "call or text us instead" panel with your phone number, so
the section is never broken or empty.

> Why `data-booking-src` and not `src=""` directly on an `<iframe>`? An iframe with an
> empty `src` makes the browser re-load the current page inside the frame, which nests
> the site inside itself. The attribute avoids that. `main.js` builds the real
> `<iframe loading="lazy">` from it. The equivalent hand-written iframe markup is in a
> comment right above the block if you would rather do it manually.

### 3. Chat widget — optional

Paste the provider's snippet immediately before `</body>` in `index.html`,
`privacy.html`, and `terms.html`. Nothing else needs to change.

**If the widget collects a phone number, it must show an SMS consent checkbox.** This
is required for carrier messaging (A2P 10DLC) registration and is checked by a human
reviewer. A ready-made, already-styled block is below — drop it into any form that
asks for a phone number:

```html
<div class="consent">
  <input type="checkbox" id="sms-consent" name="sms-consent" required>
  <label for="sms-consent">
    I agree to receive text messages from VMA Management LLC about my inquiry.
    Message and data rates may apply. Message frequency varies. Reply STOP to opt out.
    See our <a href="/privacy">Privacy Policy</a>.
  </label>
</div>
```

The `.consent` styles are already in `styles.css`. No CSS work needed.

---

## Deploying

The Vercel project is connected to this GitHub repo and rebuilds automatically on every
push to `main`. Do not run `vercel deploy` by hand.

```bash
git add -A && git commit -m "your message" && git push origin main
```

### First-time Vercel import

1. Vercel dashboard → **Add New… → Project** → import `Cam2420/vma-management-site`.
2. **Framework Preset: Other.** Leave Build Command and Output Directory empty — this
   is a static site with no build step.
3. Deploy.
4. **Settings → Domains** → add `vmamgmt.com` and `www.vmamgmt.com`. Set `www` to
   redirect to the apex. Vercel issues HTTPS certificates and forces HTTPS on its own.

`vercel.json` already sets clean URLs (so `/privacy` works, not `/privacy.html`),
long-lived immutable caching for `/fonts`, `/assets`, and `/img`, plus HSTS and
`X-Content-Type-Options` headers.

### After the domain is live

- Submit `https://vmamgmt.com/sitemap.xml` in Google Search Console.
- Start A2P 10DLC brand and campaign registration. `/privacy` is a prerequisite and the
  approval queue is not under your control, so start it the day the site is live.

---

## Editing the copy

**All copy lives in `index.html`.** Every section has a numbered HTML comment banner
above it saying what the section is, so you can find what you want without reading any
code. For example:

```html
<!-- ============================================================
     3. THE PROBLEM  —  three lines, then the arithmetic
     ============================================================ -->
```

Edit the text between the tags. Do not touch the tags themselves.

Three comments in `index.html` are load-bearing — leave them where they are:

- `<!-- TERMS MENTION 1 of 3 -->` — hero microcopy
- `<!-- TERMS MENTION 2 of 3 -->` — Simple terms section
- `<!-- TERMS MENTION 3 of 3 -->` — first FAQ answer

The commercial terms are stated exactly three times on the page, by design. If you add
a fourth, the page starts to sound defensive about a number it never prints.

### Two sections are built but switched off

Both are fully styled and ready. To turn either on, delete the two comment markers
wrapping it in `index.html`.

| Block | Where | Turn it on when |
|---|---|---|
| `<!-- FOUNDER PHOTO -->` | inside "Who you're dealing with" | You have a phone photo. Drop it at `img/founder.webp`, square, 400×400 or larger. This is the cheapest trust upgrade available to a business with no testimonials. |
| Testimonials section | after "Who you're dealing with" | A real client agrees, with a real name, real business, and real city. Not before. |

### Never put a price on this page

No dollar figure, no "starting at," no "custom quote." The terms are: one flat monthly
fee, no setup fee, month-to-month, cancel any time, live in 30 days or full refund. The
number is delivered in the pre-call video and confirmed on the call.

The only dollar figures anywhere on the site are `$900` and `$3,600` in the problem
section, and those are the reader's own numbers, not yours.

### Never print a formation year

No founding date, no "since 20XX", anywhere — including the JSON-LD schema, which
deliberately omits `foundingDate`. The only years on the site are the copyright year in
the footer (updated automatically by `main.js`) and the "Last updated" dates on the
legal pages.

---

## File tree

```
.
├── index.html              the whole marketing page, all copy, JSON-LD schema
├── privacy.html            includes the SMS / text-messaging consent language
├── terms.html
├── styles.css              all styles, mobile-first from 375px
├── main.js                 booking iframe, reply-bubble fade, copyright year
├── vercel.json             clean URLs, cache headers, security headers
├── robots.txt
├── sitemap.xml
├── site.webmanifest
├── favicon.ico             16 / 32 / 48
├── favicon-16x16.png
├── favicon-32x32.png
├── apple-touch-icon.png    180×180
├── icon-192.png
├── icon-512.png
├── assets/
│   ├── VMA logo.png            original supplied lockup, navy background
│   ├── VMAlogo.png             original supplied square mark
│   ├── VMA Transparent.png     original supplied lockup, transparent
│   ├── vma-lockup-navy.webp    header lockup, cropped + 2×, lossless
│   └── vma-lockup-light.webp   footer lockup, cropped + 2×, lossless
├── fonts/
│   ├── archivo-latin.woff2         display  (variable, 100–900)
│   ├── inter-latin.woff2           body     (variable, 100–900)
│   └── jetbrains-mono-latin.woff2  timestamp only (variable, 100–800)
└── img/
    └── og.png              1200×630 social card
```

The three original PNGs are kept as the source of truth for future re-exports. They are
**not** downloaded by visitors — the page loads only the two cropped WebP derivatives.

### About the logo files

The header background is `--navy #082963` because `VMA logo.png` has that exact navy
baked into it — sampled and confirmed pixel-for-pixel. The lockup therefore sits on the
header bar with no visible edge. **Every derivative is compressed losslessly on
purpose.** Lossy compression shifts that flat navy by a shade or two and a faint
rectangle appears around the logo.

The footer and the OG image use `VMA Transparent.png`, whose wordmark is white — it only
works on a dark background.

**Before launch, if you can:** export an SVG of the mark from Canva and swap it in. PNG
logos in a header are either soft on retina screens or heavy. The current files are 2×
compressed PNG/WebP, which is the recommended fallback, not the ideal.

---

## Quality checks

Verified on this build.

### Contrast — WCAG AA

Every text and background pair on the site:

| Element | Pair | Ratio | Needs | |
|---|---|---|---|---|
| Body text, headings | navy on white | **13.93:1** | 4.5 | pass |
| Text on paper bands | navy on paper | **12.63:1** | 4.5 | pass |
| Button labels | navy on cyan | **8.07:1** | 4.5 | pass |
| Reply bubble text | navy on cyan | **8.07:1** | 4.5 | pass |
| Header, navy bands, footer | white on navy | **13.93:1** | 4.5 | pass |
| Hero terms microcopy | muted on white | **6.08:1** | 4.5 | pass |
| FAQ answers, fine print | muted on white | **6.08:1** | 4.5 | pass |
| Step text on paper | muted on paper | **5.52:1** | 4.5 | pass |
| Terms checkmarks | cyan on navy | **8.07:1** | 3.0 | pass |
| Focus ring, light sections | navy on white | **13.93:1** | 3.0 | pass |
| Focus ring, navy sections | white on navy | **13.93:1** | 3.0 | pass |

Lowest text ratio anywhere: **5.52:1**, against a 4.5:1 requirement.

Two combinations are deliberately never used:

- **cyan text on white = 1.73:1.** Cyan is a fill colour only — never text, links, or
  thin strokes on a light background.
- **muted text on navy = 2.29:1.** The footer therefore uses white for everything and
  carries hierarchy with size and weight instead of colour.

`--rule #D7DEE8` hairlines sit at 1.35:1 against white. They are decorative dividers,
not interactive components or meaningful graphics, so WCAG 1.4.11 does not apply.

### Accessibility

- Keyboard navigable end to end, with a skip link.
- Visible 3px focus rings that switch colour by context — navy on light sections, white
  on navy ones — so the ring is always visible.
- Verified `:focus-visible` fires on real keyboard input.
- FAQ uses native `<details>` / `<summary>`. No JavaScript, works with assistive tech.
- Real alt text on both logo images; decorative SVG icons are `aria-hidden`.
- `prefers-reduced-motion` removes the one animation and disables smooth scrolling.

### Performance

Total first-visit page weight, uncompressed: **155.9 KB** against a 300 KB budget.
Vercel serves it with Brotli, so the real transfer is meaningfully smaller.

| | |
|---|---|
| fonts (3 × variable woff2, latin) | 104.6 KB |
| index.html | 17.3 KB |
| styles.css | 17.6 KB |
| both logo images | 15.6 KB |
| main.js | 3.3 KB |

Fonts are the bulk of it. Google now ships Archivo, Inter, and JetBrains Mono as
variable woff2, so three files cover all five weights the design uses (Archivo 700/800,
Inter 400/600, JetBrains Mono 400) with no extra requests. Inter and Archivo are
preloaded; all three are `font-display: swap`, self-hosted, latin subset. No CDN, no
Google Fonts link, no analytics library, no icon packs, no jQuery.

### Animation

There is exactly one animation on the site: the reply bubble in the hero fades in once.
It runs on desktop widths only, never repeats, and is disabled entirely under
`prefers-reduced-motion`. That test lives in a CSS media query rather than in
JavaScript, so it re-evaluates when the window is resized or a phone is rotated.
`main.js` only reports when the bubble scrolls into view, and a timed fallback
guarantees the bubble can never be left invisible if scripting fails.

---

## Local preview

Any static server works. The site uses root-absolute paths (`/styles.css`), so opening
`index.html` straight off the filesystem will not load the CSS — use a server.

```bash
cd ~/Documents/vma-management-site && python3 -m http.server 8912
```

Then open `http://localhost:8912`. Note that `python3 -m http.server` does not do clean
URLs, so browse to `/privacy.html` locally. On Vercel it is `/privacy`.

---

## Copy still worth a second look

These answers state business policy, so read them once and confirm they match what you
actually intend to offer:

- **`terms.html`, Billing and cancellation** — says cancellation takes effect at the end
  of the billing month and partial months are not pro-rated.

### Do not flatten the ownership answer

FAQ #3 ("Do I own my website?") and the Ownership section of `terms.html` deliberately
draw a line between two different things:

| | On cancellation |
|---|---|
| The **website** — the HTML, CSS, JS in this repo, plus your domain, name, photos, content | stays live, stays yours, fully portable |
| The **automation** — missed-call text-back, lead follow-up, review requests | runs on VMA's platform, stops unless the client takes it over |

This wording is settled and was reviewed specifically because ownership ambiguity is the
most common cause of ugly cancellations. An answer that just says "yes, you own it" reads
better and is the exact ambiguity that turns a cancellation into a dispute. If you shorten
this copy later, keep the distinction. The portability of the site is a genuine selling
point — say it, but say what stops alongside it.

`terms.html` necessarily restates the commercial terms, since that is what a terms page
is for. The "exactly three times" rule applies to the marketing page, `index.html`.
