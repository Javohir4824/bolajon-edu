import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Star, LogOut, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TopBar({ title, hideBack = false }) {
  const { user: appContextUser, points, logout, playClickSound } = useAppContext();
  const navigate = useNavigate();
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState([]);

  // Determine active user (Director or Student)
  const [activeUser, setActiveUser] = useState(null);

  useEffect(() => {
    const director = localStorage.getItem('directorAuth');
    if (director) {
      const d = JSON.parse(director);
      setActiveUser({ name: d.username, isDirector: true });
      setShowHistory(false); // Directors donʻt need history modal
    } else if (appContextUser) {
      setActiveUser(appContextUser);
      // Fetch history for student
      if (appContextUser.backendId) {
        fetch(`/api/students/${appContextUser.backendId}`)
          .then(r => r.json())
          .then(data => {
            if (data.history) setHistory(data.history);
          })
          .catch(err => console.error("History error:", err));
      }
    } else {
      setActiveUser(null);
    }
  }, [appContextUser]);

  const handleLogout = () => {
    playClickSound();
    localStorage.removeItem('directorAuth');
    logout();
    navigate('/');
  };

  return (
    <>
      <motion.header 
        className="top-bar"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {!hideBack && (
            <button className="btn" style={{ padding: '8px 16px', fontSize: '1rem', background: '#FF5A5A', boxShadow: '0 4px 0 #D32F2F', color: 'white' }} onClick={() => { playClickSound(); navigate(-1); }}>
              ⬅️ Orqaga
            </button>
          )}
          <h2 style={{ color: 'var(--text-dark)' }}>{title}</h2>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {activeUser && (
            <>
              <motion.div className="user-badge" whileHover={{ scale: 1.05 }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                  {activeUser?.name?.[0]?.toUpperCase()}
                </div>
                <span className="hide-mobile">{activeUser?.name}</span>
              </motion.div>
              
              {!activeUser.isDirector && (
                <motion.div 
                  className="points"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => { playClickSound(); setShowHistory(true); }}
                  style={{ cursor: 'pointer', background: 'linear-gradient(135deg, #FFD700, #FFA500)', padding: '6px 14px', borderRadius: '50px', display: 'flex', alignItems: 'center', gap: '8px', color: 'white', fontWeight: 'bold', boxShadow: '0 4px 0 #CC8400' }}
                >
                  <Star fill="white" size={20} />
                  <span>{points}</span>
                </motion.div>
              )}

              <button onClick={handleLogout} style={{ background: 'transparent', border: 'none', color: '#ff5a5a', padding: '5px', cursor: 'pointer' }}>
                <LogOut size={24} />
              </button>
            </>
          )}
        </div>
      </motion.header>

      {/* History Modal */}
      <AnimatePresence>
        {showHistory && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }} onClick={() => setShowHistory(false)}>
            <motion.div 
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              style={{ background: 'white', width: '100%', maxWidth: '500px', borderRadius: '24px', padding: '30px', position: 'relative', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}
              onClick={e => e.stopPropagation()}
            >
              <button 
                onClick={() => setShowHistory(false)}
                style={{ position: 'absolute', top: '20px', right: '20px', background: '#f1f5f9', border: 'none', borderRadius: '50%', padding: '6px', cursor: 'pointer' }}
              >
                <X size={24} />
              </button>

              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <div style={{ background: '#FFD700', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: '0 10px 20px rgba(255,215,0,0.3)' }}>
                  <Star fill="white" color="white" size={40} />
                </div>
                <h2 style={{ color: '#1e293b' }}>Yulduzlar Tarixi</h2>
                <p style={{ color: '#64748b' }}>Sizning toʻplagan jami yulduzlaringiz: <strong style={{ color: '#f59e0b' }}>{points} ta</strong></p>
              </div>

              <div style={{ maxHeight: '350px', overflowY: 'auto', padding: '4px' }}>
                {history.length === 0 ? (
                  <p style={{ textAlign: 'center', color: '#94a3b8', padding: '40px 0' }}>Hali yulduzlar tarixi mavjud emas.</p>
                ) : (
                  [...history].reverse().map((h, i) => (
                    <motion.div 
                      key={i} 
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: i * 0.05 }}
                      style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: i % 2 === 0 ? '#f8fafc' : 'white', borderRadius: '16px', marginBottom: '10px', border: '1px solid #f1f5f9' }}
                    >
                      <div style={{ flex: 1, marginRight: '16px' }}>
                        <strong style={{ display: 'block', color: '#334155', fontSize: '1.05rem', marginBottom: '4px' }}>{h.reason}</strong>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                          <span style={{ color: '#6366f1', fontSize: '0.8rem', fontWeight: 'bold' }}>👩‍🏫 {h.teacherName || 'Tarbiyachi'}</span>
                          <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>📅 {h.time}</span>
                        </div>
                      </div>
                      <div style={{ 
                        minWidth: '50px', 
                        height: '50px', 
                        borderRadius: '50%', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        background: h.amount >= 0 ? '#dcfce7' : '#fee2e2', 
                        color: h.amount >= 0 ? '#166534' : '#991b1b', 
                        fontWeight: 'bold',
                        fontSize: '1.1rem',
                        border: `2px solid ${h.amount >= 0 ? '#bbf7d0' : '#fecaca'}`
                      }}>
                        {h.amount >= 0 ? '+' : ''}{h.amount}
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
              
              <button 
                onClick={() => setShowHistory(false)}
                style={{ width: '100%', marginTop: '24px', padding: '14px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer' }}
              >
                Tushunarli! 😊
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
