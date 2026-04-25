import React, { useState, useEffect } from 'react';
import { UploadCloud, Save, Users, FilePlus, Trash, Edit, CheckCircle, ExternalLink } from 'lucide-react';

const MOCK_MONTHS = [
  { id: 'sentyabr', name: 'Sentyabr', themes: ['O‘zbekiston mening Vatanim', 'Mening shahrim', 'Mening oilam', 'Mening do‘stlarim'] },
  { id: 'oktyabr', name: 'Oktyabr', themes: ['Oltin kuz', 'Sabzavot va mevalar', 'Uy hayvonlari', 'Yovvoyi hayvonlar'] },
  { id: 'noyabr', name: 'Noyabr', themes: ['Transport', 'Mening tanam', 'Sog`lom turmush tarzi', 'Kuzgi tabiat'] },
  { id: 'dekabr', name: 'Dekabr', themes: ['Qish fasli', 'Yangi yil bayrami', 'Mo`jizalar', 'Qishki o`yinlar'] },
  { id: 'yanvar', name: 'Yanvar', themes: ['Qushlar', 'Suv - hayot manbai', 'Tabiat hodisalari', 'Turli kasblar'] },
  { id: 'fevral', name: 'Fevral', themes: ['Bizning armiya', 'Texnika va men', 'Kitoblar olami', 'Raqamlar siri'] },
  { id: 'mart', name: 'Mart', themes: ['Bahor keldi', 'Onajonim bayrami', 'Navro`z', 'Gullar va o`simliklar'] },
  { id: 'aprel', name: 'Aprel', themes: ['Fazoga sayohat', 'Hasharotlar', 'Qiziqarli fan', 'Yer sayyorasi'] },
  { id: 'may', name: 'May', themes: ['Xotira aziz', 'Yaz kutyapmiz', 'Bizning yutuqlar', 'Xayr bog`cha'] }
];

function App() {
  const [activeTab, setActiveTab] = useState('upload');
  const [logs, setLogs] = useState([]);
  const [resources, setResources] = useState([]);
  const [homeworks, setHomeworks] = useState([]);
  
  // Upload states
  const [month, setMonth] = useState('Sentyabr');
  const [theme, setTheme] = useState(MOCK_MONTHS[0].themes[0]);
  const [center, setCenter] = useState('Qurish-yasash va matematika');
  
  // Media URLs
  const [videoUrl, setVideoUrl] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [images, setImages] = useState([]);
  const [slidesUrl, setSlidesUrl] = useState('');

  const [msg, setMsg] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Fetch logic
  useEffect(() => {
    fetchLogs();
    fetchResources();
    fetchHomeworks();
  }, []);

  const fetchLogs = () => {
    fetch('http://localhost:5000/api/logs')
      .then(r => r.json())
      .then(data => setLogs(data))
      .catch(e => console.error(e));
  };

  const fetchHomeworks = () => {
    fetch('http://localhost:5000/api/homeworks')
      .then(r => r.json())
      .then(data => setHomeworks(data))
      .catch(e => console.error(e));
  };

  const fetchResources = () => {
    fetch('http://localhost:5000/api/resources')
      .then(r => r.json())
      .then(data => setResources(data))
      .catch(e => console.error(e));
  };

  const handleFileUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    try {
      const res = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      
      if (type === 'video') setVideoUrl(data.url);
      else if (type === 'audio') setAudioUrl(data.url);
      else if (type === 'slide') setSlidesUrl(data.url);
      else if (type === 'image') setImages([...images, data.url]);
      
    } catch (err) {
      console.error(err);
      alert('Yuklashda xatolik');
    } finally {
      setUploading(false);
    }
  };

  const handleSaveResource = async () => {
    if(!theme) {
      setMsg('Iltimos, hafta mavzusini kiriting!');
      return;
    }
    
    const payload = { month, theme, center, videoUrl, audioUrl, images, slidesUrl };

    try {
      if (editingId) {
        await fetch(`http://localhost:5000/api/resources/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        setMsg('O`zgarishlar saqlandi! ✅');
        setEditingId(null);
      } else {
        await fetch('http://localhost:5000/api/resources', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        setMsg('Muvaffaqiyatli saqlandi! ✅');
      }
      resetForm();
      fetchResources();
      setTimeout(() => setMsg(''), 3000);
    } catch(e) {
      setMsg('Xatolik yuz berdi. Server ishlayotganiga ishonch hosil qiling.');
    }
  };

  const resetForm = () => {
    setTheme('');
    setVideoUrl('');
    setAudioUrl('');
    setImages([]);
    setSlidesUrl('');
  };

  const startEditing = (r) => {
    setEditingId(r.id);
    setMonth(r.month);
    setTheme(r.theme);
    setCenter(r.center);
    setVideoUrl(r.videoUrl || '');
    setAudioUrl(r.audioUrl || '');
    setImages(r.images || []);
    setSlidesUrl(r.slidesUrl || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if(window.confirm('Rostdan ham o`chirmoqchimisiz?')) {
      await fetch(`http://localhost:5000/api/resources/${id}`, { method: 'DELETE' });
      fetchResources();
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f5f7fa', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px' }}>
      
      <div style={{ background: 'white', borderRadius: '12px', padding: '40px', width: '100%', maxWidth: '800px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', position: 'relative' }}>
        
        {/* Link back to Main App */}
        <a 
          href="http://localhost:5173" 
          target="_blank" 
          rel="noopener noreferrer"
          style={{ position: 'absolute', top: '24px', right: '24px', display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', background: '#e0f2fe', color: '#0284c7', textDecoration: 'none', borderRadius: '8px', fontWeight: 'bold', transition: 'all 0.2s', border: '1px solid #bae6fd' }}
        >
          Bosh Sahifaga O'tish <ExternalLink size={18} />
        </a>

        <h1 style={{ marginBottom: '32px', color: '#333', textAlign: 'center', fontSize: '2rem' }}>
          Bolajon Edu <br/> Admin Panel
        </h1>

        <div style={{ display: 'flex', gap: '16px', marginBottom: '32px', borderBottom: '2px solid #eee', paddingBottom: '16px' }}>
          <button 
            onClick={() => setActiveTab('upload')}
            style={{ flex: 1, padding: '12px', fontSize: '1.1rem', fontWeight: 'bold', background: activeTab === 'upload' ? '#00B1FF' : 'transparent', color: activeTab === 'upload' ? 'white' : '#555', border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.2s' }}
          >
            <FilePlus size={20} /> O'quv Markaz Kontentlari
          </button>
          <button 
            onClick={() => { setActiveTab('stats'); fetchLogs(); }}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', border: 'none', background: activeTab === 'stats' ? '#eff6ff' : 'transparent', color: activeTab === 'stats' ? '#2563eb' : '#64748b', fontWeight: 'bold', borderRadius: '8px', cursor: 'pointer' }}
          >
            <Users size={20} /> Statistika
          </button>
          <button 
            onClick={() => { setActiveTab('homeworks'); fetchHomeworks(); }}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', border: 'none', background: activeTab === 'homeworks' ? '#eff6ff' : 'transparent', color: activeTab === 'homeworks' ? '#2563eb' : '#64748b', fontWeight: 'bold', borderRadius: '8px', cursor: 'pointer' }}
          >
            <CheckCircle size={20} /> O'quvchi Vazifalari
          </button>
        </div>
        
        {activeTab === 'upload' && (
          <div>
            {msg && <div style={{ padding: '12px', background: msg.includes('xato') ? '#ffebee' : '#e8f5e9', color: msg.includes('xato') ? '#c62828' : '#2e7d32', marginBottom: '16px', borderRadius: '8px', fontWeight: 'bold' }}>{msg}</div>}
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Qaysi oy uchun?</label>
              <select 
                value={month} 
                onChange={e => {
                  setMonth(e.target.value);
                  // Automatically set theme to the first one of newly selected month
                  const foundMonth = MOCK_MONTHS.find(m => m.name === e.target.value);
                  if (foundMonth) setTheme(foundMonth.themes[0]);
                }} 
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}
              >
                 {MOCK_MONTHS.map(m => <option key={m.id} value={m.name}>{m.name}</option>)}
              </select>
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Hafta mavzusi (Majburiy)</label>
              <select 
                value={theme} 
                onChange={e => setTheme(e.target.value)} 
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}
              >
                {(MOCK_MONTHS.find(m => m.name === month)?.themes || []).map((t, i) => (
                  <option key={i} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Faoliyat Markazni tanlang</label>
              <select value={center} onChange={e => setCenter(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}>
                <option>Qurish-yasash va matematika</option>
                <option>Syujetli rolli o‘yinlar va dramalash</option>
                <option>Til va nutq</option>
                <option>Fan va tabiat</option>
                <option>San’at markazi</option>
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '30px' }}>
              {/* VIDEO UPLOAD */}
              <div style={{ border: '2px dashed #bbb', borderRadius: '12px', padding: '20px', textAlign: 'center', background: videoUrl ? '#e8f5e9' : '#fafafa', position: 'relative' }}>
                <input type="file" accept="video/mp4,video/webm" onChange={e => handleFileUpload(e, 'video')} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}/>
                {videoUrl ? <CheckCircle color="green" size={40} style={{margin: '0 auto 8px'}}/> : <UploadCloud size={40} color="#aaa" style={{ margin: '0 auto 8px' }} />}
                <h4 style={{ color: '#555' }}>{videoUrl ? "Video yuklandi" : "Video yuklash (MP4)"}</h4>
              </div>

              {/* AUDIO UPLOAD */}
              <div style={{ border: '2px dashed #bbb', borderRadius: '12px', padding: '20px', textAlign: 'center', background: audioUrl ? '#e8f5e9' : '#fafafa', position: 'relative' }}>
                <input type="file" accept="audio/mp3,audio/wav" onChange={e => handleFileUpload(e, 'audio')} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}/>
                {audioUrl ? <CheckCircle color="green" size={40} style={{margin: '0 auto 8px'}}/> : <UploadCloud size={40} color="#aaa" style={{ margin: '0 auto 8px' }} />}
                <h4 style={{ color: '#555' }}>{audioUrl ? "Audio yuklandi" : "Audio yuklash (MP3)"}</h4>
              </div>

              {/* IMAGES UPLOAD */}
              <div style={{ border: '2px dashed #bbb', borderRadius: '12px', padding: '20px', textAlign: 'center', background: images.length > 0 ? '#e8f5e9' : '#fafafa', position: 'relative' }}>
                <input type="file" accept="image/png,image/jpeg" onChange={e => handleFileUpload(e, 'image')} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}/>
                {images.length > 0 ? <CheckCircle color="green" size={40} style={{margin: '0 auto 8px'}}/> : <UploadCloud size={40} color="#aaa" style={{ margin: '0 auto 8px' }} />}
                <h4 style={{ color: '#555' }}>{images.length > 0 ? `${images.length} ta Rasm yuklandi` : "Rasm qo'shish (PNG, JPG)"}</h4>
              </div>

              {/* SLIDES UPLOAD */}
              <div style={{ border: '2px dashed #bbb', borderRadius: '12px', padding: '20px', textAlign: 'center', background: slidesUrl ? '#e8f5e9' : '#fafafa', position: 'relative' }}>
                <input type="file" accept="application/pdf" onChange={e => handleFileUpload(e, 'slide')} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}/>
                {slidesUrl ? <CheckCircle color="green" size={40} style={{margin: '0 auto 8px'}}/> : <UploadCloud size={40} color="#aaa" style={{ margin: '0 auto 8px' }} />}
                <h4 style={{ color: '#555' }}>{slidesUrl ? "Slayd yuklandi" : "Slayd/PDF yuklash"}</h4>
              </div>
            </div>

            {uploading && <p style={{ color: '#00B1FF', textAlign: 'center', fontWeight: 'bold' }}>Fayl yuklanmoqda, kuting...</p>}

            <button onClick={handleSaveResource} disabled={uploading} style={{ width: '100%', padding: '16px', background: editingId ? '#2CD652' : '#00B1FF', color: 'white', fontWeight: 'bold', fontSize: '1.2rem', borderRadius: '8px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: uploading ? 0.6 : 1 }}>
              <Save size={24} /> {editingId ? "O'zgartirishlarni saqlash" : "Saqlash"}
            </button>
            
            {editingId && (
              <button 
                onClick={() => { setEditingId(null); resetForm(); }} 
                style={{ width: '100%', padding: '12px', background: 'transparent', color: '#888', fontWeight: 'bold', marginTop: '12px', border: 'none', cursor: 'pointer' }}>
                Tahrirlashni bekor qilish
              </button>
            )}
            
            {resources.length > 0 && (
              <div style={{ marginTop: '30px' }}>
                <h3 style={{ marginBottom: '16px' }}>Saqlangan materiallar ko'rinishi ({resources.length})</h3>
                {resources.map(r => (
                  <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: '#f8fafc', border: '1px solid #eee', marginBottom: '8px', borderRadius: '8px' }}>
                    <div>
                      <strong>{r.month}</strong> - {r.theme} <br/>
                      <small style={{ color: '#666', fontWeight: 'bold' }}>{r.center}</small><br/>
                      <small style={{ color: '#888' }}>
                        {r.videoUrl && '🎥 Video '} {r.audioUrl && '🎵 Audio '} 
                        {r.images?.length > 0 && `🖼️ ${r.images.length} Rasm `} 
                        {r.slidesUrl && '📄 Slayd '}
                      </small>
                    </div>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <button onClick={() => startEditing(r)} style={{ background: 'transparent', border: 'none', color: '#fbbf24', cursor: 'pointer' }}><Edit size={20} /></button>
                      <button onClick={() => handleDelete(r.id)} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' }}><Trash size={20} /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'stats' && (
          <div>
            <h2 style={{ marginBottom: '20px', color: '#444' }}>Tizimga kirganlar tarixi</h2>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: '#f0f4f8', borderBottom: '2px solid #ddd' }}>
                    <th style={{ padding: '12px', color: '#555' }}>Ismi</th>
                    <th style={{ padding: '12px', color: '#555' }}>Hudud (Viloyat, Tuman)</th>
                    <th style={{ padding: '12px', color: '#555' }}>DMTT / Bog'cha</th>
                    <th style={{ padding: '12px', color: '#555' }}>To'plagan Yulduzlari</th>
                    <th style={{ padding: '12px', color: '#555' }}>Kirgan vaqti</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.length === 0 && <tr><td colSpan="5" style={{ textAlign: 'center', padding: '20px', color: '#777' }}>Hozircha hech kim kirmagan</td></tr>}
                  {logs.map((log) => (
                    <tr key={log.id} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '12px', fontWeight: 'bold' }}>{log.name}</td>
                      <td style={{ padding: '12px' }}>{log.viloyat}, {log.tuman}</td>
                      <td style={{ padding: '12px' }}>
                        <span style={{ background: '#e0f2fe', color: '#0369a1', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold' }}>
                          {log.dmtt}-MTT
                        </span>
                      </td>
                      <td style={{ padding: '12px', fontWeight: 'bold', color: '#f59e0b' }}>
                        ⭐ {log.points || 0}
                      </td>
                      <td style={{ padding: '12px', color: '#777' }}>{log.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div style={{ marginTop: '20px', background: '#e8f5e9', padding: '16px', borderRadius: '8px', borderLeft: '4px solid #2e7d32' }}>
              <p style={{ margin: 0, color: '#1b5e20', fontWeight: 'bold' }}>
                Jami ro'yxatdan o'tgan o'quvchilar soni: {logs.length} ta
              </p>
            </div>
          </div>
        )}

        {activeTab === 'homeworks' && (
          <div>
            <h2 style={{ marginBottom: '24px', color: '#1e293b' }}>Yuborilgan Vazifalar</h2>
            
            <div style={{ display: 'grid', gap: '16px' }}>
              {homeworks.length === 0 && <p style={{ color: '#777', textAlign: 'center', padding: '20px' }}>O'quvchilar tomonidan hali vazifalar yuborilmadi.</p>}
              {homeworks.map(hw => (
                <div key={hw.id} style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc' }}>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '8px', color: '#1e293b' }}>{hw.studentName} <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 'normal' }}>({hw.dmtt}-MTT)</span></h3>
                    <p style={{ margin: '4px 0', color: '#475569' }}><strong>Mavzu:</strong> {hw.theme} ({hw.month}) - {hw.center}</p>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8' }}>Yuklangan vaqt: {hw.time}</p>
                  </div>
                  <div>
                    <a href={hw.fileUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', padding: '10px 20px', background: '#3b82f6', color: 'white', borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold' }}>
                      Ishni ko'rish 👁️
                    </a>
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

export default App;
