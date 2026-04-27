const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const app = express();
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const DATA_FILE = path.join(__dirname, 'data.json');

// Initialize data.json if missing
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify({ 
    logs: [], 
    resources: [], 
    homeworks: [], 
    teachers: [], 
    events: [],
    directors: [],
    students: [] 
  }, null, 2));
}

function readData() {
  const data = fs.readFileSync(DATA_FILE);
  return JSON.parse(data);
}

function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// --- STUDENT AUTH ---
// Register
app.post('/api/students/register', (req, res) => {
  const data = readData();
  const { username, password, name, viloyat, tuman, dmtt, group } = req.body;
  
  if (data.students.find(s => s.username === username)) {
    return res.status(400).json({ error: 'Bu login band! Boshqasini tanlang.' });
  }

  const newStudent = {
    id: Date.now(),
    username,
    password,
    name,
    viloyat,
    tuman,
    dmtt,
    group,
    points: 0,
    history: [],
    createdAt: new Date().toLocaleString()
  };

  data.students.push(newStudent);
  writeData(data);
  res.status(201).json(newStudent);
});

// Login
app.post('/api/students/login', (req, res) => {
  const data = readData();
  const { username, password } = req.body;
  const student = data.students.find(s => s.username === username && s.password === password);
  
  if (student) {
    res.json(student);
  } else {
    res.status(401).json({ error: 'Login yoki parol noto\'g\'ri!' });
  }
});

// DELETE student
app.delete('/api/students/:id', (req, res) => {
  const data = readData();
  data.students = data.students.filter(s => s.id !== parseInt(req.params.id));
  writeData(data);
  res.json({ success: true });
});

// Update student (points/history)
app.put('/api/students/:id', (req, res) => {
  const data = readData();
  const index = data.students.findIndex(s => s.id === parseInt(req.params.id));
  if (index !== -1) {
    if (req.body.points !== undefined) data.students[index].points = req.body.points;
    if (req.body.historyItem) {
      if (!data.students[index].history) data.students[index].history = [];
      data.students[index].history.push({
        ...req.body.historyItem,
        time: new Date().toLocaleString()
      });
    }
    writeData(data);
    res.json(data.students[index]);
  } else {
    res.status(404).json({ error: 'Topilmadi' });
  }
});

// GET all students
app.get('/api/students', (req, res) => {
  const data = readData();
  res.json(data.students || []);
});

// GET all homeworks
app.get('/api/homeworks', (req, res) => {
  const data = readData();
  res.json(data.homeworks || []);
});

// GET all teachers
app.get('/api/teachers', (req, res) => {
  const data = readData();
  res.json(data.teachers || []);
});

// GET all events
app.get('/api/events', (req, res) => {
  const data = readData();
  res.json(data.events || []);
});

// GET all directors
app.get('/api/directors', (req, res) => {
  const data = readData();
  res.json(data.directors || []);
});

// GET all logs
app.get('/api/logs', (req, res) => {
  const data = readData();
  res.json(data.logs || []);
});

// GET single student
app.get('/api/students/:id', (req, res) => {
  const data = readData();
  const student = data.students.find(s => s.id === parseInt(req.params.id));
  if (student) res.json(student);
  else res.status(404).json({ error: 'Topilmadi' });
});

// GET logs
app.get('/api/logs', (req, res) => {
  const data = readData();
  res.json(data.logs);
});

// GET single log
app.get('/api/logs/:id', (req, res) => {
  const data = readData();
  const log = data.logs.find(l => l.id === parseInt(req.params.id));
  if (log) {
    res.json(log);
  } else {
    res.status(404).json({ error: 'Topilmadi' });
  }
});

// POST new log
app.post('/api/logs', (req, res) => {
  const data = readData();
  const newLog = {
    id: Date.now(),
    name: req.body.name,
    viloyat: req.body.viloyat,
    tuman: req.body.tuman,
    dmtt: req.body.dmtt,
    group: req.body.group || 'Guruhsiz',
    points: req.body.points || 0,
    time: new Date().toLocaleString()
  };
  data.logs.unshift(newLog); // add to top
  writeData(data);
  res.status(201).json(newLog);
});

// UPDATE log points & history
app.put('/api/logs/:id', (req, res) => {
  const data = readData();
  const index = data.logs.findIndex(l => l.id === parseInt(req.params.id));
  if (index !== -1) {
    if (req.body.points !== undefined) {
      data.logs[index].points = req.body.points;
      
      // Track history
      if (!data.logs[index].history) data.logs[index].history = [];
      data.logs[index].history.push({
        amount: req.body.amount || 0,
        reason: req.body.reason || 'Sizga yulduz berildi',
        teacherName: req.body.teacherName || 'Tarbiyachi', // Ismni saqlaymiz
        time: new Date().toLocaleString()
      });
    }
    writeData(data);
    res.json(data.logs[index]);
  } else {
    res.status(404).json({ error: 'Topilmadi' });
  }
});

// DELETE log
app.delete('/api/logs/:id', (req, res) => {
  const data = readData();
  if(data.logs) {
    data.logs = data.logs.filter(l => l.id !== parseInt(req.params.id));
    writeData(data);
  }
  res.json({ success: true });
});

// GET resources
app.get('/api/resources', (req, res) => {
  const data = readData();
  res.json(data.resources);
});

// Upload media file standalone
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Fayl yuklanmadi' });
  }
  const fileUrl = `/uploads/${req.file.filename}`;
  res.json({ url: fileUrl });
});

// POST new resource
app.post('/api/resources', (req, res) => {
  const data = readData();
  const newResource = {
    ...req.body,
    id: Date.now(),
    createdAt: new Date().toLocaleString()
  };
  data.resources.push(newResource);
  writeData(data);
  res.status(201).json(newResource);
});

// DELETE a resource
app.delete('/api/resources/:id', (req, res) => {
  const data = readData();
  data.resources = data.resources.filter(r => r.id !== parseInt(req.params.id));
  writeData(data);
  res.json({ success: true });
});

// UPDATE a resource
app.put('/api/resources/:id', (req, res) => {
  const data = readData();
  const index = data.resources.findIndex(r => r.id === parseInt(req.params.id));
  if (index !== -1) {
    data.resources[index] = { ...data.resources[index], ...req.body };
    writeData(data);
    res.json(data.resources[index]);
  } else {
    res.status(404).json({ error: 'Topilmadi' });
  }
});

// POST new homework submission
app.post('/api/homeworks', (req, res) => {
  const data = readData();
  if (!data.homeworks) data.homeworks = [];
  const newHomework = {
    id: Date.now(),
    studentName: req.body.studentName,
    viloyat: req.body.viloyat,
    tuman: req.body.tuman,
    dmtt: req.body.dmtt,
    group: req.body.group,
    month: req.body.month,
    theme: req.body.theme,
    center: req.body.center,
    fileUrl: req.body.fileUrl,
    time: new Date().toLocaleString()
  };
  data.homeworks.unshift(newHomework);
  writeData(data);
  res.status(201).json(newHomework);
});

// DELETE a homework
app.delete('/api/homeworks/:id', (req, res) => {
  const data = readData();
  if(data.homeworks) {
    data.homeworks = data.homeworks.filter(h => h.id !== parseInt(req.params.id));
    writeData(data);
  }
  res.json({ success: true });
});

// POST new event
app.post('/api/events', (req, res) => {
  const data = readData();
  if(!data.events) data.events = [];
  const newEvent = { ...req.body, id: Date.now(), createdAt: new Date().toLocaleString() };
  data.events.unshift(newEvent);
  writeData(data);
  res.status(201).json(newEvent);
});

// DELETE an event
app.delete('/api/events/:id', (req, res) => {
  const data = readData();
  if(data.events) {
    data.events = data.events.filter(e => e.id !== parseInt(req.params.id));
    writeData(data);
  }
  res.json({ success: true });
});

// POST new teacher
app.post('/api/teachers', (req, res) => {
  const data = readData();
  const newTeacher = { ...req.body, id: Date.now() };
  data.teachers = data.teachers || [];
  data.teachers.push(newTeacher);
  writeData(data);
  res.status(201).json(newTeacher);
});

// DELETE teacher
app.delete('/api/teachers/:id', (req, res) => {
  const data = readData();
  data.teachers = data.teachers.filter(t => t.id !== parseInt(req.params.id));
  writeData(data);
  res.json({ success: true });
});

const PORT = process.env.PORT || 5000;

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../dist')));

// DIRECTORS POST/DELETE
app.post('/api/directors', (req, res) => {
  const data = readData();
  console.log("Adding director:", req.body);
  const newDirector = { ...req.body, id: Date.now() };
  data.directors = data.directors || [];
  data.directors.push(newDirector);
  writeData(data);
  res.status(201).json(newDirector);
});

app.delete('/api/directors/:id', (req, res) => {
  const data = readData();
  data.directors = data.directors.filter(d => d.id !== parseInt(req.params.id));
  writeData(data);
  res.json({ success: true });
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
