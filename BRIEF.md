# Trip Pitch Site — LA + Santa Barbara, May 19–26 2026

A one-page static website pitching a week-long trip to my husband Antonio. The job of this site is to convince him this is the right plan — so it needs to feel like a travel editorial, not a spreadsheet. Magazine vibe: big imagery, generous whitespace, confident typography, restrained palette.

---

## Output

- **Single static site**, deployable to any static host (GitHub Pages, Netlify drop, or just opened as `file://`)
- **No build step required** — I want to open `index.html` directly and have it work
- Structure: `index.html`, `styles.css`, `script.js`, plus an `assets/` folder if needed
- Must work offline once loaded (fonts and map tiles can be CDN-loaded, but no dynamic backend)
- Must look great on both desktop (1440px) and mobile (390px) — Antonio will probably open it on his phone

## Tech stack

- **Plain HTML / CSS / JS**, no framework. Keep it simple and fast.
- **Tailwind via CDN** for utility classes: `<script src="https://cdn.tailwindcss.com"></script>` — fine for this use case
- **Leaflet** for maps (CDN, no API key needed): https://unpkg.com/leaflet@1.9.4/
- **OpenStreetMap** tiles for Leaflet (free, attribution required)
- **Google Fonts** for typography
- Smooth scrolling between sections; subtle fade-in on scroll is welcome but don't over-do it

---

## Design direction

Think Cereal Magazine, Kinfolk, Condé Nast Traveler's web features. Editorial, calm, confident. Not "startup landing page." Not "travel blog." Editorial.

**Palette:**
- Background: warm off-white `#F7F4EF` (paper feel)
- Ink / body text: deep charcoal `#1F1F1D` (not pure black)
- Accent: muted terracotta `#C87A5C` (for links, accents, the occasional rule)
- Secondary accent: sage/olive `#8A9A6B` (used sparingly — maybe wine-country section)

**Typography:**
- Display / headlines: **Fraunces** (Google Fonts) — serif with personality, variable, weight 400–600, use italic and opsz variants
- Body: **Inter** (Google Fonts) — weight 400 and 500, excellent on screen
- Optional small caps / eyebrow labels: Inter at 12px, letter-spacing 0.15em, uppercase

**Layout rules:**
- Wide outer gutters on desktop (max content width ~1100px, with hero sections allowed full-bleed)
- Generous vertical rhythm — air between sections
- Photos are BIG. Don't be shy. Some full-bleed, some 2/3 width offset.
- Captions are small italics, terracotta color, below images
- Pull quotes / "why this works" statements can be oversized Fraunces italic in terracotta

**Navigation:**
- Sticky top nav with: logo/wordmark ("May 19–26") and anchor links to each day + Hotel + Reservations
- On mobile, collapse to a hamburger with slide-out panel

**Motion:**
- Scroll-triggered fade-up on section entry (use IntersectionObserver, 40px translate → 0, 600ms ease-out)
- Parallax on hero image OK but subtle (max 20% speed difference)
- No autoplay video, no carousels that move on their own

---

## Image sourcing

I don't have images on hand. For each image slot below, use **Unsplash** — search their public site for the keywords I provide, pick a strong editorial photo, and embed the direct image URL (pattern: `https://images.unsplash.com/photo-<ID>?auto=format&fit=crop&w=<width>&q=80`).

Fallback chain if Unsplash is unavailable: Wikimedia Commons → Pexels.

Keep photo tone consistent: prefer warm, golden-hour, natural light. Avoid heavily filtered / HDR shots. Avoid anything with visible people's faces if possible — landscapes, architecture, food, landmarks.

**Credits:** tiny attribution line at the bottom of the page ("Photography via Unsplash and Wikimedia Commons").

---

## Map implementation

Use Leaflet with OpenStreetMap tiles. Specific requirements:

1. **Overview map** near the top of the page: shows the full LA ↔ Santa Barbara loop with a dotted line for the PCH drive, pins at key clusters (LA, Malibu, Santa Barbara, Los Olivos). Height ~420px on desktop.

2. **Per-day mini-maps** inside each day's section: small (~250px tall), zoomed tight to that day's stops. Shows 1–3 pins.

3. **Styling:** use a muted tile layer. Good free options:
   - CartoDB Positron (very clean, minimal): `https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png`
   - Stadia Outdoors or Stamen Toner Lite are also acceptable
4. **Custom pin icons:** small terracotta circles (divIcon with CSS), numbered `1 2 3…` to match the order of stops in that day
5. **Disable zoom/pan interaction on mobile** (scroll conflict) — tap-to-enable pattern, or just static display
6. **Attribution:** bottom-right as Leaflet defaults, but with the smallest possible font

Coordinates for every pin are included in the content below.

---

## Site structure (top to bottom)

1. **Hero** — full-viewport height. Cover photo (Santa Barbara coastline or Malibu), title, dates, subtitle, scroll cue.
2. **The pitch** — 2–3 paragraphs of prose explaining the shape of the trip. Pull quote in the middle.
3. **The route** — overview map + a horizontal timeline showing Day 1 → Day 8 as a visual strip
4. **Day by day** — 8 sections, one per day. Alternating layout (image left / text right, then text left / image right) for visual rhythm. Each has:
   - Eyebrow label: `DAY N — DATE`
   - Headline (Fraunces, ~48px)
   - 1–2 paragraph narrative
   - Bullet list of specific stops with times and tiny location pins
   - Mini-map
   - 1–2 photos
5. **Hotel Californian feature** — dedicated spread. 1 large photo, 3–4 detail shots, address, why-this-hotel paragraph, alternatives.
6. **Santa Ynez wine country feature** — similar dedicated spread with vineyard imagery
7. **Reservations checklist** — interactive. Each row has a checkbox (stored in localStorage so state persists), the name, what it is, and a deadline. Terracotta accent on checked items.
8. **Practical notes** — weather, car rental, flight times already on calendar
9. **Footer** — photo credits, a line like "Built with care, May 2026"

---

## Full content

### Hero

- **Cover image search:** "Santa Barbara coastline palm trees sunset" OR "Malibu pacific coast highway aerial"
- **Eyebrow label:** "A WEEK ON THE COAST"
- **Title:** "Los Angeles & Santa Barbara"
- **Dates:** "May 19 – 26, 2026"
- **Subtitle (body, italic):** "Seven days. Two cities. One road between them."

### The pitch (2-3 paragraphs)

> **Paragraph 1:** A week in Los Angeles doesn't have to mean seven days in Los Angeles. The flight from Tel Aviv lands us in a city that's as much a collection of neighborhoods as it is a single place — and the coast just north of it, up the Pacific Coast Highway, opens into something quieter: Santa Barbara, a town with Spanish-tile roofs and a working waterfront, and behind it the Santa Ynez valley, thirty minutes inland, where the vineyards start.
>
> **Paragraph 2:** So the plan is this. Four days in Los Angeles — the Getty, the Academy Museum, Griffith Observatory at sunset, and a slow dinner in the Arts District. Then a drive up the coast on a Friday morning, lunch at Malibu Pier, a stop at El Matador Beach for the sea stacks, and two nights at Hotel Californian on State Street. One of those days is for the wine country. The other is for Santa Barbara itself — the Mission, the waterfront, and not much else.
>
> **Paragraph 3:** Sunday afternoon we drive back. Two more days in LA — downtown this time, The Broad and Grand Central Market — and then Venice on the way to the airport. No wasted days. No zig-zagging. The Santa Barbara leg is the good surprise in the middle.

**Pull quote (between para 2 and 3):**
> *"The drive up the coast is itself the good part."*

### The route — timeline strip

Horizontal strip, 8 stops. Each stop: day number, weekday + date, location label, dot on a line. Active/hover state subtly highlights.

| Day | Date | Label |
|---|---|---|
| 1 | Tue May 19 | Arrival · Santa Monica |
| 2 | Wed May 20 | Getty & Westside |
| 3 | Thu May 21 | Hollywood & Griffith |
| 4 | Fri May 22 | PCH → Santa Barbara |
| 5 | Sat May 23 | Santa Ynez wine country |
| 6 | Sun May 24 | SB morning → back to LA |
| 7 | Mon May 25 | Downtown LA |
| 8 | Tue May 26 | Venice → LAX |

---

### Day 1 — Tue May 19 · Arrival

**Headline:** "Landing slowly"

**Narrative:** "We land mid-afternoon, already tired, and we don't pretend otherwise. Check in, drop the bags, walk the Santa Monica boardwalk until the sun is gone. Dinner somewhere we can walk to. The rest of the week can wait."

**Stops:**
- LAX arrival — 2:55 PM (LY 5)
- Hotel check-in — Santa Monica area
- Santa Monica Pier sunset walk

**Map:** single broad pin over Santa Monica (lat `34.0089`, lng `-118.4973`)

**Image keywords:** "Santa Monica pier dusk golden hour"

---

### Day 2 — Wed May 20 · The Getty

**Headline:** "Travertine and gardens"

**Narrative:** "The Getty Center earns every superlative. Richard Meier's travertine campus sits on a hill above the 405, and you ride a tram up to reach it. Half a day here is the right amount — the collection, the gardens, the Pacific views from the terrace. Lunch down in Brentwood afterward."

**Stops:**
- The Getty Center — 10:30 AM · lat `34.0773`, lng `-118.4733`
- Lunch in Brentwood
- Easy evening

**Image keywords:** "Getty Center Los Angeles architecture travertine" + "Getty Center gardens Robert Irwin"

---

### Day 3 — Thu May 21 · Hollywood & Griffith

**Headline:** "Film history, then the city from above"

**Narrative:** "The Academy Museum opened recently and is quietly the best museum in LA right now — costumes, props, the craft of filmmaking. Three hours, easy. Lunch on Larchmont, then up to Griffith Observatory. Time the arrival for an hour before sunset: the city goes from gold to blue to a grid of lights."

**Stops:**
- Academy Museum of Motion Pictures — 10:00 AM · lat `34.0635`, lng `-118.3608`
- Lunch on Larchmont Boulevard
- Griffith Observatory — 5:30 PM · lat `34.1184`, lng `-118.3004`

**Image keywords:** "Griffith Observatory sunset LA skyline" + "Academy Museum LA Renzo Piano sphere"

---

### Day 4 — Fri May 22 · PCH → Santa Barbara

**Headline:** "The drive is the day"

**Narrative:** "Mid-morning checkout, then the coast. The Pacific Coast Highway from Santa Monica to Santa Barbara is two and a half hours of cliffs and water, and there are two stops worth making. Lunch on the pier at Malibu Farm. An hour at El Matador Beach, where the sand gives way to sea stacks and caves. Check in at Hotel Californian by evening — one block from the beach, on the edge of the Funk Zone — and walk up State Street for dinner."

**Stops:**
- Checkout LA hotel — 10:30 AM
- Malibu Farm Pier Cafe — 12:30 PM · lat `34.0371`, lng `-118.6767`
- El Matador State Beach — 2:30 PM · lat `34.0380`, lng `-118.8747`
- **Hotel Californian check-in — 5:00 PM · lat `34.4133`, lng `-119.6900`**
- Dinner on State Street

**Image keywords:** "El Matador Beach Malibu sea stacks" + "Pacific Coast Highway Malibu cliffs"

---

### Day 5 — Sat May 23 · Santa Ynez wine country

**Headline:** "Thirty minutes inland"

**Narrative:** "Los Olivos is a wine-tasting village you can walk around. Park once, visit three rooms on foot, have a long lunch somewhere with a patio. Refugio Ranch for the Grenache, Stolpman for the Roussanne, and if Bell's has a lunch reservation open that's the one — a Michelin-starred French bistro in what still looks like a one-stoplight town. Back to Santa Barbara before sunset. Dinner in the Funk Zone near the hotel."

**Stops:**
- Los Olivos village walk — from ~11:30 AM · lat `34.6697`, lng `-120.1155`
- Refugio Ranch tasting room · lat `34.6672`, lng `-120.1147`
- Lunch at Bell's (reservation required)
- Optional: Solvang on the drive back (touristy but photogenic Danish village)
- Sunset at Hotel Californian rooftop

**Image keywords:** "Santa Ynez valley vineyards" + "Los Olivos California wine tasting" + "Central coast California vineyard golden hour"

---

### Day 6 — Sun May 24 · SB morning → back to LA

**Headline:** "The Queen of the Missions, then south"

**Narrative:** "One easy morning in Santa Barbara before the drive back. The Old Mission is the city's founding building — Spanish colonial, ochre stucco, a long garden, and a view down to the ocean from the forecourt. Brunch at Helena Avenue Bakery. On the road by two, back in LA by four, dinner at Bestia or Bavel in the Arts District — whichever has the earlier reservation."

**Stops:**
- Old Mission Santa Barbara — 10:00 AM · lat `34.4383`, lng `-119.7141`
- Brunch at Helena Avenue Bakery
- Drive to LA — 2:00 PM
- Dinner: Bestia or Bavel, Arts District

**Image keywords:** "Old Mission Santa Barbara facade" + "Mission Santa Barbara garden"

---

### Day 7 — Mon May 25 · Downtown LA

**Headline:** "Contemporary, concrete, and market lunch"

**Narrative:** "The Broad is an oddity — a contemporary art museum funded by billionaires, set inside a perforated honeycomb shell across from Disney Hall. Free timed ticket, one hour inside. Grand Central Market is a two-minute walk across the street: a hundred years old, and still the best lunch in downtown. Afternoon wandering the Arts District — galleries, warehouses turned into coffee roasters, murals."

**Stops:**
- The Broad — 11:00 AM · lat `34.0545`, lng `-118.2502`
- Grand Central Market — 1:30 PM · lat `34.0509`, lng `-118.2491`
- Arts District afternoon — around `34.0394`, `-118.2350`

**Image keywords:** "The Broad museum LA architecture veil" + "Grand Central Market Los Angeles" + "Arts District LA mural"

---

### Day 8 — Tue May 26 · Venice → LAX

**Headline:** "One last breakfast"

**Narrative:** "Breakfast at Gjusta in Venice — if there's a line, the line moves, and it's worth it. A slow walk down Abbot Kinney. Maybe one more beach walk if there's time. Then LAX, with a comfortable buffer for traffic. Flight home at 1:30 PM."

**Stops:**
- Gjusta or Great White, Venice — morning · lat `33.9965`, lng `-118.4577`
- Abbot Kinney Boulevard stroll
- LAX departure — LY 6, 1:30 PM

**Image keywords:** "Venice Beach Abbot Kinney boulevard" + "Gjusta bakery Los Angeles"

---

### Hotel Californian feature spread

**Headline:** "Our base in Santa Barbara"

**Address:** 36 State St, Santa Barbara, CA 93101
**Nights:** May 22 and 23 (two nights)

**Narrative paragraph:**
"Hotel Californian sits at the foot of State Street, on the edge of the Funk Zone and one block from the beach. The architecture is Spanish-Moorish — arched doorways, tiled floors, wrought-iron balconies — and the rooftop pool looks over the harbor. Walkable to two dozen restaurants, tasting rooms, and coffee shops. Rated 4.3 stars across 550+ reviews. The hotel runs a shuttle further up State Street when we want to venture out."

**Details to list:**
- Rooftop pool with harbor views
- Funk Zone location — walkable everywhere
- Spa on-site
- Pet-friendly (not relevant but speaks to the quality)
- Complimentary shuttle up State Street

**Alternative (small, below):**
"If this one is booked or we want a splurge: **Belmond El Encanto** — hillside, more secluded, classic Santa Barbara."

**Image keywords:** "Hotel Californian Santa Barbara exterior" + "Hotel Californian pool rooftop" + "Hotel Californian room interior Spanish"

---

### Santa Ynez wine country feature spread

**Headline:** "Thirty minutes, another world"

**Narrative:**
"Los Olivos is the anchor — a walkable tasting-room village in the heart of the Santa Ynez Valley. We park once and visit three rooms on foot: Refugio Ranch for their Grenache and Blanc de Blanc, Stolpman for Rhone-style whites, and one more wherever the mood takes us. Lunch at Bell's if we can get a reservation (Michelin-starred French bistro, tiny room — book it a month out). If we want the scenic route back, the drive through Ballard Canyon passes through some of the best vineyards in California."

**Callouts:**
- Refugio Ranch — 2990 Grand Ave, Los Olivos
- Bell's — requires reservation 30 days ahead
- Solvang — Danish-village kitsch, 10 min south, skip if tired
- Ballard Canyon — scenic drive, 20 min each way

**Image keywords:** "Santa Ynez Valley vineyards rolling hills" + "Los Olivos California main street" + "California wine tasting room"

---

### Reservations checklist (interactive)

Each row: checkbox, name, short description, deadline, status.
Persist checked state to `localStorage` (key: `trip-2026-may-reservations`).
Checked items: strikethrough text, sage accent color, faded.

| Item | What | Deadline | Priority |
|---|---|---|---|
| Hotel Californian | 2 nights, May 22 & 23 | ASAP (fills in May) | CRITICAL |
| Rental car | Full week, LAX pickup | 2 weeks out | CRITICAL |
| Bestia OR Bavel | Dinner May 24, Arts District | Opens April 24 | HIGH |
| Bell's | Lunch May 23, Los Olivos | 30 days out | HIGH |
| The Broad | Free timed ticket May 25 | Release 2 weeks ahead | MEDIUM |
| Academy Museum | Tickets for May 21 | Anytime | MEDIUM |
| Refugio Ranch | Tasting May 23 (optional, walk-ins usually fine) | Day-of OK | LOW |

### Practical notes section

**Weather (late May):**
- Los Angeles: 20–26°C, mostly sunny, "May gray" mornings possible
- Santa Barbara: 18–22°C, reliably sunny inland
- Santa Ynez: warmer, 24–28°C

**Flights (already booked):**
- Outbound: LY 5, TLV → LAX, landing Tue May 19
- Return: LY 6, LAX → TLV, departing Tue May 26 at 1:30 PM local

**Car:**
- Pick up at LAX on Day 1
- Required — we need it for the PCH drive, wine country, Mission
- Return with buffer before the return flight

**Packing cues:**
- Layers — coastal evenings are cool, inland afternoons are warm
- One nice outfit for dinner reservations
- Walking shoes (State Street, Los Olivos, Arts District are all on foot)

---

### Footer

- Left: "Built with care · April 2026"
- Right: "Photography via Unsplash and Wikimedia Commons"
- Small terracotta rule above

---

## Acceptance criteria

The site is done when:

1. Opening `index.html` in a browser shows the full page without errors, without a dev server
2. All sections scroll smoothly, anchor links work
3. All maps render with tiles visible and correctly positioned pins
4. All image slots have images loaded (not broken)
5. Mobile layout (tested at 390px viewport) is not broken — all content readable, nav works
6. Reservations checkboxes persist after page reload
7. Typography uses Fraunces for display and Inter for body, loaded from Google Fonts
8. Color palette matches: `#F7F4EF` background, `#1F1F1D` ink, `#C87A5C` terracotta, `#8A9A6B` sage
9. The word "itinerary" appears nowhere on the page (it's a pitch, not a logistics doc)
10. There is no blue underlined default link styling anywhere
11. There are no default-looking HTML bullet points — lists are custom-styled
12. No emojis anywhere on the page

## Nice-to-haves (only if time)

- A "share" button that copies the URL
- Print stylesheet that lays out cleanly on A4
- A "day N of 7" progress bar that follows the scroll

## Out of scope

- No booking flows, no forms
- No CMS, no admin
- No backend of any kind
- No user accounts
- No analytics

---

*End of brief. Ask before making changes to structure, palette, or typography. Content can be edited for flow but don't add new venues or activities not listed here.*
