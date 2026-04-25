import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, Save, Users, FilePlus, Trash, Edit, CheckCircle, LogOut, Lock } from 'lucide-react';

const MOCK_MONTHS = [
  { id: 'sentyabr', name: 'Sentyabr', themes: ['Oʻzbekiston mening Vatanim', 'Mening shahrim', 'Mening oilam', 'Mening doвЂstlarim'] },
  { id: 'oktyabr', name: 'Oktyabr', themes: ['Oltin kuz', 'Sabzavot va mevalar', 'Uy hayvonlari', 'Yovvoyi hayvonlar'] },
  { id: 'noyabr', name: 'Noyabr', themes: ['Transport', 'Mening tanam', 'Sog`lom turmush tarzi', 'Kuzgi tabiat'] },
  { id: 'dekabr', name: 'Dekabr', themes: ['Qish fasli', 'Yangi yil bayrami', 'Mo`jizalar', 'Qishki oʻyinlar'] },
  { id: 'yanvar', name: 'Yanvar', themes: ['Qushlar', 'Suv - hayot manbai', 'Tabiat hodisalari', 'Turli kasblar'] },
  { id: 'fevral', name: 'Fevral', themes: ['Bizning armiya', 'Texnika va men', 'Kitoblar olami', 'Raqamlar siri'] },
  { id: 'mart', name: 'Mart', themes: ['Bahor keldi', 'Onajonim bayrami', 'Navro`z', 'Gullar va o`simliklar'] },
  { id: 'aprel', name: 'Aprel', themes: ['Fazoga sayohat', 'Hasharotlar', 'Qiziqarli fan', 'Yer sayyorasi'] },
  { id: 'may', name: 'May', themes: ['Xotira aziz', 'Yaz kutyapmiz', 'Bizning yutuqlar', 'Xayr bog`cha'] }
];

export default function TeacherPanel() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authData, setAuthData] = useState(null);
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
   const [activeTab, setActiveTab] = useState('homeworks');
  const [students, setStudents] = useState([]);
  const [homeworks, setHomeworks] = useState([]);
  const [events, setEvents] = useState([]);
  
  // Event Upload State
  const [eventTitle, setEventTitle] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventFiles, setEventFiles] = useState([]);
  const [isUploadingEvent, setIsUploadingEvent] = useState(false);

  useEffect(() => {
    // Check local storage on initial load
    const savedAuth = localStorage.getItem('teacherAuth');
    if (savedAuth && !isAuthenticated) {
      setIsAuthenticated(true);
      setAuthData(JSON.parse(savedAuth));
    }
  }, []);


  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/teachers');
      const teachersList = await res.json();
      const match = teachersList.find(t => t.username === username && t.password === password);
      
      if(match) {
        setIsAuthenticated(true);
        setAuthData(match);
        localStorage.setItem('teacherAuth', JSON.stringify(match));
      } else {
        alert("Login yoki parol notoʻgʻri!");
      }
    } catch(e) {
      alert("Xatolik! Server ishlayotganini tekshiring.");
    }
  };

  const clean = (str) => String(str || '').toLowerCase().trim().replace(/[^a-z0-9]/g, "");

  const fetchStudents = (auth) => {
    if (!auth) return;
    fetch('/api/students')
      .then(r => r.json())
      .then(data => {
        const filtered = data.filter(d => 
          clean(d.viloyat) === clean(auth.viloyat) && 
          clean(d.tuman) === clean(auth.tuman) && 
          clean(d.dmtt) === clean(auth.dmtt) &&
          (clean(d.group) === clean(auth.group) || !d.group || clean(d.group).includes('barchasi'))
        );
        setStudents(filtered);
      })
      .catch(e => console.error("Students Fetch Error:", e));
  };

  useEffect(() => {
    if(isAuthenticated && authData) {
      const interval = setInterval(() => {
        fetchStudents(authData);
        fetchHomeworks(authData);
        fetchEvents(authData);
      }, 5000); // 5 soniyada bir yangilanadi
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, authData]);

  const fetchHomeworks = (auth) => {
    fetch('/api/homeworks')
      .then(r => r.json())
      .then(data => {
        const filtered = data.filter(d => 
          clean(d.viloyat) === clean(auth.viloyat) && 
          clean(d.tuman) === clean(auth.tuman) && 
          clean(d.dmtt) === clean(auth.dmtt) &&
          clean(d.group) === clean(auth.group)
        );
        setHomeworks(filtered);
      })
      .catch(e => console.error(e));
  };

  const fetchEvents = (auth) => {
    fetch('/api/events')
      .then(r => r.json())
      .then(data => {
        const filtered = data.filter(e => 
          clean(e.viloyat) === clean(auth.viloyat) && 
          clean(e.tuman) === clean(auth.tuman) && 
          clean(e.dmtt) === clean(auth.dmtt) &&
          clean(e.group) === clean(auth.group)
        );
        setEvents(filtered);
      })
      .catch(e => console.error(e));
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    if(!eventTitle || eventFiles.length === 0) return alert("Sarlavha va rasmlar/videolarni kiriting");
    setIsUploadingEvent(true);
    try {
      const urls = [];
      // Multiple file upload sequentially or Promise.all
      for (const file of eventFiles) {
        const formData = new FormData();
        formData.append('file', file);
        const upRes = await fetch('/api/upload', { method:'POST', body: formData });
        const upData = await upRes.json();
        urls.push({ url: upData.url, type: file.type.startsWith('video') ? 'video' : 'image' });
      }

      await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: eventTitle,
          description: eventDescription,
          viloyat: authData.viloyat,
          tuman: authData.tuman,
          dmtt: authData.dmtt,
          group: authData.group,
          teacherName: authData.username,
          media: urls
        })
      });
      alert("Bayram materiali muvaffaqiyatli saqlandi!");
      setEventTitle(''); setEventDescription(''); setEventFiles([]);
      fetchEvents(authData);
    } catch(err) {
      alert("Xatolik");
    } finally {
      setIsUploadingEvent(false);
    }
  };

  const handleDeleteEvent = async (id) => {
    if(window.confirm('Rostdan o`chirmoqchimisiz?')) {
      await fetch(`/api/events/${id}`, { method: 'DELETE' });
      fetchEvents(authData);
    }
  };

  const handleUpdateStars = async (studentId, currentPoints, addedPoints, reason, type = 'plus') => {
    if (!addedPoints || addedPoints <= 0) return alert("Raqam kiriting!");
    if (!reason) return alert("Iltimos, sababini (izoh) yozing!");
    
    try {
      const amount = type === 'plus' ? parseInt(addedPoints) : -parseInt(addedPoints);
      const newTotal = parseInt(currentPoints || 0) + amount;
      
      const res = await fetch(`/api/students/${studentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          points: newTotal,
          historyItem: {
            amount: amount,
            reason: reason,
            teacherName: authData.username 
          }
        })
      });
      if(res.ok) {
        alert(`${amount > 0 ? '+' : ''}${amount} ta yulduz saqlandi! ⭐`);
        fetchStudents(authData);
        document.getElementById(`stars-${studentId}`).value = ''; 
        document.getElementById(`reason-${studentId}`).value = ''; 
      }
    } catch(e) { alert("Xatolik!"); }
  };

  if(!isAuthenticated) {
    return (
      <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#f5f7fa' }}>
        <form onSubmit={handleLogin} style={{ background: 'white', padding: '40px', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', textAlign: 'center', maxWidth: '400px', width: '90%' }}>
          <div style={{ background: '#FF5A5A', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', margin: '0 auto 20px' }}>
            <Lock size={40} />
          </div>
          <h2 style={{ marginBottom: '10px', color: '#333' }}>Tarbiyachi tizimiga kirish</h2>
          <p style={{ color: '#777', marginBottom: '24px' }}>Super Admin taqdim etgan login parolingizni kiriting</p>
          <input 
            type="text" 
            placeholder="Login" 
            value={username}
            onChange={e => setUsername(e.target.value)}
            style={{ width: '100%', padding: '16px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1.2rem', textAlign: 'center', marginBottom: '12px' }}
          />
          <input 
            type="password" 
            placeholder="Parol" 
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={{ width: '100%', padding: '16px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1.2rem', textAlign: 'center', letterSpacing: '4px', marginBottom: '20px' }}
          />
          <button type="submit" style={{ width: '100%', background: '#FF5A5A', color: 'white', padding: '16px', border: 'none', borderRadius: '8px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer' }}>
            Kirish
          </button>
          
          <button type="button" onClick={() => navigate('/')} style={{ marginTop: '20px', background: 'transparent', color: '#555', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
            Ortga qaytish
          </button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f7fa', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px' }}>
      
      <div style={{ background: 'white', borderRadius: '12px', padding: '40px', width: '100%', maxWidth: '800px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', position: 'relative' }}>
        
        <button 
          onClick={() => {
            localStorage.removeItem('teacherAuth');
            navigate('/');
          }}
          style={{ position: 'absolute', top: '24px', right: '24px', display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', background: '#fef2f2', color: '#ef4444', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' }}
        >
          Chiqish <LogOut size={18} />
        </button>

        <h1 style={{ marginBottom: '32px', color: '#333', textAlign: 'center', fontSize: '2rem' }}>
          Bolajon Edu
          <h2 style={{ textAlign: 'center', color: '#ff4d4d', fontWeight: 'bold', fontSize: '1.8rem', marginBottom: '10px' }}>
            {authData?.username} (Tarbiyachi) Paneli
          </h2>
          <div style={{ textAlign: 'center', marginBottom: '30px', color: '#666', fontSize: '0.9rem' }}>
             {authData?.viloyat}, {authData?.tuman}, {authData?.dmtt}-DMTT, {authData?.group}
          </div>
        </h1>

        <div className="responsive-tabs" style={{ display: 'flex', gap: '16px', marginBottom: '32px', borderBottom: '2px solid #eee', paddingBottom: '16px', overflowX: 'auto' }}>
          <button 
            onClick={() => { setActiveTab('homeworks'); fetchHomeworks(authData); }}
            style={{ flex: 1, padding: '12px', fontSize: '1.1rem', fontWeight: 'bold', background: activeTab === 'homeworks' ? '#FF5A5A' : 'transparent', color: activeTab === 'homeworks' ? 'white' : '#555', border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.2s', minWidth: '200px' }}
          >
            <CheckCircle size={20} /> Tarbiyalanuvchi Vazifalari
          </button>
          <button 
            onClick={() => { setActiveTab('stats'); fetchStudents(authData); }}
            style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px 24px', border: 'none', background: activeTab === 'stats' ? '#fef2f2' : 'transparent', color: activeTab === 'stats' ? '#ef4444' : '#64748b', fontWeight: 'bold', borderRadius: '8px', cursor: 'pointer', minWidth: '150px' }}
          >
            <Users size={20} /> Oʻquvchilar Roʻyxati
          </button>
          <button 
            onClick={() => { setActiveTab('events'); fetchEvents(authData); }}
            style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px 24px', border: 'none', background: activeTab === 'events' ? '#eef2ff' : 'transparent', color: activeTab === 'events' ? '#4f46e5' : '#64748b', fontWeight: 'bold', borderRadius: '8px', cursor: 'pointer', minWidth: '150px' }}
          >
            🎉 Bayramlar
          </button>
        </div>
        
        {/* (upload tab completely removed) */}
 
        {activeTab === 'stats' && (
          <div>
            <div style={{ padding: '12px', background: '#fffbeb', color: '#b45309', borderRadius: '8px', marginBottom: '20px', fontWeight: 'bold' }}>
              Qamrov hududingiz: {authData?.viloyat}, {authData?.tuman}, {authData?.dmtt}-MTT ({authData?.group})
            </div>
            <h2 style={{ marginBottom: '20px', color: '#444' }}>Guruhdagi barcha oʻquvchilar</h2>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: '#fef2f2', borderBottom: '2px solid #fecaca' }}>
                    <th style={{ padding: '12px', color: '#7f1d1d' }}>Oʻquvchi ismi</th>
                    <th style={{ padding: '12px', color: '#7f1d1d' }}>Login / Parol</th>
                    <th style={{ padding: '12px', color: '#7f1d1d' }}>Yulduzlari</th>
                    <th style={{ padding: '12px', color: '#7f1d1d' }}>Roʻyxatdan oʻtgan</th>
                    <th style={{ padding: '12px', color: '#7f1d1d' }}>Baholash (Yulduz bering)</th>
                  </tr>
                </thead>
                <tbody>
                  {students.length === 0 && <tr><td colSpan="5" style={{ textAlign: 'center', padding: '20px', color: '#777' }}>Guruhda oʻquvchilar topilmadi</td></tr>}
                  {students.map((student) => (
                    <tr key={student.id} style={{ borderBottom: '1px solid #fee2e2' }}>
                      <td style={{ padding: '12px', fontWeight: 'bold' }}>{student.name}</td>
                      <td style={{ padding: '12px', fontSize: '0.9rem', color: '#4f46e5' }}>
                        <strong>L:</strong> {student.username} <br/> <strong>P:</strong> {student.password}
                      </td>
                      <td style={{ padding: '12px', fontWeight: 'bold', color: '#f59e0b' }}>
                        {student.points || 0} ⭐
                      </td>
                      <td style={{ padding: '12px', color: '#777', fontSize: '0.9rem' }}>{student.createdAt}</td>
                      <td style={{ padding: '12px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '180px' }}>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <input 
                              type="number" 
                              placeholder="Soni"
                              id={`stars-${student.id}`}
                              style={{ width: '60px', padding: '6px', borderRadius: '6px', border: '1px solid #ddd', textAlign: 'center' }}
                            />
                            <input 
                              type="text" 
                              placeholder="Sababi (Izoh)..."
                              id={`reason-${student.id}`}
                              style={{ flex: 1, padding: '6px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '0.85rem' }}
                            />
                          </div>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button 
                              onClick={() => {
                                const val = document.getElementById(`stars-${student.id}`).value;
                                const rsn = document.getElementById(`reason-${student.id}`).value;
                                handleUpdateStars(student.id, student.points || 0, val, rsn, 'plus');
                              }}
                              style={{ flex: 1, padding: '6px', background: '#22c55e', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
                            >
                              + Qoʻshish
                            </button>
                            <button 
                              onClick={() => {
                                const val = document.getElementById(`stars-${student.id}`).value;
                                const rsn = document.getElementById(`reason-${student.id}`).value;
                                handleUpdateStars(student.id, student.points || 0, val, rsn, 'minus');
                              }}
                              style={{ flex: 1, padding: '6px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
                            >
                              - Ayirish
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'homeworks' && (
          <div>
            <h2 style={{ marginBottom: '24px', color: '#1e293b' }}>Yuborilgan Vazifalar</h2>
            
            <div style={{ display: 'grid', gap: '16px' }}>
              {homeworks.length === 0 && <p style={{ color: '#777', textAlign: 'center', padding: '20px' }}>Tarbiyalanuvchilar tomonidan hali vazifalar yuborilmadi.</p>}
              {homeworks.map(hw => (
                <div key={hw.id} className="responsive-flex-between" style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px', background: '#f8fafc' }}>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '8px', color: '#7f1d1d' }}>{hw.studentName} <span style={{ fontSize: '0.9rem', color: '#b91c1c', fontWeight: 'normal' }}>({hw.dmtt}-MTT)</span></h3>
                    <p style={{ margin: '4px 0', color: '#991b1b' }}><strong>Mavzu:</strong> {hw.theme} ({hw.month}) <br/> {hw.center}</p>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#ef4444' }}>Yuklangan vaqt: {hw.time}</p>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexDirection: 'column' }}>
                    <a href={hw.fileUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '10px 16px', background: '#3b82f6', color: 'white', borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold' }}>
                      👁️ Ochiq koʻrish
                    </a>
                    <a href={hw.fileUrl} download={`vazifa-${hw.studentName}`} title="Oʻquvchi faylini kompyuterga saqlab olish" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '10px 16px', background: '#ef4444', color: 'white', borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold' }}>
                      <UploadCloud size={18} style={{ transform: 'rotate(180deg)' }} /> Yuklash
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'events' && (
          <div>
             <h2 style={{ marginBottom: '20px', color: '#4f46e5' }}>🎉 Bayramlar va Tadbirlar (Galereya tuzish)</h2>
             <form onSubmit={handleCreateEvent} style={{ background: '#f8fafc', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '30px' }}>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>Tadbir Nomi</label>
                  <input type="text" placeholder="Masalan: Navroʻz bayrami 2026" value={eventTitle} onChange={e => setEventTitle(e.target.value)} required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }} />
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>Tavsif (ixtiyoriy)</label>
                  <textarea placeholder="Kichik taʻrif yozing..." value={eventDescription} onChange={e => setEventDescription(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', minHeight: '80px', fontFamily: 'inherit' }} />
                </div>
                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>Rasm va Videolar qoʻshish (Koʻp tanlash mumkin)</label>
                  <input type="file" multiple accept="image/*,video/*" onChange={e => setEventFiles(Array.from(e.target.files))} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '2px dashed #4f46e5', background: '#eef2ff' }} />
                  {eventFiles.length > 0 && <small style={{ color: '#4f46e5', display: 'block', marginTop: '8px' }}>{eventFiles.length} ta fayl tanlandi</small>}
                </div>
                <button type="submit" disabled={isUploadingEvent} style={{ padding: '14px 24px', background: isUploadingEvent ? '#94a3b8' : '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', width: '100%', fontSize: '1.1rem' }}>
                  {isUploadingEvent ? 'Yuklanmoqda... Biroz kuting' : "+ Galereyani Saqlash"}
                </button>
             </form>

             <h3 style={{ marginBottom: '16px' }}>Saqlangan Tadbirlar</h3>
             {events.length === 0 && <p style={{ color: '#777' }}>Hali bayram qoʻshilmagan</p>}
             <div className="responsive-grid-2" style={{ alignItems: 'start' }}>
               {events.map(ev => (
                 <div key={ev.id} style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', minWidth: 0, display: 'flex', flexDirection: 'column' }}>
                    <div className="responsive-flex-between" style={{ marginBottom: '12px', alignItems: 'start' }}>
                       <div style={{ flex: 1, minWidth: 0 }}>
                         <h3 style={{ margin: 0, color: '#1e293b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{ev.title}</h3>
                         <p style={{ color: '#64748b', fontSize: '0.8rem', margin: '4px 0' }}>{ev.createdAt}</p>
                       </div>
                       <button onClick={() => handleDeleteEvent(ev.id)} style={{ background: '#fef2f2', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '8px', borderRadius: '50%', display: 'flex', alignItems: 'center' }}><Trash size={18}/></button>
                    </div>
                    <p style={{ color: '#475569', marginBottom: '16px', fontSize: '0.9rem', lineBreak: 'anywhere' }}>{ev.description}</p>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {ev.media && ev.media.map((m, idx) => (
                         m.type === 'image' 
                           ? <img key={idx} src={m.url} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #eee' }} />
                           : <video key={idx} src={m.url} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '6px', background: '#000' }} />
                      ))}
                    </div>
                 </div>
               ))}
             </div>
          </div>
        )}

      </div>
    </div>
  );
}
