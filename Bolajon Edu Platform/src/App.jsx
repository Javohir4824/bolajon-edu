import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Gateway from './pages/Gateway';
import TeacherPanel from './pages/TeacherPanel';
import DirectorPanel from './pages/DirectorPanel';
import SuperAdminPanel from './pages/SuperAdminPanel';
import LocationSelection from './pages/LocationSelection';
import Dashboard from './pages/Dashboard';
import MonthLessons from './pages/MonthLessons';
import LessonView from './pages/LessonView';
import Events from './pages/Events';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Gateway />} />
      <Route path="/student" element={<Landing />} />
      <Route path="/teacher" element={<TeacherPanel />} />
      <Route path="/director" element={<DirectorPanel />} />
      <Route path="/superadmin" element={<SuperAdminPanel />} />
      <Route path="/location" element={<LocationSelection />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/events" element={<Events />} />
      <Route path="/month/:id" element={<MonthLessons />} />
      <Route path="/month/:id/lesson/:lessonId" element={<LessonView />} />
      <Route path="/login" element={<Gateway />} />
    </Routes>
  );
}

export default App;
