/* ============================================================
   LA & SANTA BARBARA — MAY 2026
   ============================================================ */

'use strict';

/* ---- 1. FADE-UP (runs first, always) --------------------- */
(function() {
  var els = document.querySelectorAll('.fade-up');
  if (!els.length) return;
  if (!('IntersectionObserver' in window)) {
    for (var i = 0; i < els.length; i++) els[i].classList.add('visible');
    return;
  }
  var obs = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.05 });
  for (var j = 0; j < els.length; j++) obs.observe(els[j]);
})();

/* ---- 2. NAV SCROLL SHADOW -------------------------------- */
(function() {
  var nav = document.getElementById('site-nav');
  if (!nav) return;
  window.addEventListener('scroll', function() {
    nav.classList.toggle('scrolled', window.scrollY > 30);
  }, { passive: true });
})();

/* ---- 3. HERO PARALLAX ------------------------------------ */
(function() {
  var bg = document.querySelector('.hero-bg');
  if (!bg) return;
  var tick = false;
  window.addEventListener('scroll', function() {
    if (tick) return; tick = true;
    requestAnimationFrame(function() {
      if (window.scrollY < window.innerHeight * 1.5)
        bg.style.transform = 'translateY(' + (window.scrollY * 0.2) + 'px)';
      tick = false;
    });
  }, { passive: true });
})();

/* ---- 4. HAMBURGER ---------------------------------------- */
(function() {
  var btn = document.getElementById('hamburger');
  var drw = document.getElementById('mobile-nav');
  var ovl = document.getElementById('nav-overlay');
  if (!btn || !drw || !ovl) return;
  function close() {
    drw.classList.remove('open'); btn.classList.remove('open');
    ovl.classList.remove('open'); document.body.style.overflow = '';
    btn.setAttribute('aria-expanded', 'false');
  }
  function open() {
    drw.classList.add('open'); btn.classList.add('open');
    ovl.classList.add('open'); document.body.style.overflow = 'hidden';
    btn.setAttribute('aria-expanded', 'true');
  }
  btn.addEventListener('click', function() { drw.classList.contains('open') ? close() : open(); });
  ovl.addEventListener('click', close);
  drw.querySelectorAll('a').forEach(function(a) { a.addEventListener('click', close); });
})();

/* ---- 5. RESERVATIONS ------------------------------------- */
(function() {
  var KEY  = 'trip-2026-may-reservations';
  var rows = document.querySelectorAll('.res-row');
  if (!rows.length) return;
  function state() {
    try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch(e) { return {}; }
  }
  function save() {
    var s = {};
    rows.forEach(function(r) { s[r.dataset.id] = r.classList.contains('checked'); });
    try { localStorage.setItem(KEY, JSON.stringify(s)); } catch(e) {}
  }
  function apply(row, on) {
    row.classList.toggle('checked', on);
    var b = row.querySelector('.res-checkbox');
    if (b) { b.classList.toggle('ticked', on); b.textContent = on ? '✓' : ''; }
    row.setAttribute('aria-checked', String(on));
  }
  var saved = state();
  rows.forEach(function(row) {
    if (saved[row.dataset.id]) apply(row, true);
    row.addEventListener('click', function() { apply(row, !row.classList.contains('checked')); save(); });
    row.setAttribute('tabindex', '0');
    row.addEventListener('keydown', function(e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); row.click(); } });
  });
})();

/* ---- 6. SHARE BUTTON ------------------------------------- */
(function() {
  var btn = document.getElementById('share-btn');
  if (!btn) return;
  btn.addEventListener('click', function() {
    var url = window.location.href;
    function flash() { btn.textContent = 'Copied'; btn.classList.add('copied'); setTimeout(function() { btn.textContent = 'Share'; btn.classList.remove('copied'); }, 2000); }
    if (navigator.clipboard) { navigator.clipboard.writeText(url).then(flash).catch(flash); }
    else { var t = document.createElement('textarea'); t.value = url; t.style.cssText = 'position:fixed;opacity:0'; document.body.appendChild(t); t.select(); try { document.execCommand('copy'); } catch(e) {} document.body.removeChild(t); flash(); }
  });
})();


/* ============================================================
   MAPS — Leaflet, lazy-initialized via IntersectionObserver
   Maps only start when the container is actually on screen.
   ============================================================ */

var TILES    = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
var TILES_AT = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>';

function addTiles(m) {
  L.tileLayer(TILES, { attribution: TILES_AT, subdomains: 'abcd', maxZoom: 19 }).addTo(m);
}

function pin(label, large) {
  var s = large ? 32 : 24;
  return L.divIcon({
    html: '<div class="' + (large ? 'custom-pin-lg' : 'custom-pin') + '">' + label + '</div>',
    className: '', iconSize: [s, s], iconAnchor: [s/2, s/2]
  });
}

function hotelPin(label) {
  return L.divIcon({
    html: '<div class="hotel-pin">' + label + '</div>',
    className: '', iconSize: [36, 36], iconAnchor: [18, 18]
  });
}

function isMobile() { return window.innerWidth < 768; }

function baseOpts(extras) {
  var mob = isMobile();
  return Object.assign({ scrollWheelZoom: false, dragging: !mob, touchZoom: !mob, doubleClickZoom: !mob, keyboard: !mob }, extras || {});
}

/* Coastal PCH path: Santa Monica → Malibu → El Matador → SB → Los Olivos */
var PCH_PATH = [
  [34.0089,-118.4973],[34.0190,-118.5220],[34.0260,-118.5430],
  [34.0340,-118.5800],[34.0371,-118.6767],[34.0373,-118.7600],
  [34.0380,-118.8747],[34.0467,-118.9394],[34.0780,-119.0300],
  [34.1600,-119.1500],[34.2042,-119.1700],[34.2806,-119.2949],
  [34.3500,-119.4200],[34.3957,-119.5226],[34.4133,-119.6900],
  [34.4900,-119.8200],[34.5600,-119.9600],[34.6200,-120.0500],
  [34.6697,-120.1155]
];

/* Return path: Los Olivos → SB → LA via 101 */
var RETURN_PATH = [
  [34.6697,-120.1155],[34.5600,-119.9600],[34.4900,-119.8200],
  [34.4383,-119.7141],[34.4133,-119.6900],
  [34.3500,-119.3500],[34.3000,-119.2400],[34.2500,-119.1800],
  [34.2042,-119.1700],[34.1700,-118.9500],[34.1000,-118.7000],
  [34.0500,-118.5000],[34.0394,-118.2350]
];

/* Day 6 return drive: Santa Barbara → Arts District LA via 101 */
var SB_TO_LA = [
  [34.4133,-119.6900],  // Santa Barbara / Hotel Californian
  [34.3957,-119.5226],  // Carpinteria
  [34.3500,-119.3500],  // Ventura outskirts
  [34.2806,-119.2949],  // Ventura
  [34.2042,-119.1700],  // Oxnard / 101
  [34.1800,-118.8800],  // Thousand Oaks
  [34.1700,-118.5500],  // Calabasas
  [34.1500,-118.4000],  // Sherman Oaks
  [34.1300,-118.3200],  // Hollywood
  [34.0900,-118.3000],  // Silver Lake
  [34.0394,-118.2350]   // Arts District, downtown LA
];

/* ---- Map definitions ------------------------------------- */
var OVERVIEW_STOPS = [
  { lat:34.0089, lng:-118.4973, num:'1–3', tip:'<b>Santa Monica</b><br>Nights 1–3 &bull; Hotel base for LA days' },
  { lat:33.9965, lng:-118.4577, num:'2',   tip:'<b>Venice / Gjusta</b><br>Day 2 morning &bull; Abbot Kinney &mdash; stick to the boulevard' },
  { lat:34.0773, lng:-118.4733, num:'2',   tip:'<b>Getty Center</b><br>Day 2 afternoon &bull; 1200 Getty Center Dr' },
  { lat:34.1016, lng:-118.3406, num:'3',   tip:'<b>Hollywood Walk of Fame</b><br>Day 3 optional &bull; 30 min max &mdash; keep it brief' },
  { lat:34.0635, lng:-118.3608, num:'3',   tip:'<b>Academy Museum</b><br>Day 3 &bull; 6067 Wilshire Blvd' },
  { lat:34.1184, lng:-118.3004, num:'3',   tip:'<b>Griffith Observatory</b><br>Day 3 &bull; arrive 6:30 PM for sunset' },
  { lat:34.0697, lng:-118.3986, num:'4',   tip:'<b>Beverly Hills</b><br>Day 4 &bull; Rodeo Drive, Canon Dr, lunch' },
  { lat:34.0908, lng:-118.3868, num:'4',   tip:'<b>Sunset Strip</b><br>Day 4 &bull; West Hollywood, evening' },
  { lat:34.0371, lng:-118.6767, num:'5',   tip:'<b>Malibu Farm</b><br>Day 5 &bull; lunch on the pier' },
  { lat:34.0380, lng:-118.8747, num:'5',   tip:'<b>El Matador Beach</b><br>Day 5 &bull; sea stacks &amp; cave' },
  { lat:34.4133, lng:-119.6900, num:'SB',  tip:'<b>Hotel Californian</b><br>Nights 5–6 &bull; 36 State St, Santa Barbara', hotel:true },
  { lat:34.4383, lng:-119.7141, num:'6',   tip:'<b>Old Mission SB</b><br>Day 6 &bull; 2201 Laguna St' },
  { lat:34.0394, lng:-118.2350, num:'7',   tip:'<b>Downtown / Arts District</b><br>Nights 6–7 &bull; Bestia, Bavel, The Broad', hotel:true },
  { lat:34.0545, lng:-118.2502, num:'7',   tip:'<b>The Broad</b><br>Day 7 &bull; 221 S Grand Ave' },
  { lat:34.0509, lng:-118.2491, num:'7',   tip:'<b>Grand Central Market</b><br>Day 7 &bull; 317 S Broadway' },
  { lat:34.0394, lng:-118.2350, num:'8',   tip:'<b>Arts District</b><br>Day 8 morning &bull; Bread Lounge, mural walk &mdash; then LAX' },
];

var DAY_CONFIGS = [
  { id:'map-day-1', zoom:13,
    pins:[{ lat:34.0089,lng:-118.4973,label:'Santa Monica' }] },
  { id:'map-day-2',
    pins:[{ lat:33.9965,lng:-118.4577,label:'Gjusta / Abbot Kinney, Venice' },
          { lat:34.0773,lng:-118.4733,label:'The Getty Center' }] },
  { id:'map-day-3',
    pins:[{ lat:34.1016,lng:-118.3406,label:'Hollywood Walk of Fame (optional)' },
          { lat:34.0635,lng:-118.3608,label:'Academy Museum' },
          { lat:34.1184,lng:-118.3004,label:'Griffith Observatory — arrive 6:30 PM' }] },
  { id:'map-day-4',
    pins:[{ lat:34.0697,lng:-118.3986,label:'Beverly Hills — Rodeo Drive area' },
          { lat:34.0908,lng:-118.3868,label:'Sunset Strip — West Hollywood' }] },
  { id:'map-day-5',
    pins:[{ lat:34.0371,lng:-118.6767,label:'Malibu Farm Pier Cafe' },
          { lat:34.0380,lng:-118.8747,label:'El Matador Beach' },
          { lat:34.4133,lng:-119.6900,label:'Hotel Californian, Santa Barbara' }],
    route: PCH_PATH.slice(0, 15) },
  { id:'map-day-6',
    pins:[{ lat:34.4383,lng:-119.7141,label:'Old Mission Santa Barbara' },
          { lat:34.4133,lng:-119.6900,label:'Hotel Californian – checkout 2 PM' },
          { lat:34.0394,lng:-118.2350,label:'Arts District, LA – dinner at Bestia / Bavel' }],
    route: SB_TO_LA },
  { id:'map-day-7',
    pins:[{ lat:34.0545,lng:-118.2502,label:'The Broad' },
          { lat:34.0509,lng:-118.2491,label:'Grand Central Market' },
          { lat:34.0394,lng:-118.2350,label:'Arts District' }] },
  { id:'map-day-8', zoom:14,
    pins:[{ lat:34.0394,lng:-118.2350,label:'Arts District — Bread Lounge, then LAX' }] },
];

/* ---- Lazy init registry ---------------------------------- */
var pending = {};

function initOverviewMap() {
  var el = document.getElementById('overview-map');
  if (!el || el._lmap) return;
  var m = L.map('overview-map', baseOpts({ zoomControl: true }));
  el._lmap = m;
  addTiles(m);

  /* PCH route */
  L.polyline(PCH_PATH, { color:'#C87A5C', weight:2.5, dashArray:'7 7', opacity:0.8 }).addTo(m);
  /* Return route (dashed, muted) */
  L.polyline(RETURN_PATH, { color:'#8A9A6B', weight:1.5, dashArray:'5 8', opacity:0.55 }).addTo(m);

  /* Pins */
  OVERVIEW_STOPS.forEach(function(s) {
    var mkr = L.marker([s.lat, s.lng], { icon: s.hotel ? hotelPin(s.num) : pin(s.num, false) });
    mkr.bindPopup(s.tip, { maxWidth: 200 }).addTo(m);
  });

  var allLL = OVERVIEW_STOPS.map(function(s) { return [s.lat, s.lng]; });
  m.fitBounds(allLL, { padding: [40, 40] });
}

function initDayMap(cfg) {
  var el = document.getElementById(cfg.id);
  if (!el || el._lmap) return;
  var opts = baseOpts({});
  if (cfg.pins.length === 1 && cfg.zoom) opts.zoom = cfg.zoom;
  var m = L.map(cfg.id, opts);
  el._lmap = m;
  addTiles(m);

  if (cfg.route) {
    L.polyline(cfg.route, { color:'#C87A5C', weight:2, dashArray:'6 6', opacity:0.7 }).addTo(m);
  }

  cfg.pins.forEach(function(p, i) {
    L.marker([p.lat, p.lng], { icon: pin(i + 1, false) })
      .bindPopup('<b>' + p.label + '</b>')
      .addTo(m);
  });

  if (cfg.pins.length === 1 && cfg.zoom) {
    m.setView([cfg.pins[0].lat, cfg.pins[0].lng], cfg.zoom);
  } else {
    var pts = cfg.route ? cfg.route : cfg.pins.map(function(p) { return [p.lat, p.lng]; });
    m.fitBounds(pts, { padding: [32, 32] });
  }
}

/* Register all map inits */
pending['overview-map'] = initOverviewMap;
DAY_CONFIGS.forEach(function(cfg) {
  pending[cfg.id] = initDayMap.bind(null, cfg);
});

/* Observe and fire when visible */
(function() {
  if (!('IntersectionObserver' in window)) {
    // No observer support — init everything immediately
    if (typeof L === 'undefined') return;
    Object.keys(pending).forEach(function(id) {
      try { pending[id](); } catch(e) { console.error(id, e); }
    });
    return;
  }

  var obs = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (!entry.isIntersecting) return;
      var id = entry.target.id;
      if (!pending[id]) return;
      if (typeof L === 'undefined') return; // Leaflet not loaded
      try { pending[id](); } catch(e) { console.error('Map error:', id, e); }
      delete pending[id];
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.01, rootMargin: '100px 0px' });  // trigger 100px before entering viewport

  var ids = ['overview-map'].concat(DAY_CONFIGS.map(function(c) { return c.id; }));
  ids.forEach(function(id) {
    var el = document.getElementById(id);
    if (el) obs.observe(el);
  });
})();
