import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import cities from "../data/cities.json";


export default function Home() {
  const navigate = useNavigate()
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [date, setDate] = useState('')
  const [openDropdown, setOpenDropdown] = useState(null)

  const filtered = (val) =>
    cities.filter(
      (c) =>
        c.name.toLowerCase().includes(val.toLowerCase()) ||
        c.city.toLowerCase().includes(val.toLowerCase()) ||
        c.code.toLowerCase().includes(val.toLowerCase())
    )

  const destinations = [
    { city: 'Varanasi', tag: 'The spiritual heart of India', bg: '#FEF3C7', icon: '🕌' },
    { city: 'Jaipur', tag: 'The pink city of Rajasthan', bg: '#FCE7F3', icon: '🏯' },
    { city: 'Mumbai', tag: 'Where dreams meet the sea', bg: '#DBEAFE', icon: '🌊' },
    { city: 'Agra', tag: 'Home of the Taj Mahal', bg: '#D1FAE5', icon: '🕍' },
  ]

  const features = [
    { icon: '🚆', title: 'Train search', desc: 'Find the best trains across India with seat availability and timings.' },
    { icon: '🤖', title: 'AI itinerary', desc: 'Let AI plan your perfect trip with a personalised day-by-day schedule.' },
    { icon: '🗺️', title: 'Interactive map', desc: 'Navigate with ease — explore hotels, places and routes on a live map.' },
  ]

  const testimonials = [
    { quote: '"YatraOne made planning my Rajasthan trip so easy. Found trains, hotels and places all in one place!"', stars: 5, name: 'Rahul Sharma', city: 'Delhi' },
    { quote: '"The AI itinerary feature is amazing. It planned my entire Varanasi trip in seconds. Highly recommended!"', stars: 5, name: 'Priya Patel', city: 'Mumbai' },
    { quote: '"Finally an app that understands Indian travel. The train search with IRCTC redirect is super convenient."', stars: 4, name: 'Ankit Singh', city: 'Lucknow' },
  ]

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', background: '#F8FAFC', color: '#1E293B' }}>

      {/* Navbar */}
      <nav style={{
        background: '#fff', borderBottom: '0.5px solid #E2E8F0',
        padding: '0 48px', height: '64px', display: 'flex',
        alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 50
      }}>
        <div style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '20px', color: '#1E293B' }}>
          Yatra<span style={{ color: '#2563EB' }}>One</span>
        </div>
        <div style={{ display: 'flex', gap: '28px' }}>
         {[
          { label: 'Trains', path: '/trains' },
          { label: 'Hotels', path: '/hotels' },
          { label: 'Places', path: '/places' },
          { label: 'AI Planner', path: '/itinerary' },
          ].map((l) => (
           <span
          key={l.label}
          onClick={() => navigate(l.path)}
           style={{ fontSize: '14px', color: '#64748B', textDecoration: 'none', cursor: 'pointer' }}
          >
          {l.label}
          </span>
        ))}
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => navigate('/login')} style={{ fontSize: '13px', color: '#2563EB', border: '1px solid #2563EB', background: '#fff', borderRadius: '8px', padding: '7px 18px', cursor: 'pointer' }}>Log in</button>
          <button onClick={() => navigate('/register')} style={{ fontSize: '13px', color: '#fff', background: '#2563EB', border: 'none', borderRadius: '8px', padding: '7px 18px', cursor: 'pointer' }}>Sign up</button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ background: '#F8FAFC', padding: '64px 48px', textAlign: 'center' }}>
        <h1 style={{ fontFamily: 'Poppins, sans-serif', fontSize: '38px', fontWeight: 700, color: '#1E293B', lineHeight: 1.2, marginBottom: '12px' }}>
          Plan your perfect<br />Indian journey
        </h1>
        <p style={{ fontSize: '15px', color: '#64748B', marginBottom: '16px' }}>
          Search trains, find hotels and discover tourist places — all in one place
        </p>
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '28px' }}>
          {['Varanasi', 'Jaipur', 'Delhi', 'Mumbai', 'Agra'].map((p) => (
            <span key={p} style={{ background: '#fff', border: '0.5px solid #E2E8F0', borderRadius: '20px', padding: '4px 14px', fontSize: '12px', color: '#2563EB', fontWeight: 500 }}>{p}</span>
          ))}
        </div>

        {/* Search Bar */}
        <div style={{
          background: '#fff', border: '0.5px solid #E2E8F0', borderRadius: '12px',
          maxWidth: '800px', margin: '0 auto', display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr auto', height: '64px', position: 'relative'
        }}>
          {/* From */}
          <div style={{ position: 'relative', borderRight: '0.5px solid #E2E8F0' }}>
            <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '8px 16px', cursor: 'pointer', gap: '2px' }}
              onClick={() => setOpenDropdown(openDropdown === 'from' ? null : 'from')}>
              <span style={{ fontSize: '11px', fontWeight: 600, color: '#94A3B8', letterSpacing: '0.06em', textTransform: 'uppercase' }}>From</span>
              <input type="text" value={from} onChange={(e) => { setFrom(e.target.value); setOpenDropdown('from') }} placeholder="Select city"
                style={{ border: 'none', outline: 'none', fontSize: '14px', fontWeight: 500, color: '#1E293B', background: 'transparent', textAlign: 'center', width: '100%' }} />
            </div>
            {openDropdown === 'from' && (
              <div style={{ position: 'absolute', top: '68px', left: '-1px', right: '-1px', background: '#fff', border: '0.5px solid #E2E8F0', borderRadius: '10px', zIndex: 100, overflow: 'hidden' }}>
                {filtered(from).map((c) => (
                  <div key={c.code} onClick={() => { setFrom(c.name + ' (' + c.code + ')'); setOpenDropdown(null) }}
                    style={{ padding: '10px 16px', cursor: 'pointer', fontSize: '13px' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#F1F5F9'}
                    onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
                    <div style={{ fontWeight: 600, color: '#1E293B' }}>{c.name}</div>
                    <div style={{ fontSize: '11px', color: '#94A3B8' }}>{c.code} — {c.city}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* To */}
          <div style={{ position: 'relative', borderRight: '0.5px solid #E2E8F0' }}>
            <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '8px 16px', cursor: 'pointer', gap: '2px' }}
              onClick={() => setOpenDropdown(openDropdown === 'to' ? null : 'to')}>
              <span style={{ fontSize: '11px', fontWeight: 600, color: '#94A3B8', letterSpacing: '0.06em', textTransform: 'uppercase' }}>To</span>
              <input type="text" value={to} onChange={(e) => { setTo(e.target.value); setOpenDropdown('to') }} placeholder="Select city"
                style={{ border: 'none', outline: 'none', fontSize: '14px', fontWeight: 500, color: '#1E293B', background: 'transparent', textAlign: 'center', width: '100%' }} />
            </div>
            {openDropdown === 'to' && (
              <div style={{ position: 'absolute', top: '68px', left: '-1px', right: '-1px', background: '#fff', border: '0.5px solid #E2E8F0', borderRadius: '10px', zIndex: 100, overflow: 'hidden' }}>
                {filtered(to).map((c) => (
                  <div key={c.code} onClick={() => { setTo(c.name + ' (' + c.code + ')'); setOpenDropdown(null) }}
                    style={{ padding: '10px 16px', cursor: 'pointer', fontSize: '13px' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#F1F5F9'}
                    onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
                    <div style={{ fontWeight: 600, color: '#1E293B' }}>{c.name}</div>
                    <div style={{ fontSize: '11px', color: '#94A3B8' }}>{c.code} — {c.city}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Date */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '8px 16px', gap: '2px' }}>
            <span style={{ fontSize: '11px', fontWeight: 600, color: '#94A3B8', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Date</span>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
              style={{ border: 'none', outline: 'none', fontSize: '14px', fontWeight: 500, color: '#1E293B', background: 'transparent', textAlign: 'center', width: '100%' }} />
          </div>

          <button onClick={() => navigate('/trains', { state: { from, to, date } })} style={{ background: '#2563EB', color: '#fff', border: 'none', borderRadius: '0 12px 12px 0', padding: '0 28px', fontSize: '14px', fontWeight: 500, cursor: 'pointer' }}>
            Search
          </button>
        </div>
      </section>

      {/* Stats Bar */}
      <div style={{ background: '#2563EB', padding: '0 48px', height: '80px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', alignItems: 'center' }}>
        {[
          { num: '500+', lbl: 'Train routes' },
          { num: '1000+', lbl: 'Hotels' },
          { num: '200+', lbl: 'Tourist places' },
          { num: '50+', lbl: 'Cities covered' },
        ].map((s) => (
          <div key={s.lbl} style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'Poppins, sans-serif', fontSize: '20px', fontWeight: 700, color: '#fff' }}>{s.num}</div>
            <div style={{ fontSize: '12px', color: '#BFDBFE' }}>{s.lbl}</div>
          </div>
        ))}
      </div>

      {/* How It Works */}
      <section style={{ padding: '64px 48px', background: '#fff' }}>
        <h2 style={{ fontFamily: 'Poppins, sans-serif', fontSize: '24px', fontWeight: 600, color: '#1E293B', textAlign: 'center', marginBottom: '8px' }}>How YatraOne works</h2>
        <p style={{ fontSize: '14px', color: '#64748B', textAlign: 'center', marginBottom: '40px' }}>Plan your entire trip in three simple steps</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr auto 1fr', gap: '12px', alignItems: 'center', maxWidth: '860px', margin: '0 auto' }}>
          {[
            { num: '1', icon: '🚆', title: 'Search your train', desc: 'Find trains between any two cities and book via IRCTC' },
            null,
            { num: '2', icon: '🏨', title: 'Explore hotels and places', desc: 'Browse hotels and tourist spots at your destination' },
            null,
            { num: '3', icon: '✨', title: 'Generate AI itinerary', desc: 'Let AI build a day-by-day travel plan just for you' },
          ].map((item, i) =>
            item === null ? (
              <div key={i} style={{ fontSize: '20px', color: '#CBD5E1', textAlign: 'center' }}>→</div>
            ) : (
              <div key={i} style={{ background: '#fff', border: '0.5px solid #E2E8F0', borderRadius: '12px', padding: '24px 20px', textAlign: 'center' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#2563EB', color: '#fff', fontSize: '13px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>{item.num}</div>
                <div style={{ fontSize: '28px', marginBottom: '10px' }}>{item.icon}</div>
                <h3 style={{ fontFamily: 'Poppins, sans-serif', fontSize: '14px', fontWeight: 600, color: '#1E293B', marginBottom: '6px' }}>{item.title}</h3>
                <p style={{ fontSize: '12px', color: '#64748B', lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            )
          )}
        </div>
      </section>

      {/* Popular Destinations */}
      <section style={{ padding: '64px 48px', background: '#F8FAFC' }}>
        <h2 style={{ fontFamily: 'Poppins, sans-serif', fontSize: '24px', fontWeight: 600, color: '#1E293B', textAlign: 'center', marginBottom: '8px' }}>Popular destinations</h2>
        <p style={{ fontSize: '14px', color: '#64748B', textAlign: 'center', marginBottom: '40px' }}>Explore India's most loved cities</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', maxWidth: '1000px', margin: '0 auto' }}>
          {destinations.map((d) => (
            <div key={d.city} style={{ background: '#fff', border: '0.5px solid #E2E8F0', borderRadius: '12px', overflow: 'hidden', cursor: 'pointer' }}>
              <div style={{ height: '130px', background: d.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px' }}>{d.icon}</div>
              <div style={{ padding: '14px 16px' }}>
                <h4 style={{ fontFamily: 'Poppins, sans-serif', fontSize: '14px', fontWeight: 600, color: '#1E293B', marginBottom: '4px' }}>{d.city}</h4>
                <p style={{ fontSize: '12px', color: '#64748B', marginBottom: '10px' }}>{d.tag}</p>
                <button onClick={() => navigate('/places')} style={{ fontSize: '12px', color: '#2563EB', background: '#EFF6FF', border: 'none', borderRadius: '6px', padding: '5px 12px', cursor: 'pointer', fontWeight: 500 }}>Explore</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '64px 48px', background: '#fff' }}>
        <h2 style={{ fontFamily: 'Poppins, sans-serif', fontSize: '24px', fontWeight: 600, color: '#1E293B', textAlign: 'center', marginBottom: '8px' }}>Everything you need for your trip</h2>
        <p style={{ fontSize: '14px', color: '#64748B', textAlign: 'center', marginBottom: '40px' }}>Built for Indian travellers</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', maxWidth: '900px', margin: '0 auto' }}>
          {features.map((f) => (
            <div key={f.title} style={{ background: '#fff', border: '0.5px solid #E2E8F0', borderRadius: '12px', padding: '24px' }}>
              <div style={{ width: '44px', height: '44px', background: '#EFF6FF', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', marginBottom: '14px' }}>{f.icon}</div>
              <h3 style={{ fontFamily: 'Poppins, sans-serif', fontSize: '14px', fontWeight: 600, color: '#1E293B', marginBottom: '6px' }}>{f.title}</h3>
              <p style={{ fontSize: '13px', color: '#64748B', lineHeight: 1.6, marginBottom: '10px' }}>{f.desc}</p>
              <span style={{ fontSize: '13px', color: '#2563EB', cursor: 'pointer' }}>Learn more →</span>
            </div>
          ))}
        </div>
      </section>

      {/* AI Planner Highlight */}
      <section style={{ background: '#EFF6FF', padding: '56px 48px', display: 'flex', gap: '48px', alignItems: 'center' }}>
        <div style={{ flex: 1 }}>
          <h2 style={{ fontFamily: 'Poppins, sans-serif', fontSize: '26px', fontWeight: 700, color: '#1E293B', marginBottom: '10px' }}>Let AI plan<br />your trip</h2>
          <p style={{ fontSize: '14px', color: '#64748B', lineHeight: 1.7, marginBottom: '20px' }}>Tell us your destination and travel dates. Our AI powered by Gemini builds a complete day-by-day itinerary with places to visit, hotels to stay, and trains to catch.</p>
          <button onClick={() => navigate('/itinerary')} style={{ background: '#2563EB', color: '#fff', border: 'none', borderRadius: '8px', padding: '12px 24px', fontSize: '14px', fontWeight: 500, cursor: 'pointer' }}>Try AI Planner</button>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ background: '#fff', border: '0.5px solid #E2E8F0', borderRadius: '12px', padding: '20px' }}>
            <div style={{ fontFamily: 'Poppins, sans-serif', fontSize: '13px', fontWeight: 600, color: '#1E293B', marginBottom: '12px' }}>✨ AI Itinerary — Jaipur 3 Days</div>
            {[
              { day: 'Day 1 — Arrival', items: ['🚆 Train from Delhi → Jaipur (6:00 AM)', '🏨 Check in: Hotel Pearl Palace', '🏯 Visit Amber Fort (3:00 PM)'] },
              { day: 'Day 2 — City Tour', items: ['🕌 Hawa Mahal (9:00 AM)', '🛍️ Johari Bazaar (12:00 PM)', '🌅 Nahargarh Fort sunset (5:00 PM)'] },
              { day: 'Day 3 — Departure', items: ['☕ Local breakfast at Lassiwala', '🚆 Return train to Delhi (2:00 PM)'] },
            ].map((d) => (
              <div key={d.day} style={{ marginBottom: '10px' }}>
                <div style={{ fontSize: '11px', fontWeight: 600, color: '#2563EB', marginBottom: '4px' }}>{d.day}</div>
                {d.items.map((item) => (
                  <div key={item} style={{ fontSize: '12px', color: '#64748B', padding: '4px 0', borderBottom: '0.5px solid #F1F5F9' }}>{item}</div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ padding: '64px 48px', background: '#F8FAFC' }}>
        <h2 style={{ fontFamily: 'Poppins, sans-serif', fontSize: '24px', fontWeight: 600, color: '#1E293B', textAlign: 'center', marginBottom: '8px' }}>What travellers say</h2>
        <p style={{ fontSize: '14px', color: '#64748B', textAlign: 'center', marginBottom: '40px' }}>Loved by thousands of Indian travellers</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', maxWidth: '900px', margin: '0 auto' }}>
          {testimonials.map((t) => (
            <div key={t.name} style={{ background: '#fff', border: '0.5px solid #E2E8F0', borderRadius: '12px', padding: '20px' }}>
              <p style={{ fontSize: '13px', color: '#64748B', lineHeight: 1.7, marginBottom: '14px', fontStyle: 'italic' }}>{t.quote}</p>
              <div style={{ color: '#F59E0B', fontSize: '14px', marginBottom: '8px' }}>{'★'.repeat(t.stars)}{'☆'.repeat(5 - t.stars)}</div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#1E293B' }}>{t.name}</div>
              <div style={{ fontSize: '12px', color: '#94A3B8' }}>{t.city}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section style={{ background: '#1E293B', padding: '56px 48px', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'Poppins, sans-serif', fontSize: '28px', fontWeight: 700, color: '#fff', marginBottom: '10px' }}>Start planning your journey today</h2>
        <p style={{ fontSize: '14px', color: '#94A3B8', marginBottom: '28px' }}>Join thousands of travellers using YatraOne</p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button onClick={() => navigate('/register')} style={{ background: '#2563EB', color: '#fff', border: 'none', borderRadius: '8px', padding: '12px 28px', fontSize: '14px', fontWeight: 500, cursor: 'pointer' }}>Get started</button>
          <button onClick={() => navigate('/about')} style={{ background: 'transparent', color: '#fff', border: '1px solid #fff', borderRadius: '8px', padding: '12px 28px', fontSize: '14px', fontWeight: 500, cursor: 'pointer' }}>Learn more</button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#1E293B', padding: '40px 48px 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '32px', marginBottom: '32px' }}>
          <div>
            <div style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '18px', color: '#F8FAFC', marginBottom: '6px' }}>
              Yatra<span style={{ color: '#60A5FA' }}>One</span>
            </div>
            <div style={{ fontSize: '13px', color: '#94A3B8' }}>Your complete Indian travel companion</div>
          </div>
          <div>
            <h4 style={{ fontSize: '13px', fontWeight: 600, color: '#F8FAFC', marginBottom: '12px' }}>Quick links</h4>
            {['Home', 'Trains', 'Hotels', 'Places'].map((l) => (
              <a key={l} href="#" style={{ display: 'block', fontSize: '13px', color: '#94A3B8', textDecoration: 'none', marginBottom: '8px' }}>{l}</a>
            ))}
          </div>
          <div>
            <h4 style={{ fontSize: '13px', fontWeight: 600, color: '#F8FAFC', marginBottom: '12px' }}>Support</h4>
            {['About', 'Contact', 'FAQ'].map((l) => (
              <a key={l} href="#" style={{ display: 'block', fontSize: '13px', color: '#94A3B8', textDecoration: 'none', marginBottom: '8px' }}>{l}</a>
            ))}
          </div>
          <div>
            <h4 style={{ fontSize: '13px', fontWeight: 600, color: '#F8FAFC', marginBottom: '12px' }}>Connect</h4>
            {['Instagram', 'Twitter', 'LinkedIn'].map((l) => (
              <a key={l} href="#" style={{ display: 'block', fontSize: '13px', color: '#94A3B8', textDecoration: 'none', marginBottom: '8px' }}>{l}</a>
            ))}
          </div>
        </div>
        <div style={{ borderTop: '0.5px solid #334155', paddingTop: '16px', fontSize: '12px', color: '#64748B', textAlign: 'center' }}>
          © 2024 YatraOne. All rights reserved.
        </div>
      </footer>

    </div>
  )
}