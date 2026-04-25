import { useState, useEffect } from 'react';

// Example Mock Data Structure
export const mockData = {
  viloyats: [
    'Toshkent shahri', 'Andijon viloyati', 'Buxoro viloyati', 'Fargʻona viloyati', 
    'Jizzax viloyati', 'Xorazm viloyati', 'Namangan viloyati', 'Navoiy viloyati', 
    'Qashqadaryo viloyati', 'Qoraqalpogʻiston Respublikasi', 'Samarqand viloyati', 
    'Sirdaryo viloyati', 'Surxondaryo viloyati', 'Toshkent viloyati'
  ],
  tumans: {
    'Toshkent shahri': ['Bektemir tumani', 'Chilonzor tumani', 'Mirobod tumani', 'Mirzo Ulugʻbek tumani', 'Sergeli tumani', 'Olmazor tumani', 'Uchtepa tumani', 'Shayxontohur tumani', 'Yashnobod tumani', 'Yunusobod tumani', 'Yakkasaroy tumani', 'Yangihayot tumani'],
    'Andijon viloyati': ['Andijon shahri', 'Xonabod shahri', 'Oltinkoʻl tumani', 'Andijon tumani', 'Asaka tumani', 'Baliqchi tumani', 'Boʻz tumani', 'Buloqboshi tumani', 'Izboskan tumani', 'Jalaquduq tumani', 'Marhamat tumani', 'Paxtaobod tumani', 'Qoʻrgʻontepa tumani', 'Ulugʻnor tumani', 'Xoʻjaobod tumani'],
    'Buxoro viloyati': ['Buxoro shahri', 'Kogon shahri', 'Buxoro tumani', 'Gʻijduvon tumani', 'Jondor tumani', 'Kogon tumani', 'Olot tumani', 'Peshku tumani', 'Qorakoʻl tumani', 'Qorovulbozor tumani', 'Romitan tumani', 'Shofirkon tumani', 'Vobkent tumani'],
    'Fargʻona viloyati': ['Fargʻona shahri', 'Margʻilon shahri', 'Qoʻqon shahri', 'Quvasoy shahri', 'Bogʻdod tumani', 'Beshariq tumani', 'Buvayda tumani', 'Dangʻara tumani', 'Fargʻona tumani', 'Furqat tumani', 'Oltiariq tumani', 'Qoʻshtepa tumani', 'Quva tumani', 'Rishton tumani', 'Soʻx tumani', 'Toshloq tumani', 'Uchkoʻprik tumani', 'Yozyovon tumani'],
    'Jizzax viloyati': ['Jizzax shahri', 'Arnasoy tumani', 'Baxmal tumani', 'Doʻstlik tumani', 'Forish tumani', 'Gʻallaorol tumani', 'Mirzachoʻl tumani', 'Paxtakor tumani', 'Yangiobod tumani', 'Zafarobod tumani', 'Zarbdor tumani', 'Zomin tumani', 'Sharof Rashidov tumani'],
    'Xorazm viloyati': ['Urganch shahri', 'Xiva shahri', 'Bogʻot tumani', 'Gurlan tumani', 'Xonqa tumani', 'Hazorasp tumani', 'Qoʻshkoʻpir tumani', 'Shovot tumani', 'Urganch tumani', 'Xiva tumani', 'Yangiariq tumani', 'Yangibozor tumani', 'Tuproqqalʻa tumani'],
    'Namangan viloyati': ['Namangan shahri', 'Chortoq tumani', 'Chust tumani', 'Kosonsoy tumani', 'Mingbuloq tumani', 'Namangan tumani', 'Norin tumani', 'Pop tumani', 'Toʻraqoʻrgʻon tumani', 'Uchqoʻrgʻon tumani', 'Uychi tumani', 'Yangiqoʻrgʻon tumani'],
    'Navoiy viloyati': ['Navoiy shahri', 'Zarafshon shahri', 'Karmana tumani', 'Konimex tumani', 'Qiziltepa tumani', 'Xatirchi tumani', 'Navbahor tumani', 'Nurota tumani', 'Tomdi tumani', 'Uchquduq tumani'],
    'Qashqadaryo viloyati': ['Qarshi shahri', 'Shahrisabz shahri', 'Chiroqchi tumani', 'Dehqonobod tumani', 'Gʻuzor tumani', 'Kasbi tumani', 'Kitob tumani', 'Koson tumani', 'Mirishkor tumani', 'Muborak tumani', 'Nishon tumani', 'Qamashi tumani', 'Qarshi tumani', 'Koʻkdala tumani', 'Shahrisabz tumani', 'Yakkabogʻ tumani'],
    'Qoraqalpogʻiston Respublikasi': ['Nukus shahri', 'Amudaryo tumani', 'Beruniy tumani', 'Chimboy tumani', 'Ellikqalʻa tumani', 'Kegeyli tumani', 'Moʻynoq tumani', 'Nukus tumani', 'Qanlikoʻl tumani', 'Qoʻngʻirot tumani', 'Qoraoʻzak tumani', 'Shumanay tumani', 'Taxtakoʻpir tumani', 'Toʻrtkoʻl tumani', 'Xoʻjayli tumani', 'Taxiatosh tumani', 'Boʻzatov tumani'],
    'Samarqand viloyati': ['Samarqand shahri', 'Kattaqoʻrgʻon shahri', 'Oqdaryo tumani', 'Bulungʻur tumani', 'Jomboy tumani', 'Ishtixon tumani', 'Kattaqoʻrgʻon tumani', 'Narpay tumani', 'Nurobod tumani', 'Payariq tumani', 'Pastdargʻom tumani', 'Paxtachi tumani', 'Qoʻshrabot tumani', 'Samarqand tumani', 'Toyloq tumani', 'Urgut tumani'],
    'Sirdaryo viloyati': ['Guliston shahri', 'Yangiyer shahri', 'Shirin shahri', 'Oqoltin tumani', 'Boyovut tumani', 'Guliston tumani', 'Xovos tumani', 'Mirzaobod tumani', 'Sardoba tumani', 'Sayxunobod tumani', 'Sirdaryo tumani'],
    'Surxondaryo viloyati': ['Termiz shahri', 'Angor tumani', 'Boysun tumani', 'Denov tumani', 'Jarqoʻrgʻon tumani', 'Qiziriq tumani', 'Qumqoʻrgʻon tumani', 'Muzrabot tumani', 'Oltinsoy tumani', 'Sariosiyo tumani', 'Sherobod tumani', 'Shoʻrchi tumani', 'Termiz tumani', 'Uzun tumani', 'Bandixon tumani'],
    'Toshkent viloyati': ['Nurafshon shahri', 'Olmaliq shahri', 'Angren shahri', 'Bekobod shahri', 'Chirchiq shahri', 'Ohangaron shahri', 'Yangiyoʻl shahri', 'Boʻka tumani', 'Boʻstonliq tumani', 'Zangiota tumani', 'Qibray tumani', 'Quyichirchiq tumani', 'Oqqoʻrgʻon tumani', 'Ohangaron tumani', 'Parkent tumani', 'Piskent tumani', 'Oʻrtachirchiq tumani', 'Chinoz tumani', 'Yuqorichirchiq tumani', 'Yangiyoʻl tumani', 'Toshkent tumani']
  },
  months: [
    { id: 'sentyabr', name: 'Sentyabr', color: '#ffb020', themes: ['Oʻzbekiston mening Vatanim', 'Mening shahrim', 'Mening oilam', 'Mening doʻstlarim'] },
    { id: 'oktyabr', name: 'Oktyabr', color: '#ff6b6b', themes: ['Oltin kuz', 'Sabzavot va mevalar', 'Uy hayvonlari', 'Yovvoyi hayvonlar'] },
    { id: 'noyabr', name: 'Noyabr', color: '#4ecdc4', themes: ['Transport', 'Mening tanam', 'Sog`lom turmush tarzi', 'Kuzgi tabiat'] },
    { id: 'dekabr', name: 'Dekabr', color: '#45b7d1', themes: ['Qish fasli', 'Yangi yil bayrami', 'Mo`jizalar', 'Qishki oʻyinlar'] },
    { id: 'yanvar', name: 'Yanvar', color: '#6a0572', themes: ['Qushlar', 'Suv - hayot manbai', 'Tabiat hodisalari', 'Turli kasblar'] },
    { id: 'fevral', name: 'Fevral', color: '#a0e8af', themes: ['Bizning armiya', 'Texnika va men', 'Kitoblar olami', 'Raqamlar siri'] },
    { id: 'mart', name: 'Mart', color: '#ff9ff3', themes: ['Bahor keldi', 'Onajonim bayrami', 'Navro`z', 'Gullar va o`simliklar'] },
    { id: 'aprel', name: 'Aprel', color: '#feca57', themes: ['Fazoga sayohat', 'Hasharotlar', 'Qiziqarli fan', 'Yer sayyorasi'] },
    { id: 'may', name: 'May', color: '#54a0ff', themes: ['Xotira aziz', 'Yaz kutyapmiz', 'Bizning yutuqlar', 'Xayr bog`cha'] }
  ],
  sections: [
    { id: 'qurish', name: 'Qurish-yasash va matematika', icon: '📐', bgColor: '#FFB020' },
    { id: 'syujet', name: 'Syujetli rolli oʻyinlar va dramalash', icon: '🎭', bgColor: '#FF5A5A' },
    { id: 'til', name: 'Til va nutq', icon: '🗣️', bgColor: '#00B1FF' },
    { id: 'fan', name: 'Fan va tabiat', icon: '🌱', bgColor: '#2CD652' },
    { id: 'sanat', name: 'Sanʻat markazi', icon: '🎨', bgColor: '#9C27B0' }
  ],
  groups: ['1-Kichik', '2-Kichik', '1-Oʻrta', '2-Oʻrta', '1-Katta', '2-Katta', '1-Tayyorlov', '2-Tayyorlov'],
  adminGroups: [
    '1-Kichik', '2-Kichik', '3-Kichik', 
    '1-Oʻrta', '2-Oʻrta', '3-Oʻrta', 
    '1-Katta', '2-Katta', '3-Katta', 
    '1-Tayyorlov', '2-Tayyorlov', '3-Tayyorlov'
  ]
};

export const useAppStore = () => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('bolajon_user');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [points, setPoints] = useState(() => {
    return parseInt(localStorage.getItem('bolajon_points')) || 0;
  });

  useEffect(() => {
    if (user && (user.backendId || user.id)) {
      const targetId = user.backendId || user.id;
      const sync = async () => {
        try {
          const res = await fetch(`/api/students/${targetId}`);
          const data = await res.json();
          if (data && data.points !== undefined) {
            setPoints(data.points);
            localStorage.setItem('bolajon_points', data.points.toString());
          }
        } catch(e) {}
      };
      sync();
      const interval = setInterval(sync, 5000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const saveUser = (userData) => {
    setUser(userData);
    if (userData && userData.points !== undefined) {
      setPoints(userData.points);
      localStorage.setItem('bolajon_points', userData.points.toString());
    }
    localStorage.setItem('bolajon_user', JSON.stringify(userData));
  };

  const addPoints = (amount) => {
    const newPoints = points + amount;
    setPoints(newPoints);
    localStorage.setItem('bolajon_points', newPoints.toString());
  };

  const logout = () => {
    setUser(null);
    setPoints(0);
    localStorage.removeItem('bolajon_user');
    localStorage.removeItem('bolajon_points');
  };

  return {
    user,
    saveUser,
    points,
    addPoints,
    logout
  };
};
