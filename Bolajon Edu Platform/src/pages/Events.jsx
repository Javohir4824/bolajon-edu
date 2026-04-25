import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAppContext } from '../context/AppContext';
import TopBar from '../components/TopBar';
import AnimatedBackground from '../components/AnimatedBackground';

export default function Events() {
  const { user, playClickSound } = useAppContext();
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  const clean = (str) => String(str || '').replace(/[^a-zA-Z0-9]/g, "").toLowerCase();

  useEffect(() => {
    if(!user?.location) return;
    
    fetch('/api/events')
      .then(r => r.json())
      .then(data => {
        // Filter events by the studentʻs kindergarten location & group
        const filtered = data.filter(e => 
          clean(e.viloyat) === clean(user.location.viloyat) && 
          clean(e.tuman) === clean(user.location.tuman) && 
          clean(e.dmtt) === clean(user.location.dmtt) &&
          (clean(e.group) === clean(user.location.group) || !e.group)
        );
        setEvents(filtered);
      })
      .catch(e => console.error("Error fetching events", e));
  }, [user]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="app-layout" style={{ position: 'relative' }}>
      <AnimatedBackground type="spring" />
      <TopBar title="Bogʻchamiz Bayramlari" />
      
      <main className="main-content" style={{ zIndex: 1, position: 'relative' }}>
        <h1 style={{ textAlign: 'center', margin: '20px 0', fontSize: '2.5rem', color: '#ec4899' }}>
          🎉 Bogʻchamiz Tadbirlari va Bayramlari
        </h1>
        <p style={{ textAlign: 'center', color: '#555', marginBottom: '32px', fontSize: '1.2rem' }}>
          Tarbiyachilarimiz tomonidan joylangan eng qiziqarli lahzalar galereyasi!
        </p>

        {events.length === 0 ? (
           <div style={{ textAlign: 'center', padding: '60px', background: 'rgba(255,255,255,0.8)', borderRadius: '20px', maxWidth: '600px', margin: '0 auto' }}>
              <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🎭</div>
              <h2 style={{ color: '#555' }}>Hozircha bayramlar yoʻq</h2>
              <p>Tarbiyachilarimiz tez orada chiroyli rasmlarni yuklashadi!</p>
           </div>
        ) : (
          <motion.div 
            className="events-feed"
            variants={containerVariants}
            initial="hidden"
            animate="show"
            style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '40px' }}
          >
            {events.map((ev, index) => (
              <motion.div 
                key={ev.id}
                variants={itemVariants}
                className="glass-card"
                style={{ padding: '0', overflow: 'hidden', border: '3px solid #fbcfe8', boxShadow: '0 10px 30px rgba(236,72,153,0.1)' }}
              >
                {/* Event Header */}
                <div style={{ background: '#fbcfe8', padding: '24px', borderBottom: '2px solid #f9a8d4' }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h2 style={{ color: '#be185d', fontSize: '1.8rem', margin: 0 }}>🎉 {ev.title}</h2>
                      <span style={{ background: '#be185d', color: 'white', padding: '6px 14px', borderRadius: '20px', fontWeight: 'bold', fontSize: '0.9rem' }}>
                         {ev.dmtt}-MTT
                      </span>
                   </div>
                   <p style={{ margin: '8px 0 0', fontSize: '1rem', color: '#831843', opacity: 0.8 }}>
                      Ustoz: {ev.teacherName} | {ev.createdAt}
                   </p>
                </div>
                
                {/* Event Description */}
                {ev.description && (
                  <div style={{ padding: '24px', background: 'white' }}>
                    <p style={{ color: '#475569', fontSize: '1.2rem', lineHeight: '1.6', fontStyle: 'italic' }}>"{ev.description}"</p>
                  </div>
                )}

                {/* Media Gallery - Single column or natural size to show "as is" */}
                <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', background: '#fff' }}>
                  {ev.media && ev.media.map((m, idx) => (
                     m.type === 'image' ? (
                       <div key={idx} style={{ borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                          <img src={m.url} style={{ width: '100%', height: 'auto', display: 'block' }} alt="bayram" />
                       </div>
                     ) : (
                       <div key={idx} style={{ borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', background: '#000' }}>
                          <video src={m.url} controls style={{ width: '100%', height: 'auto', display: 'block' }} />
                       </div>
                     )
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </main>
    </div>
  );
}
