# Plan — LA + Santa Barbara Trip Pitch Site

## Context

Build a one-page static pitch site for a week-long LA + Santa Barbara trip (May 19–26 2026) to show my husband Antonio. Goal: feel like a travel editorial (Cereal / Kinfolk / Condé Nast Traveler), not a spreadsheet. `BRIEF.md` in the project root already specifies content, palette, typography, section order, map coordinates, image keywords, and 12 acceptance criteria. The workspace currently contains only `BRIEF.md`.

Constraints worth flagging upfront (from brief):
- Opens directly from `file://` — no build step, no backend.
- Must look good at both 1440px and 390px (Antonio will likely view on phone).
- Works offline after first load (fonts/tiles are CDN on first load, then cached).
- The word "itinerary" must not appear anywhere. No emojis anywhere. No default blue underlined links. No default bullet points.

---

## Deliverables

Three files at `D:\My Drive\Projects\LA Trip\`:

- `index.html` — semantic structure for all 9 sections, Tailwind CDN + Leaflet CDN, Google Fonts `<link>`s, inline Tailwind config extending palette and font families.
- `styles.css` — typography scale, palette variables, layout primitives (max-width, gutters, alternating image/text rhythm), motion rules, map pin styles, mobile nav panel, media queries for 390px and 768px breakpoints, print stylesheet (nice-to-have).
- `script.js` — Leaflet init for 1 overview map + 8 per-day mini-maps, custom numbered terracotta divIcon, reservations checklist localStorage (`trip-2026-may-reservations`), IntersectionObserver fade-up, hamburger toggle, smooth-scroll anchors, "disable map interaction on small screens" logic.

No `assets/` directory — all imagery is embedded Unsplash URLs (`https://images.unsplash.com/photo-<ID>?auto=format&fit=crop&w=<width>&q=80`).

---

## Page structure (top → bottom)

Follows brief §"Site structure" exactly:

1. **Sticky nav** — wordmark "May 19–26" + anchor links to each day, Hotel, Reservations. Mobile: hamburger → slide-out panel.
2. **Hero** — 100vh, full-bleed Santa Barbara/Malibu cover, eyebrow "A WEEK ON THE COAST", title "Los Angeles & Santa Barbara", dates, italic subtitle, scroll cue.
3. **The pitch** — 3 paragraphs of prose from brief, centered column, pull quote in oversized Fraunces italic terracotta between paragraphs 2 and 3.
4. **The route** — overview Leaflet map (~420px desktop) with dotted PCH polyline between Santa Monica → Malibu → Santa Barbara → Los Olivos pins; below it a horizontal 8-stop timeline strip (Day 1–8, dates, labels, dots on a line).
5. **Day 1–8 sections** — alternating image-left/text-right rhythm. Each day has: eyebrow `DAY N — DATE`, Fraunces headline, 1–2 paragraph narrative, custom-styled stops list with times and small pin markers, a ~250px mini-map, 1–2 photos with small italic terracotta captions.
6. **Hotel Californian spread** — 1 large photo + 3–4 detail shots, address, nights, narrative paragraph, bulleted amenities, Belmond El Encanto as alternative callout.
7. **Santa Ynez wine country spread** — vineyard imagery, narrative, callouts for Refugio Ranch / Bell's / Solvang / Ballard Canyon. Sage accent used sparingly here.
8. **Reservations checklist** — 7 rows (Hotel Californian, Rental car, Bestia/Bavel, Bell's, The Broad, Academy Museum, Refugio Ranch), each with custom checkbox, name, what, deadline, priority pill. Checked state: strikethrough, sage accent, faded, persisted to localStorage.
9. **Practical notes** — weather (LA / SB / Santa Ynez), flights, car, packing cues. Quiet typography, no decoration.
10. **Footer** — terracotta rule above, left "Built with care · April 2026", right "Photography via Unsplash and Wikimedia Commons".

---

## Design system (lock these in first)

**Palette** (expose as CSS custom properties and extend Tailwind config):
- `--paper`: `#F7F4EF`
- `--ink`: `#1F1F1D`
- `--terracotta`: `#C87A5C`
- `--sage`: `#8A9A6B`

**Typography:**
- Display: Fraunces (weights 400, 500, 600; italic; opsz variable)
- Body: Inter (400, 500)
- Eyebrow labels: Inter 12px, `letter-spacing: 0.15em`, uppercase

**Layout:**
- Content max-width: 1100px with generous side gutters.
- Full-bleed allowed for hero and some day photos.
- Generous vertical rhythm between sections (clamp-based spacing).

**Motion:**
- IntersectionObserver fade-up: `translateY(40px) → 0`, `opacity 0 → 1`, 600ms ease-out, trigger once.
- Hero parallax: subtle, ~20% speed differential, `transform: translateY(scrollY * 0.2)`.
- Smooth scroll via `scroll-behavior: smooth` on `html`.

**Link styling:** terracotta underline with custom offset, no default browser blue anywhere.

**Lists:** remove default bullets; use pseudo-element markers (small terracotta dot or em-dash).

---

## Maps (9 total)

Shared setup in `script.js`:
- Tiles: **CartoDB Positron** (`https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png`). Attribution at smallest readable size.
- Custom pin: Leaflet `divIcon`, HTML is a small terracotta circle with white numeral, numbered in stop order for that day.
- Mobile (<768px): `dragging`, `scrollWheelZoom`, `touchZoom`, `doubleClickZoom` disabled; tap layer overlays "Tap to enable" or just static. Go with static for simplicity unless the brief forces otherwise.
- Overview map: zoom to fit bounds around SM / Malibu / SB / Los Olivos; dotted polyline traces Santa Monica → Malibu → Santa Barbara → Los Olivos (not real PCH geometry, just a visual PCH cue — dashed terracotta stroke).
- Per-day maps: fit bounds tight to that day's stops; single broad pin for days with just one stop (Day 1, Day 8 partial).

Coordinates are already supplied in brief for every stop — copy them directly.

---

## Imagery strategy

The brief gives search keywords per slot. Approach: pre-pick Unsplash IDs during implementation, sized per slot (e.g., `w=1800` for hero, `w=1200` for day photos, `w=800` for detail shots), `auto=format&fit=crop&q=80`. Each `<img>` gets a small italic terracotta caption underneath.

Preference order per brief: Unsplash → Wikimedia Commons → Pexels. Tone: warm, golden-hour, natural light, no visible faces.

Image slots (17–20 total, depending on hotel/wine spreads):
- Hero cover (1)
- Day 1–8: 1–2 each (~12)
- Hotel Californian: 1 large + 3–4 detail (~5)
- Santa Ynez spread: 2–3 vineyard shots

---

## Reservations checklist — behavior

Rows from brief table (7 items). Each row is a labeled `<label>` wrapping a custom-styled checkbox, with priority pill (CRITICAL / HIGH / MEDIUM / LOW — terracotta for CRITICAL/HIGH, sage for MEDIUM, muted for LOW).

- Each row has a stable `data-id` (e.g., `hotel-californian`, `rental-car`, `bestia-bavel`, `bells`, `the-broad`, `academy-museum`, `refugio-ranch`).
- On `change`, read all checkbox states into an object and `localStorage.setItem('trip-2026-may-reservations', JSON.stringify(state))`.
- On load, read and restore.
- Checked row: apply `.checked` class → strikethrough, sage color, `opacity: 0.55`.

---

## Responsive rules

- ≥1024px: alternating 2-col day sections (image / text), 12-col max grid within 1100px.
- 768–1023px: stacked but preserving 2-col for features.
- <768px: single column, hamburger nav, image captions still small, mini-maps non-interactive, timeline strip becomes vertical list or horizontal scroller.

---

## Implementation order

1. **Scaffold** — `index.html` with `<head>` (fonts, Tailwind CDN, Leaflet CDN, Tailwind inline config), empty section shells with IDs for nav anchors.
2. **Design system** — `styles.css` palette vars, typography scale, link/list resets, eyebrow utility.
3. **Hero + pitch + timeline strip** — nail the editorial feel here before touching day sections; a bad hero sinks the rest.
4. **Day sections scaffold** — 8 sections with alternating layout, placeholder images, real copy from brief.
5. **Maps** — overview first (proves tile + pin logic), then clone into per-day mini-maps.
6. **Hotel + wine country spreads.**
7. **Reservations checklist + localStorage.**
8. **Practical notes + footer + nav (desktop).**
9. **Motion** — IntersectionObserver, hero parallax, smooth scroll.
10. **Mobile pass** — hamburger, stacking, disable map interaction, test at 390px.
11. **Image pass** — swap placeholder URLs for picked Unsplash IDs; verify no broken images.
12. **Acceptance sweep** — walk all 12 criteria from brief, run word-find for "itinerary" and emoji characters.

---

## Critical files

All three files live at project root:
- `D:\My Drive\Projects\LA Trip\index.html`
- `D:\My Drive\Projects\LA Trip\styles.css`
- `D:\My Drive\Projects\LA Trip\script.js`

---

## Nice-to-haves (decide before/during impl)

From brief §"Nice-to-haves":
- Share button that copies URL → cheap, ~10 LOC. Include by default.
- Print stylesheet for A4 → moderate effort (hide maps/nav, serif body, page-break rules). Include if time.
- "Day N of 7" progress bar tied to scroll → nice but conflicts with calm editorial tone; I'd skip unless user asks.

---

## Verification

After implementation, walk these in order:

1. Double-click `index.html` → opens via `file://`, no console errors, no broken images, fonts load.
2. DevTools device toolbar → verify at 1440px desktop and 390px iPhone viewport. All text readable, nav works in both modes.
3. Scroll top to bottom → fades trigger, anchor links from nav jump smoothly, hero parallax subtle.
4. All 9 maps render CartoDB tiles with numbered terracotta pins at correct coordinates. Overview map shows dotted PCH line.
5. Toggle 3 reservations checkboxes, reload page → state persists.
6. Walk all 12 acceptance criteria from brief §"Acceptance criteria":
   - Opens from `file://` ✓
   - Anchor scrolling smooth ✓
   - Maps render ✓
   - Images load ✓
   - Mobile 390px not broken ✓
   - Checkbox persistence ✓
   - Fraunces + Inter loaded ✓
   - Exact palette hex codes ✓
   - `Ctrl+F "itinerary"` → 0 matches ✓
   - No blue underlined links ✓
   - No default bullets ✓
   - No emojis (grep for emoji unicode ranges) ✓
7. Final visual pass: does this feel like Cereal / Kinfolk / Condé Nast Traveler, or does it feel like a startup landing page? Adjust whitespace and photo scale if the latter.
