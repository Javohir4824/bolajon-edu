import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AnimatedBackground from '../components/AnimatedBackground';

export default function Gateway() {
  const navigate = useNavigate();

  useEffect(() => {
    // If already logged in, skip the gateway
    if (localStorage.getItem('directorAuth')) {
      navigate('/director');
    } else if (localStorage.getItem('user')) {
      navigate('/dashboard');
    }
  }, [navigate]);

  return (
    <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
      <AnimatedBackground type="dashboard" />
      
      <div style={{ 
        background: 'rgba(255, 255, 255, 0.9)', 
        padding: '50px', 
        borderRadius: '24px', 
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)', 
        zIndex: 2, 
        textAlign: 'center',
        backdropFilter: 'blur(10px)',
        border: '3px solid white',
        maxWidth: '600px',
        width: '90%'
      }}>
        <h1 style={{ fontSize: '3.5rem', color: '#ffb020', textShadow: '2px 2px 0px #fff, 4px 4px 0px rgba(0,0,0,0.1)', margin: '0 0 10px 0' }}>
          Bolajon Edu {'\u2728'}
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#555', marginBottom: '40px', fontWeight: 'bold' }}>
          Platformaga xush kelibsiz! Marhamat, kimligingizni tanlang:
        </p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
          <button 
            onClick={() => navigate('/student')}
            style={{ 
              background: '#00B1FF', 
              border: 'none', 
              padding: '24px 10px', 
              borderRadius: '20px', 
              color: 'white', 
              fontSize: '1.4rem', 
              fontWeight: 'bold', 
              cursor: 'pointer',
              boxShadow: '0 8px 16px rgba(0, 177, 255, 0.2)',
              transition: 'all 0.2s'
            }}
          >
            <div style={{ fontSize: '3rem', marginBottom: '8px' }}>{'\uD83D\uDC66'}</div>
            Tarbiyalanuvchi
          </button>
          
          <button 
            onClick={() => navigate('/teacher')}
            style={{ 
              background: '#FF5A5A', 
              border: 'none', 
              padding: '24px 10px', 
              borderRadius: '20px', 
              color: 'white', 
              fontSize: '1.4rem', 
              fontWeight: 'bold', 
              cursor: 'pointer',
              boxShadow: '0 8px 16px rgba(255, 90, 90, 0.2)',
              transition: 'all 0.2s'
            }}
          >
            <div style={{ fontSize: '3rem', marginBottom: '8px' }}>{'\uD83D\uDC69\u200D\uD83C\uDFEB'}</div>
            Tarbiyachi
          </button>

          <button 
            onClick={() => navigate('/director')}
            style={{ 
              background: '#fbbf24', 
              border: 'none', 
              padding: '24px 10px', 
              borderRadius: '20px', 
              color: 'white', 
              fontSize: '1.4rem', 
              fontWeight: 'bold', 
              cursor: 'pointer',
              boxShadow: '0 8px 16px rgba(251, 191, 36, 0.2)',
              transition: 'all 0.2s',
              gridColumn: 'span 1'
            }}
          >
            <div style={{ fontSize: '3rem', marginBottom: '8px' }}>{'\uD83C\uDFE2'}</div>
            Mudir (Mudira)
          </button>
        </div>
      </div>
      
      {/* Super Admin Hidden Button */}
      <div 
        onClick={() => navigate('/superadmin')}
        style={{ position: 'absolute', bottom: '20px', right: '20px', width: '40px', height: '40px', background: 'rgba(255,255,255,0.5)', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', opacity: 0.3, transition: 'all 0.3s' }}
        onMouseOver={e => e.currentTarget.style.opacity = 1}
        onMouseOut={e => e.currentTarget.style.opacity = 0.3}
        title="Super Admin Panelega Kirish"
      >
        <span style={{ fontSize: '1.2rem' }}>{'\uD83D\uDD12'}</span>
      </div>
    </div>
  );
}
