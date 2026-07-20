import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, Cloud, Code2, Database, Download, Network, Server, ShieldCheck } from 'lucide-react';
import Globe3D from './Globe3D';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

export default function HomePage({ profile }) {
  const navigate = useNavigate();
  const [cvUrl, setCvUrl] = useState(null);

  useEffect(() => {
    async function checkCv() {
      try {
        const response = await fetch(`${API_BASE}/cv/check`);
        if (response.ok) {
          const data = await response.json();
          if (data.exists) {
            setCvUrl(data.url);
          }
        }
      } catch (error) {
        console.error('Erreur vérification CV:', error);
      }
    }

    checkCv();
  }, []);

  const displayProfile = profile || {
    name: 'Dieynaba Senghor',
    title: 'Future Cloud & DevOps Engineer',
    location: 'Dakar, Sénégal',
    summary: 'Diplômée en réseaux informatiques, je développe des projets autour du Cloud, du DevOps et de l\'automatisation. J\'aime concevoir des infrastructures fiables, optimiser les déploiements et relier mes bases réseaux/systèmes aux pratiques cloud modernes.'
  };

  return (
    <section className="hero" id="home">
      <div className="hero-content">
        <div className="hero-copy">
          <div className="eyebrow">
            <span>✦</span>
            <span>Disponible pour un stage</span>
          </div>
          <h1>{displayProfile.name}</h1>
          <p className="title">{displayProfile.title}</p>
          <p className="summary">
            Diplômée en réseaux informatiques, je développe des projets autour du Cloud, du DevOps et de l'automatisation.
            <br /><br />
            J'aime concevoir des infrastructures fiables, optimiser les déploiements et relier mes bases réseaux/systèmes aux pratiques cloud modernes.
            <br /><br />
            Je recherche une opportunité en stage ou en alternance pour contribuer à des projets concrets dans un environnement Cloud AWS ou DevOps, où je pourrai mettre en pratique mes compétences et continuer à apprendre auprès d'équipes expérimentées.
          </p>

          <div className="hero-tech-badges">
            <div className="tech-badge">
              <Cloud size={18} />
              <span>AWS</span>
            </div>
            <div className="tech-badge">
              <Server size={18} />
              <span>Docker</span>
            </div>
            <div className="tech-badge">
              <Code2 size={18} />
              <span>Jenkins</span>
            </div>
            <div className="tech-badge">
              <Database size={18} />
              <span>Linux</span>
            </div>
            <div className="tech-badge">
              <Network size={18} />
              <span>CI/CD</span>
            </div>
            <div className="tech-badge">
              <ShieldCheck size={18} />
              <span>Terraform</span>
            </div>
          </div>

          <div className="hero-actions">
            <button className="primary-button" onClick={() => navigate('/projects')}>
              Voir les projets
              <ArrowUpRight size={20} />
            </button>
            {cvUrl ? (
              <a className="ghost-button" href={cvUrl} download="CV_Dieynaba_Senghor.pdf">
                <Download size={20} />
                Télécharger le CV
              </a>
            ) : (
              <button className="ghost-button" disabled style={{ opacity: 0.5, cursor: 'not-allowed' }}>
                <Download size={20} />
                CV non disponible
              </button>
            )}
          </div>
        </div>

        <div className="hero-visual">
          <Globe3D />
        </div>
      </div>
    </section>
  );
}
