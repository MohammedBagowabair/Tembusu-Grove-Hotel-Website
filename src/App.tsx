import { useEffect, useRef, useState, type MouseEvent } from 'react';
import { HeroPic, Pic } from '@/lib/Pic';
import { Lightbox, type Shot } from '@/lib/Lightbox';
import { PHONE_DISPLAY, TEL, generalMsg, roomMsg, waUrl } from '@/lib/wa';
import { CREDITS } from '@/images';
import { MapPlaceholder } from '@/lib/MapPlaceholder';
import {
  WaIcon, IcGuests, IcBed, IcSize, IcArrow, IcPool, IcSpa, IcGym, IcDine, IcLeaf, IcSun, IcKey, IcCar, IcWifi, IcShirt,
  IcPin, IcMail, IcPhone, IcPlus, IcClock,
} from '@/lib/icons';

const HOTEL = 'Tembusu Grove Retreat';
const NAV = [
  { href: '#rooms', label: 'Stay' },
  { href: '#facilities', label: 'Facilities' },
  { href: '#gallery', label: 'Gallery' },
  { href: '#location', label: 'Location' },
  { href: '#contact', label: 'Contact' },
];

const ROOMS = [
  {
    id: 'garden', img: 'room-garden', name: 'Garden Room', alt: 'Bright room with a queen bed, ceiling fan and a window onto greenery',
    text: 'Our quietest rooms, opening onto the garden with a ceiling fan, warm timber and morning birdsong.',
    guests: '2 adults', bed: 'Queen', size: 'Approx. 30 m²',
    amen: ['Garden view', 'Rain shower', 'Ceiling fan and air conditioning', 'Fast Wi-Fi'],
  },
  {
    id: 'terrace', img: 'room-terrace', name: 'Terrace Room', alt: 'Bedroom with timber floors, a king bed and glass doors to a leafy terrace',
    text: 'A king room with glass doors to a shaded private terrace, made for slow afternoons with a book.',
    guests: '2 adults', bed: 'King', size: 'Approx. 38 m²',
    amen: ['Private terrace', 'Daybed', 'Soaking tub', 'Blackout curtains'],
  },
  {
    id: 'suite', img: 'room-suite', name: 'Canopy Suite', alt: 'Suite with a white four-poster canopy bed, timber floors and garden doors',
    text: 'A four-poster canopy bed, a separate sitting area and tall doors that open to the trees.',
    guests: '2 adults + 1 child', bed: 'King four-poster', size: 'Approx. 60 m²',
    amen: ['Separate sitting area', 'Outdoor shower', 'Garden veranda', 'Evening turndown'],
  },
  {
    id: 'family', img: 'room-family', name: 'Family Garden Room', alt: 'Twin room with two beds, timber headboards and a sunny window',
    text: 'Two comfortable beds and space for little ones, a few steps from the lawn and the pool.',
    guests: '2 adults + 2 children', bed: 'Two double beds', size: 'Approx. 44 m²',
    amen: ['Cots on request', 'Kids’ amenities', 'Bathtub', 'Close to the pool'],
  },
];

const FACILITIES = [
  { img: 'fac-pool', icon: IcPool, title: 'Lagoon pool', alt: 'Turquoise pool lined with palm trees and a pavilion under blue sky', text: 'A long, palm-lined pool with shaded loungers and towel service from 7 am.' },
  { img: 'fac-spa', icon: IcSpa, title: 'Garden spa', alt: 'Spa treatment room with two massage beds and a white robe', text: 'Massages and body treatments by appointment, using locally inspired botanicals.' },
  { img: 'fac-dining', icon: IcDine, title: 'Breakfast pavilion', alt: 'Breakfast buffet with fresh fruit platters on woven table runners', text: 'Tropical fruit, local breakfasts and made-to-order eggs in an open pavilion.' },
  { img: 'fac-fitness', icon: IcGym, title: 'Fitness room', alt: 'Small gym with cardio machines beside glass doors to the garden', text: 'Cardio and free weights with garden views, open 24 hours.' },
  { img: 'fac-garden', icon: IcLeaf, title: 'Guided garden walks', alt: 'Aerial roots of a large tree hanging over still green water', text: 'Morning walks through native planting with our gardeners, on request.' },
];
const SERVICES = [
  { icon: IcKey, label: '24-hour front desk' },
  { icon: IcCar, label: 'Airport transfers on request' },
  { icon: IcWifi, label: 'Wi-Fi throughout' },
  { icon: IcShirt, label: 'Laundry service' },
];

const DAY = [
  { t: '7:00', h: 'Garden morning', p: 'A short guided walk under the trees while the air is still cool.', icon: IcSun },
  { t: '9:00', h: 'Slow breakfast', p: 'Tropical fruit and local dishes in the open pavilion, at your own pace.', icon: IcDine },
  { t: '13:00', h: 'Pool and shade', p: 'Loungers under the palms, a swim, and an unhurried afternoon nap.', icon: IcPool },
  { t: '17:00', h: 'Spa hour', p: 'A massage as the light softens, then a quiet stroll back to your room.', icon: IcSpa },
];

const GALLERY: Shot[] = [
  { name: 'g1', alt: 'Garden path passing under an arch of climbing plants', cap: 'The arched garden walk' },
  { name: 'g4', alt: 'Pool with red-roofed pavilions and palm trees at sunset', cap: 'Pool pavilions' },
  { name: 'g10', alt: 'Close-up of white frangipani flowers', cap: 'Frangipani' },
  { name: 'g3', alt: 'Calm river lined with mangroves under a pale sky', cap: 'Mangrove river nearby (illustrative)' },
  { name: 'g7', alt: 'Folded white towels topped with a red rose', cap: 'Turndown touches' },
  { name: 'g5', alt: 'Palm-lined path beside a pool and small footbridge', cap: 'Paths between the palms' },
  { name: 'g2', alt: 'Tangle of mangrove roots in a shaded forest', cap: 'Mangrove forest walk (illustrative)' },
  { name: 'g9', alt: 'Breakfast counter with fresh vegetables and fruit in crates', cap: 'Fresh breakfast spread' },
  { name: 'g6', alt: 'Water wall fountain flowing into a pool', cap: 'Water wall' },
  { name: 'g11', alt: 'Pool glimpsed through palm fronds', cap: 'Through the palms' },
  { name: 'g8', alt: 'Breakfast platters with roasted plantain and olives', cap: 'Breakfast platters' },
  { name: 'g12', alt: 'Yellow tropical flower among broad green leaves', cap: 'Heliconia in the garden' },
];

const FAQ = [
  { q: 'How do I book?', a: 'Send us your dates and number of guests on WhatsApp. We reply with available rooms and current rates, then confirm your booking in writing.' },
  { q: 'What are check-in and check-out times?', a: 'Check-in is from 2:00 pm and check-out is until 12:00 pm. Early check-in and late check-out are offered when rooms allow.' },
  { q: 'Is the retreat suitable for children?', a: 'Yes. The Family Garden Room and Canopy Suite suit families, and cots and children’s amenities are available on request.' },
  { q: 'Can you arrange transport from the airport?', a: 'Yes. Private transfers can be arranged on request; share your flight details on WhatsApp and we will confirm the rate in advance.' },
  { q: 'Do I need to book spa treatments in advance?', a: 'We recommend it, especially at weekends. Ask on WhatsApp and we will hold a time for you.' },
  { q: 'Is breakfast included?', a: 'Rates are available with or without breakfast. We will explain the options clearly before you confirm.' },
];

function Logo() {
  return (
    <a href="#top" className="logo" aria-label={`${HOTEL}, back to top`}>
      <svg width="30" height="30" viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="15" fill="currentColor" /><path d="M16 7c-5 4-6.5 9-4 14 1 2 2.6 3 4 3.4V27h1.2v-2.6c1.4-.4 3-1.4 4-3.4 2.5-5 1-10-4-14l-.6 9.3-.6-9.3Z" fill="#fbf8f2" /></svg>
      <span>Tembusu Grove<small>Retreat · Singapore</small></span>
    </a>
  );
}

export default function App() {
  const [menu, setMenu] = useState(false);
  const [lb, setLb] = useState<number | null>(null);
  const track = useRef<HTMLDivElement>(null);
  const general = waUrl(generalMsg(HOTEL));
  const smooth = () => (matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth') as ScrollBehavior;
  const go = (e: MouseEvent, href: string) => {
    e.preventDefault();
    setMenu(false);
    requestAnimationFrame(() => requestAnimationFrame(() => {
      document.querySelector(href)?.scrollIntoView({ behavior: smooth() });
      history.replaceState(null, '', href);
    }));
  };
  const slide = (dir: number) => {
    const t = track.current; if (!t) return;
    const card = t.querySelector('article'); const w = card ? card.getBoundingClientRect().width + 20 : t.clientWidth;
    t.scrollBy({ left: dir * w, behavior: smooth() });
  };

  useEffect(() => {
    if (!menu) return;
    const k = (e: KeyboardEvent) => e.key === 'Escape' && setMenu(false);
    window.addEventListener('keydown', k);
    document.documentElement.style.overflow = 'hidden';
    requestAnimationFrame(() => document.querySelector<HTMLElement>('#menu a')?.focus({ preventScroll: true }));
    return () => {
      window.removeEventListener('keydown', k); document.documentElement.style.overflow = '';
      if (document.activeElement === document.body || document.activeElement?.closest('#menu')) document.querySelector<HTMLElement>('.menu-btn')?.focus({ preventScroll: true });
    };
  }, [menu]);

  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <header className="hdr">
        <div className="pill">
          <Logo />
          <nav className="dnav" aria-label="Primary">{NAV.map((n) => <a key={n.href} href={n.href}>{n.label}</a>)}</nav>
          <a className="hdr-wa" aria-label="Chat on WhatsApp" href={general} target="_blank" rel="noopener noreferrer"><WaIcon size={18} /><span>WhatsApp</span></a>
          <button className="menu-btn" type="button" aria-expanded={menu} aria-controls="menu" aria-label={menu ? 'Close menu' : 'Open menu'} onClick={() => setMenu(!menu)}>
            <span className="dots" aria-hidden="true"><i /><i /><i /></span>
          </button>
        </div>
      </header>
      <div className={`scrim${menu ? ' open' : ''}`} hidden={!menu} onClick={() => setMenu(false)} />
      <div id="menu" className={`sheet${menu ? ' open' : ''}`} hidden={!menu} role="dialog" aria-modal="true" aria-label="Menu">
        <span className="grab" aria-hidden="true" />
        <nav aria-label="Mobile">
          {NAV.map((n) => <a key={n.href} href={n.href} onClick={(e) => go(e, n.href)}>{n.label}<IcArrow size={18} /></a>)}
        </nav>
        <a className="btn btn-leaf" href={general} target="_blank" rel="noopener noreferrer"><WaIcon size={18} />Check Availability on WhatsApp</a>
        <button type="button" className="sheet-close" onClick={() => setMenu(false)}>Close</button>
      </div>

      <main id="main">
        <section className="hero" id="top" aria-labelledby="hero-h">
          <div className="hero-frame">
            <HeroPic alt="Palm-lined pool with loungers under a clear blue sky (illustrative photo)" className="hero-img" />
            <div className="hero-shade" aria-hidden="true" />
            <div className="hero-copy">
              <p className="tag"><IcLeaf size={16} />A garden retreat in Singapore</p>
              <h1 id="hero-h">Slow down under the <em>tembusu trees.</em></h1>
              <p className="hero-lead">Garden rooms, a palm-lined pool and unhurried days, minutes from the city yet a world away.</p>
              <div className="hero-cta">
                <a className="btn btn-sand" href={general} target="_blank" rel="noopener noreferrer"><WaIcon size={18} />Check Availability on WhatsApp</a>
                <a className="btn btn-ghost" href="#rooms">Explore Rooms<IcArrow size={18} /></a>
              </div>
            </div>
            <p className="hero-note">Fictional retreat concept · illustrative photography</p>
          </div>
        </section>

        <section className="intro wrap" aria-labelledby="intro-h">
          <figure className="intro-img"><Pic name="intro" alt="Stepping-stone path across a lawn to a white garden gazebo" sizes="(min-width: 1024px) 42vw, 100vw" /></figure>
          <div>
            <p className="kick">Welcome</p>
            <h2 id="intro-h">A green pause in a busy city.</h2>
            <p className="body">Tembusu Grove is a retreat concept named after one of Singapore&rsquo;s best-loved heritage trees. Low buildings sit among lawns and tropical planting, so every room looks out onto green. Come for a long weekend, a family break or a quiet reset between journeys.</p>
            <ul className="facts">
              <li><strong>32</strong><span>garden rooms &amp; suites</span></li>
              <li><strong>2 ha</strong><span>of tropical gardens</span></li>
              <li><strong>1</strong><span>lagoon pool</span></li>
            </ul>
          </div>
        </section>

        <section id="rooms" className="rooms" aria-labelledby="rooms-h">
          <div className="wrap rooms-head">
            <div>
              <p className="kick">Stay</p>
              <h2 id="rooms-h">Rooms among the trees</h2>
              <p className="body">Four ways to stay. Swipe to explore, then message us for rates and availability.</p>
            </div>
            <div className="car-btns">
              <button type="button" onClick={() => slide(-1)} aria-label="Previous rooms"><IcArrow size={20} /></button>
              <button type="button" onClick={() => slide(1)} aria-label="Next rooms"><IcArrow size={20} /></button>
            </div>
          </div>
          <div className="track" ref={track} role="region" aria-label="Room types" tabIndex={0}>
            {ROOMS.map((r) => (
              <article className="room" key={r.id} aria-labelledby={`r-${r.id}`}>
                <figure><Pic name={r.img} alt={r.alt} sizes="(min-width: 1024px) 34vw, 86vw" /></figure>
                <div className="room-body">
                  <h3 id={`r-${r.id}`}>{r.name}</h3>
                  <p>{r.text}</p>
                  <dl className="specs">
                    <div><dt><IcGuests size={17} /><span className="sr">Guests</span></dt><dd>{r.guests}</dd></div>
                    <div><dt><IcBed size={17} /><span className="sr">Bed</span></dt><dd>{r.bed}</dd></div>
                    <div><dt><IcSize size={17} /><span className="sr">Size</span></dt><dd>{r.size}</dd></div>
                  </dl>
                  <ul className="amen">{r.amen.map((a) => <li key={a}>{a}</li>)}</ul>
                  <a className="btn btn-leaf" href={waUrl(roomMsg(r.name, HOTEL))} target="_blank" rel="noopener noreferrer" aria-label={`Check availability for the ${r.name} on WhatsApp`}>
                    <WaIcon size={18} />Check Availability
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="day" aria-labelledby="day-h">
          <div className="wrap">
            <p className="kick">A day at the retreat</p>
            <h2 id="day-h">Days that unfold slowly</h2>
            <ol className="day-list">
              {DAY.map((d) => (
                <li key={d.t}><span className="day-ic"><d.icon size={22} /></span><time>{d.t}</time><h3>{d.h}</h3><p>{d.p}</p></li>
              ))}
            </ol>
          </div>
        </section>

        <section id="facilities" className="fac wrap" aria-labelledby="fac-h">
          <p className="kick">Facilities</p>
          <h2 id="fac-h">Everything for an easy stay</h2>
          <div className="fac-grid">
            {FACILITIES.map((f) => (
              <article className="fac-card" key={f.title}>
                <figure><Pic name={f.img} alt={f.alt} sizes="(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw" /></figure>
                <h3><f.icon size={20} />{f.title}</h3>
                <p>{f.text}</p>
              </article>
            ))}
            <article className="fac-card svc-card">
              <h3><IcClock size={20} />Also at the retreat</h3>
              <ul>{SERVICES.map((s) => <li key={s.label}><s.icon size={18} />{s.label}</li>)}</ul>
            </article>
          </div>
        </section>

        <section id="gallery" className="gal" aria-labelledby="gal-h">
          <div className="wrap">
            <p className="kick">Gallery</p>
            <h2 id="gal-h">Life in the garden</h2>
            <p className="body">Tap a photo to enlarge it. Photographs are illustrative of the retreat concept.</p>
            <ul className="masonry">
              {GALLERY.map((g, i) => (
                <li key={g.name}>
                  <button type="button" onClick={() => setLb(i)} aria-label={`Open photo ${i + 1} of ${GALLERY.length}: ${g.cap}`}>
                    <Pic name={g.name} alt="" sizes="(min-width: 1024px) 30vw, 50vw" />
                    <span className="gal-cap">{g.cap}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </section>
        <Lightbox shots={GALLERY} index={lb} onIndex={setLb} label="Photo gallery" />

        <section id="location" className="loc wrap" aria-labelledby="loc-h">
          <div className="map" role="img" aria-label="Map placeholder for a sample location near Bukit Timah, Singapore">
            <MapPlaceholder label="Map placeholder" colors={{ land: '#efe6d3', water: '#cfe0d6', road: '#fbf8f2', park: '#b9c99b', pin: '#234235' }} />
            <div className="map-card"><IcPin size={20} /><span><strong>Map placeholder</strong>Sample location · Bukit Timah</span></div>
          </div>
          <div>
            <p className="kick">Location</p>
            <h2 id="loc-h">Green, yet close to everything</h2>
            <p className="body">Tembusu Grove is imagined near Bukit Timah, among some of Singapore&rsquo;s greenest neighbourhoods. The address below is a sample for this demonstration; a real property would list verified travel times.</p>
            <p className="loc-addr"><IcPin size={20} /><span><strong>Sample address</strong><br />Bukit Timah area, Singapore (demonstration only)</span></p>
            <a className="btn btn-leaf" href={general} target="_blank" rel="noopener noreferrer"><WaIcon size={18} />Ask for directions</a>
          </div>
        </section>

        <section className="trust" aria-labelledby="trust-h">
          <div className="wrap">
            <p className="kick">Guest notes</p>
            <h2 id="trust-h">What a stay feels like</h2>
            <div className="quotes">
              {[
                { q: 'We woke to birdsong every morning and the kids lived in the pool. Booking on WhatsApp took five minutes.', w: 'Sample guest · family of four' },
                { q: 'Exactly the reset I needed between work trips. Garden walk, massage, early night.', w: 'Sample guest · solo traveller' },
                { q: 'The canopy suite felt like a treehouse for grown-ups. Staff were warm without fuss.', w: 'Sample guest · anniversary stay' },
              ].map((t) => (
                <figure key={t.w}><blockquote>&ldquo;{t.q}&rdquo;</blockquote><figcaption>{t.w}</figcaption></figure>
              ))}
            </div>
            <p className="quotes-note">These testimonials are fictional samples for this concept, not real guest reviews.</p>
          </div>
        </section>

        <section className="faq wrap" aria-labelledby="faq-h">
          <div>
            <p className="kick">FAQ</p>
            <h2 id="faq-h">Questions, answered</h2>
            <p className="body">Anything else? Message us on WhatsApp and a real person will reply.</p>
          </div>
          <div className="faq-list">
            {FAQ.map((f) => (
              <details key={f.q}><summary>{f.q}<IcPlus size={20} /></summary><p>{f.a}</p></details>
            ))}
          </div>
        </section>

        <section className="cta wrap" aria-labelledby="cta-h">
          <div className="cta-in">
            <h2 id="cta-h">Your room in the garden is waiting.</h2>
            <p>Tell us your dates on WhatsApp and we&rsquo;ll reply with rooms, rates and availability.</p>
            <a className="btn btn-sand" href={general} target="_blank" rel="noopener noreferrer"><WaIcon size={18} />Check Availability on WhatsApp</a>
          </div>
        </section>
      </main>

      <footer id="contact" className="ftr">
        <div className="wrap ftr-in">
          <div className="ftr-brand"><Logo /><p>A fictional tropical retreat concept created for demonstration. Not a real hotel; no bookings are taken.</p></div>
          <div>
            <h2 className="ftr-h">Contact</h2>
            <ul className="ftr-list">
              <li><WaIcon size={18} /><a href={general} target="_blank" rel="noopener noreferrer">WhatsApp {PHONE_DISPLAY}</a></li>
              <li><IcPhone size={18} /><a href={TEL}>{PHONE_DISPLAY}</a></li>
              <li><IcMail size={18} /><span>stay@tembusugrove.example <small>(demo address)</small></span></li>
              <li><IcPin size={18} /><span>Sample address: Bukit Timah area, Singapore</span></li>
            </ul>
          </div>
          <div>
            <h2 className="ftr-h">Explore</h2>
            <ul className="ftr-nav">{NAV.map((n) => <li key={n.href}><a href={n.href}>{n.label}</a></li>)}</ul>
          </div>
        </div>
        <div className="wrap">
          <details className="credits">
            <summary>Photo credits</summary>
            <p>All photographs are illustrative, sourced from Wikimedia Commons under free licences, and do not show this fictional retreat.</p>
            <ol>
              {CREDITS.map((c) => <li key={c.name}><a href={c.page} target="_blank" rel="noopener noreferrer">{c.title}</a> by {c.artist}, {c.lic}</li>)}
            </ol>
          </details>
          <p className="copy">© 2026 Tembusu Grove Retreat. Fictional retreat concept for demonstration.</p>
        </div>
      </footer>

      <a className="wa-fab" href={general} target="_blank" rel="noopener noreferrer" aria-label="Check availability on WhatsApp"><WaIcon size={28} /></a>
    </>
  );
}
