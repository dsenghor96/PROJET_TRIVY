import { useState, useEffect } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { Mail, MapPin, Code2, Network, Heart } from 'lucide-react';

export default function Layout() {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <main className="page-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <nav className={`topbar ${scrolled ? 'scrolled' : ''}`} aria-label="Navigation principale">
        <Link to="/" className="brand" aria-label="Accueil">
          <img src="/logo-full.png" alt="Dieynaba Senghor - Cloud & DevOps Engineer" className="logo-image-full" />
        </Link>
        <div className="nav-links">
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Accueil</Link>
          <Link to="/projects" className={location.pathname === '/projects' ? 'active' : ''}>Projets</Link>
          <Link to="/skills" className={location.pathname === '/skills' ? 'active' : ''}>Compétences</Link>
          <Link to="/contact" className={location.pathname === '/contact' ? 'active' : ''}>Contact</Link>
        </div>
      </nav>

      <Outlet />

      <footer className="footer" id="contact">
        <div className="footer-container">
          <div className="footer-content">
            <div className="footer-brand">
              <div className="footer-logo">
                <img src="/logo-full.png" alt="Dieynaba Senghor - Cloud & DevOps Engineer" className="logo-image-footer-full" />
              </div>
            </div>

            <div className="footer-links">
              <div className="footer-section">
                <h4>Navigation</h4>
                <nav className="footer-nav">
                  <Link to="/">Accueil</Link>
                  <Link to="/projects">Projets</Link>
                  <Link to="/skills">Compétences</Link>
                  <Link to="/contact">Contact</Link>
                </nav>
              </div>

              <div className="footer-section">
                <h4>Contact</h4>
                <div className="footer-contact">
                  <a href="mailto:contact@dieynaba-senghor.com" className="contact-item">
                    <Mail size={18} />
                    <span>contact@dieynaba-senghor.com</span>
                  </a>
                  <div className="contact-item">
                    <MapPin size={18} />
                    <span>Dakar, Sénégal</span>
                  </div>
                </div>
              </div>

              <div className="footer-section">
                <h4>Réseaux sociaux</h4>
                <div className="footer-social">
                  <a href="https://github.com/dieynaba-senghor" target="_blank" rel="noopener noreferrer" className="social-link">
                    <Code2 size={20} />
                    <span>GitHub</span>
                  </a>
                  <a href="https://linkedin.com/in/dieynaba-senghor" target="_blank" rel="noopener noreferrer" className="social-link">
                    <Network size={20} />
                    <span>LinkedIn</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <div className="footer-divider"></div>
            <div className="footer-credits">
              <p>© 2026 Dieynaba Senghor. Tous droits réservés.</p>
              <p className="footer-made">
                Conçu avec <Heart size={14} /> et React
              </p>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
