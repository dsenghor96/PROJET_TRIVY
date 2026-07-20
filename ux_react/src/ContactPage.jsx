import { Mail, MapPin, Code2, Network, Heart } from 'lucide-react';

export default function ContactPage() {
  return (
    <section className="contact-page">
      <div className="section-heading">
        <span className="section-kicker">Restons en contact</span>
        <h2>Contactez-moi</h2>
        <p className="section-description">Intéressé·e par mon profil ? N'hésitez pas à me contacter pour discuter d'opportunités de stage ou d'alternance.</p>
      </div>

      <div className="contact-content">
        <div className="contact-info-card">
          <h3>Informations de contact</h3>
          <div className="contact-details">
            <a href="mailto:contact@dieynaba-senghor.com" className="contact-detail-item">
              <Mail size={24} />
              <div>
                <strong>Email</strong>
                <span>contact@dieynaba-senghor.com</span>
              </div>
            </a>
            <div className="contact-detail-item">
              <MapPin size={24} />
              <div>
                <strong>Localisation</strong>
                <span>Dakar, Sénégal</span>
              </div>
            </div>
          </div>

          <div className="contact-social">
            <h4>Réseaux sociaux</h4>
            <div className="social-links-grid">
              <a href="https://github.com/dieynaba-senghor" target="_blank" rel="noopener noreferrer" className="social-link-card">
                <Code2 size={24} />
                <span>GitHub</span>
              </a>
              <a href="https://linkedin.com/in/dieynaba-senghor" target="_blank" rel="noopener noreferrer" className="social-link-card">
                <Network size={24} />
                <span>LinkedIn</span>
              </a>
            </div>
          </div>
        </div>

        <div className="contact-cta-card">
          <h3>Opportunités recherchées</h3>
          <p>Je suis actuellement à la recherche d'une opportunité en <strong>stage</strong> ou en <strong>alternance</strong> dans le domaine du Cloud AWS et du DevOps.</p>
          <ul className="contact-interests">
            <li>Infrastructure Cloud (AWS)</li>
            <li>CI/CD et automatisation</li>
            <li>Administration système Linux</li>
            <li>Conteneurisation Docker</li>
          </ul>
          <a href="mailto:contact@dieynaba-senghor.com" className="contact-cta-btn">
            <Mail size={20} />
            M'envoyer un email
          </a>
        </div>
      </div>
    </section>
  );
}
