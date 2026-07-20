import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ScrollToTop from './ScrollToTop';
import Layout from './Layout';
import HomePage from './HomePage';
import ProjectsPage from './ProjectsPage';
import SkillsPage from './SkillsPage';
import ContactPage from './ContactPage';
import AdminLogin from './AdminLogin';
import AdminPage from './AdminPage';
import './styles.css';
import './App.css';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

export default function App() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await fetch(`${API_BASE}/profile`);
        if (response.ok) {
          const data = await response.json();
          setProfile(data);
        }
      } catch (error) {
        console.error('Erreur chargement profil:', error);
      }
    }
    fetchProfile();
  }, []);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage profile={profile} />} />
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="skills" element={<SkillsPage />} />
          <Route path="contact" element={<ContactPage />} />
        </Route>
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </BrowserRouter>
  );
}
