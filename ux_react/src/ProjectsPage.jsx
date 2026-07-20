import { useState, useEffect } from 'react';
import { Award, Code2, ArrowUpRight, ShieldCheck, Cloud, Network, Server, BookOpen, X } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

const categoryIcons = {
  'Cloud et DevOps': Cloud,
  'Réseaux': Network,
  'Systèmes': Server,
  'Développement web': Code2
};

export default function ProjectsPage() {
  const [projectSections, setProjectSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    async function loadProjects() {
      try {
        const response = await fetch(`${API_BASE}/projects`);
        if (!response.ok) {
          throw new Error('Erreur de chargement des projets');
        }
        setProjectSections(await response.json());
      } catch (error) {
        console.error('Erreur chargement:', error);
      } finally {
        setLoading(false);
      }
    }

    loadProjects();
  }, []);

  if (loading) {
    return <div className="loading">Chargement des projets...</div>;
  }

  return (
    <>
      <section className="project-showcase cloud-devops-section" id="projects">
        <div className="section-heading">
          <span className="section-kicker">Projets principaux</span>
          <h2>Cloud, DevOps & Infrastructure</h2>
          <p className="section-description">Mes projets en automatisation, infrastructure AWS et CI/CD — le cœur de mon expertise technique.</p>
        </div>

        <div className="section-list">
          {projectSections.filter(section => section.category === 'Cloud et DevOps').map((section) => {
            const Icon = categoryIcons[section.category] || Award;
            return (
              <section className="domain-section featured-domain" key={section.category}>
                <div className="domain-heading">
                  <div className="domain-title">
                    <span className="domain-icon"><Icon size={22} /></span>
                    <div>
                      <span>Spécialisation principale</span>
                      <h3>{section.category}</h3>
                    </div>
                  </div>
                  <p>{section.intro}</p>
                </div>

                <div className="project-grid">
                  {section.projects?.map((project) => (
                    <article className="project-card" key={project._id}>
                      <div className="project-image-wrap">
                        <img className="project-image" src={project.imageUrl} alt={project.title} />
                        <span className="project-category">{section.category}</span>
                      </div>
                      <div className="project-body">
                        <h4>{project.title}</h4>
                        <p className="project-description">{project.description}</p>
                        <div className="tag-row">
                          {project.stack?.map((tag) => (
                            <span key={tag}>{tag}</span>
                          ))}
                        </div>
                        <div className="impact-line">
                          <ShieldCheck size={17} />
                          {project.impact}
                        </div>
                        <div className="project-actions">
                          <button
                            className="project-action-btn detail-btn"
                            onClick={() => setSelectedProject({ ...project, category: section.category })}
                          >
                            <Award size={18} />
                            Détails
                          </button>
                          {project.githubUrl && (
                            <a
                              className="project-action-btn github-btn"
                              href={project.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Code2 size={18} />
                              GitHub
                            </a>
                          )}
                          {project.demoUrl && (
                            <a
                              className="project-action-btn demo-btn"
                              href={project.demoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <ArrowUpRight size={18} />
                              Demo
                            </a>
                          )}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </section>

      <section className="project-showcase secondary-projects">
        <div className="section-heading">
          <span className="section-kicker">Projets complémentaires</span>
          <h2>Autres projets techniques</h2>
          <p className="section-description">Réseaux, administration système et développement full-stack — ma polyvalence technique.</p>
        </div>

        <div className="section-list">
          {projectSections.filter(section => section.category !== 'Cloud et DevOps').map((section) => {
            const Icon = categoryIcons[section.category] || Award;
            const categoryLabels = {
              'Réseaux': 'Infrastructure',
              'Systèmes': 'Systèmes & Linux',
              'Développement web': 'Full-stack'
            };
            return (
              <section className="domain-section" key={section.category}>
                <div className="domain-heading">
                  <div className="domain-title">
                    <span className="domain-icon"><Icon size={22} /></span>
                    <div>
                      <span>{categoryLabels[section.category] || 'Projets'}</span>
                      <h3>{section.category}</h3>
                    </div>
                  </div>
                  <p>{section.intro}</p>
                </div>

                <div className="project-grid">
                  {section.projects?.map((project) => (
                    <article className="project-card" key={project._id}>
                      <div className="project-image-wrap">
                        <img className="project-image" src={project.imageUrl} alt={project.title} />
                        <span className="project-category">{section.category}</span>
                      </div>
                      <div className="project-body">
                        <h4>{project.title}</h4>
                        <p className="project-description">{project.description}</p>
                        <div className="tag-row">
                          {project.stack?.map((tag) => (
                            <span key={tag}>{tag}</span>
                          ))}
                        </div>
                        <div className="impact-line">
                          <ShieldCheck size={17} />
                          {project.impact}
                        </div>
                        <div className="project-actions">
                          <button
                            className="project-action-btn detail-btn"
                            onClick={() => setSelectedProject({ ...project, category: section.category })}
                          >
                            <Award size={18} />
                            Détails
                          </button>
                          {project.githubUrl && (
                            <a
                              className="project-action-btn github-btn"
                              href={project.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Code2 size={18} />
                              GitHub
                            </a>
                          )}
                          {project.demoUrl && (
                            <a
                              className="project-action-btn demo-btn"
                              href={project.demoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <ArrowUpRight size={18} />
                              Demo
                            </a>
                          )}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </section>

      {selectedProject && (
        <div className="project-modal-overlay" onClick={() => setSelectedProject(null)}>
          <div className="project-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedProject(null)} aria-label="Fermer">
              <X size={24} />
            </button>

            <div className="modal-image-container">
              <img src={selectedProject.imageUrl} alt={selectedProject.title} className="modal-image" />
              <span className="modal-category-badge">{selectedProject.category}</span>
            </div>

            <div className="modal-content">
              <h2 className="modal-title">{selectedProject.title}</h2>

              <div className="modal-section">
                <h3 className="modal-section-title">
                  <BookOpen size={20} />
                  Description
                </h3>
                <p className="modal-description">{selectedProject.description}</p>
              </div>

              <div className="modal-section">
                <h3 className="modal-section-title">
                  <ShieldCheck size={20} />
                  Ce que j'ai fait concrètement
                </h3>
                <p className="modal-impact">{selectedProject.impact}</p>
              </div>

              {selectedProject.stack && selectedProject.stack.length > 0 && (
                <div className="modal-section">
                  <h3 className="modal-section-title">
                    <Code2 size={20} />
                    Technologies utilisées
                  </h3>
                  <div className="modal-tags">
                    {selectedProject.stack.map((tech) => (
                      <span key={tech} className="modal-tag">{tech}</span>
                    ))}
                  </div>
                </div>
              )}

              {selectedProject.githubUrl && (
                <div className="modal-section">
                  <a
                    className="modal-github-btn"
                    href={selectedProject.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Code2 size={20} />
                    Voir le code sur GitHub
                    <ArrowUpRight size={18} />
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
