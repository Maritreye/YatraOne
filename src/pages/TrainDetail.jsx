import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import train from "../data/trainDetail.json";


export default function TrainDetail() {
  const navigate = useNavigate()
  const [selectedClass, setSelectedClass] = useState('3A')
  const [showAllStops, setShowAllStops] = useState(false)

  const selected = train.classes.find((c) => c.name === selectedClass)
  const visibleStops = showAllStops ? train.stops : train.stops.slice(0, 5)

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', background: '#F8FAFC', minHeight: '100vh' }}>

      {/* Navbar */}
      <nav style={{ height: '64px', background: '#fff', borderBottom: '0.5px solid #E2E8F0', display: 'flex', alignItems: 'center', padding: '0 80px', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
        <div onClick={() => navigate('/')} style={{ fontFamily: 'Poppins, sans-serif', fontSize: '20px', fontWeight: 700, color: '#1E293B', cursor: 'pointer' }}>
          Yatra<span style={{ color: '#2563EB' }}>One</span>
        </div>
        <div style={{ display: 'flex', gap: '28px' }}>
          {[{ label: 'Trains', path: '/trains' }, { label: 'Hotels', path: '/hotels' }, { label: 'Places', path: '/places' }, { label: 'AI Planner', path: '/itinerary' }].map((l) => (
            <span key={l.label} onClick={() => navigate(l.path)} style={{ fontSize: '14px', color: '#64748B', cursor: 'pointer' }}>{l.label}</span>
          ))}
        </div>
        <button onClick={() => navigate('/login')} style={{ background: '#2563EB', color: '#fff', border: 'none', borderRadius: '8px', padding: '8px 20px', fontSize: '14px', fontWeight: 500, cursor: 'pointer' }}>Log in</button>
      </nav>

      {/* Breadcrumb */}
      <div style={{ background: '#fff', borderBottom: '0.5px solid #E2E8F0', height: '48px', display: 'flex', alignItems: 'center', padding: '0 80px', gap: '8px' }}>
        <span onClick={() => navigate('/')} style={{ fontSize: '13px', color: '#94A3B8', cursor: 'pointer' }}>Home</span>
        <span style={{ fontSize: '13px', color: '#94A3B8' }}>→</span>
        <span onClick={() => navigate('/trains')} style={{ fontSize: '13px', color: '#94A3B8', cursor: 'pointer' }}>Train search</span>
        <span style={{ fontSize: '13px', color: '#94A3B8' }}>→</span>
        <span style={{ fontSize: '13px', color: '#1E293B', fontWeight: 500 }}>{train.name}</span>
      </div>

      {/* Train Header */}
      <div style={{ background: '#fff', borderBottom: '0.5px solid #E2E8F0', padding: '20px 80px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <h1 style={{ fontFamily: 'Poppins, sans-serif', fontSize: '22px', fontWeight: 700, color: '#1E293B' }}>{train.name}</h1>
            <span style={{ fontSize: '13px', color: '#94A3B8' }}>#{train.number}</span>
            <span style={{ background: '#EFF6FF', color: '#2563EB', fontSize: '12px', fontWeight: 500, padding: '3px 10px', borderRadius: '20px' }}>{train.type}</span>
          </div>
          <div style={{ display: 'flex', gap: '6px' }}>
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
              <span key={d} style={{ fontSize: '12px', padding: '3px 8px', borderRadius: '4px', background: train.days.includes(d) ? '#1E293B' : '#F1F5F9', color: train.days.includes(d) ? '#fff' : '#94A3B8', fontWeight: 500 }}>{d}</span>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button style={{ background: '#fff', color: '#2563EB', border: '1.5px solid #2563EB', borderRadius: '8px', padding: '10px 20px', fontSize: '14px', fontWeight: 500, cursor: 'pointer' }}>Save to trip</button>
          <button onClick={() => window.open('https://www.irctc.co.in', '_blank')} style={{ background: '#2563EB', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 24px', fontSize: '14px', fontWeight: 500, cursor: 'pointer' }}>Book on IRCTC ↗</button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ padding: '32px 80px', display: 'grid', gridTemplateColumns: '1fr 380px', gap: '24px', alignItems: 'flex-start' }}>

        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Journey Overview */}
          <div style={{ background: '#fff', border: '0.5px solid #E2E8F0', borderRadius: '12px', padding: '24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '16px', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <div style={{ fontFamily: 'Poppins, sans-serif', fontSize: '28px', fontWeight: 700, color: '#1E293B' }}>{train.departure}</div>
                <div style={{ fontSize: '14px', color: '#64748B', marginBottom: '2px' }}>{train.from}</div>
                <div style={{ fontSize: '13px', color: '#94A3B8' }}>{train.fromCity}</div>
              </div>
              <div style={{ textAlign: 'center', minWidth: '140px' }}>
                <div style={{ fontSize: '13px', color: '#94A3B8', marginBottom: '6px' }}>{train.distance}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ flex: 1, height: '1.5px', background: '#E2E8F0' }}></div>
                  <span style={{ fontSize: '16px' }}>🚆</span>
                  <div style={{ flex: 1, height: '1.5px', background: '#E2E8F0' }}></div>
                </div>
                <div style={{ fontSize: '13px', color: '#64748B', marginTop: '6px' }}>{train.duration}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: 'Poppins, sans-serif', fontSize: '28px', fontWeight: 700, color: '#1E293B' }}>{train.arrival}</div>
                <div style={{ fontSize: '14px', color: '#64748B', marginBottom: '2px' }}>{train.to}</div>
                <div style={{ fontSize: '13px', color: '#94A3B8' }}>{train.toCity}</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {[`Runs on: ${train.days.join(', ')}`, `Train type: ${train.type}`, `Total stops: ${train.stops.length}`].map((b) => (
                <span key={b} style={{ background: '#F1F5F9', borderRadius: '20px', padding: '5px 14px', fontSize: '12px', color: '#64748B' }}>{b}</span>
              ))}
            </div>
          </div>

          {/* Station Stops */}
          <div style={{ background: '#fff', border: '0.5px solid #E2E8F0', borderRadius: '12px', padding: '24px' }}>
            <h3 style={{ fontFamily: 'Poppins, sans-serif', fontSize: '16px', fontWeight: 600, color: '#1E293B', marginBottom: '20px' }}>Station stops</h3>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {visibleStops.map((stop, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <div style={{ width: '60px', paddingTop: '2px', textAlign: 'right', flexShrink: 0 }}>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#1E293B' }}>{stop.time}</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                    <div style={{
                      width: stop.type !== 'mid' ? '14px' : '10px',
                      height: stop.type !== 'mid' ? '14px' : '10px',
                      borderRadius: '50%',
                      background: stop.type === 'source' ? '#2563EB' : stop.type === 'dest' ? '#0F766E' : '#fff',
                      border: stop.type === 'mid' ? '2px solid #94A3B8' : 'none',
                      marginTop: '3px',
                    }}></div>
                    {idx < visibleStops.length - 1 && <div style={{ width: '2px', height: '36px', background: '#E2E8F0' }}></div>}
                  </div>
                  <div style={{ paddingBottom: '12px' }}>
                    <div style={{ fontSize: '14px', fontWeight: 500, color: '#1E293B' }}>{stop.station}</div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <span style={{ fontSize: '12px', color: '#94A3B8' }}>Platform {stop.platform}</span>
                      {stop.halt && <span style={{ fontSize: '12px', color: '#94A3B8' }}>Halt: {stop.halt}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <span onClick={() => setShowAllStops(!showAllStops)} style={{ fontSize: '13px', color: '#2563EB', cursor: 'pointer', fontWeight: 500 }}>
              {showAllStops ? 'Show less ▲' : 'Show all stops ▼'}
            </span>
          </div>

          {/* Amenities */}
          <div style={{ background: '#fff', border: '0.5px solid #E2E8F0', borderRadius: '12px', padding: '24px' }}>
            <h3 style={{ fontFamily: 'Poppins, sans-serif', fontSize: '16px', fontWeight: 600, color: '#1E293B', marginBottom: '20px' }}>Train information</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
              {train.amenities.map((a) => (
                <div key={a.label} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '20px' }}>{a.icon}</span>
                  <div>
                    <div style={{ fontSize: '12px', color: '#94A3B8' }}>{a.label}</div>
                    <div style={{ fontSize: '13px', fontWeight: 500, color: '#1E293B' }}>{a.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notice */}
          <div style={{ background: '#FEF9C3', border: '1px solid #FDE047', borderRadius: '8px', padding: '16px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '18px' }}>⚠️</span>
            <p style={{ fontSize: '13px', color: '#854D0E', lineHeight: 1.6 }}>
              Ticket booking closes 4 hours before departure. Book early to avoid waitlist.
            </p>
          </div>
        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Fare Selector */}
          <div style={{ background: '#fff', border: '0.5px solid #E2E8F0', borderRadius: '12px', padding: '24px' }}>
            <h3 style={{ fontFamily: 'Poppins, sans-serif', fontSize: '15px', fontWeight: 600, color: '#1E293B', marginBottom: '16px' }}>Select class and fare</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
              {train.classes.map((cls) => (
                <div key={cls.name} onClick={() => setSelectedClass(cls.name)}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '12px 14px', borderRadius: '8px', cursor: 'pointer',
                    border: selectedClass === cls.name ? '1.5px solid #2563EB' : '1px solid #E2E8F0',
                    background: selectedClass === cls.name ? '#EFF6FF' : '#fff',
                    borderLeft: selectedClass === cls.name ? '4px solid #2563EB' : '1px solid #E2E8F0',
                  }}>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: selectedClass === cls.name ? '#2563EB' : '#1E293B' }}>{cls.name} — {cls.full}</div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: selectedClass === cls.name ? '#2563EB' : '#1E293B' }}>{cls.price}</div>
                  </div>
                  <span style={{ background: cls.statusBg, color: cls.statusColor, fontSize: '11px', fontWeight: 500, padding: '3px 10px', borderRadius: '20px' }}>{cls.status}</span>
                </div>
              ))}
            </div>
            <div style={{ borderTop: '0.5px solid #E2E8F0', paddingTop: '16px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '13px', color: '#64748B' }}>Class</span>
                <span style={{ fontSize: '13px', fontWeight: 500, color: '#1E293B' }}>{selected.full} ({selected.name})</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '13px', color: '#64748B' }}>Fare</span>
                <span style={{ fontSize: '13px', fontWeight: 500, color: '#1E293B' }}>{selected.price} per person</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '13px', color: '#64748B' }}>Availability</span>
                <span style={{ fontSize: '13px', fontWeight: 500, color: selected.statusColor }}>{selected.status}</span>
              </div>
            </div>
            <button onClick={() => window.open('https://www.irctc.co.in', '_blank')} style={{ width: '100%', height: '48px', background: '#2563EB', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 500, cursor: 'pointer', marginBottom: '8px' }}>
              Book on IRCTC ↗
            </button>
            <p style={{ fontSize: '12px', color: '#94A3B8', textAlign: 'center' }}>You will be redirected to IRCTC to complete booking</p>
          </div>

          {/* Similar Trains */}
          <div style={{ background: '#fff', border: '0.5px solid #E2E8F0', borderRadius: '12px', padding: '20px' }}>
            <h3 style={{ fontFamily: 'Poppins, sans-serif', fontSize: '15px', fontWeight: 600, color: '#1E293B', marginBottom: '16px' }}>Similar trains</h3>
            {train.similarTrains.map((t, idx) => (
              <div key={t.number}>
                <div onClick={() => navigate('/trains/' + t.number)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', cursor: 'pointer' }}>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 500, color: '#1E293B' }}>{t.name}</div>
                    <div style={{ fontSize: '12px', color: '#94A3B8' }}>#{t.number} · {t.dep} → {t.arr}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#1E293B' }}>From {t.price}</span>
                    <span style={{ color: '#2563EB', fontSize: '16px' }}>→</span>
                  </div>
                </div>
                {idx < train.similarTrains.length - 1 && <div style={{ height: '0.5px', background: '#E2E8F0' }}></div>}
              </div>
            ))}
          </div>

          {/* Nearby Hotels */}
          <div style={{ background: '#fff', border: '0.5px solid #E2E8F0', borderRadius: '12px', padding: '20px' }}>
            <h3 style={{ fontFamily: 'Poppins, sans-serif', fontSize: '15px', fontWeight: 600, color: '#1E293B', marginBottom: '16px' }}>Hotels at destination</h3>
            {train.hotels.map((h) => (
              <div key={h.name} style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ width: '48px', height: '48px', background: '#EFF6FF', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0 }}>{h.icon}</div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 500, color: '#1E293B' }}>{h.name}</div>
                  <div style={{ fontSize: '12px', color: '#94A3B8' }}>{'★'.repeat(h.stars)} · {h.price}</div>
                </div>
              </div>
            ))}
            <span onClick={() => navigate('/hotels')} style={{ fontSize: '13px', color: '#2563EB', cursor: 'pointer', fontWeight: 500 }}>View all hotels →</span>
          </div>

        </div>
      </div>
    </div>
  )
}