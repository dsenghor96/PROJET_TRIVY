import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, LogOut, Save, X, Code2, ArrowUpRight, Upload, FileText, CheckCircle } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

const categories = [
  'Cloud et DevOps',
  'Réseaux',
  'Systèmes & Linux',
  'Développement web'
];

export default function AdminDashboard({ onLogout }) {
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [cvExists, setCvExists] = useState(false);
  const [cvUrl, setCvUrl] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    impact: '',
    stack: '',
    githubUrl: '',
    category: 'Cloud et DevOps'
  });

  useEffect(() => {
    loadProjects();
    checkCv();
  }, []);

  async function loadProjects() {
    try {
      const response = await fetch(`${API_BASE}/projects`);
      if (response.ok) {
        const sections = await response.json();
        const allProjects = sections.flatMap(section =>
          section.projects.map(project => ({
            ...project,
            category: section.category
          }))
        );
        setProjects(allProjects);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des projets:', error);
    }
  }

  async function checkCv() {
    try {
      const response = await fetch(`${API_BASE}/cv/check`);
      if (response.ok) {
        const data = await response.json();
        setCvExists(data.exists);
        setCvUrl(data.url);
      }
    } catch (error) {
      console.error('Erreur lors de la vérification du CV:', error);
    }
  }

  async function handleCvUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setUploadStatus('Seuls les fichiers PDF sont acceptés.');
      return;
    }

    const formData = new FormData();
    formData.append('cv', file);

    try {
      setUploadStatus('Téléchargement en cours...');
      const response = await fetch(`${API_BASE}/cv/upload`, {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        setUploadStatus('CV téléchargé avec succès !');
        checkCv();
        setTimeout(() => setUploadStatus(''), 3000);
      } else {
        setUploadStatus('Erreur lors du téléchargement.');
      }
    } catch (error) {
      setUploadStatus('Erreur lors du téléchargement.');
      console.error('Erreur upload CV:', error);
    }
  }

  async function handleCvDelete() {
    if (!confirm('Supprimer le CV ?')) return;

    try {
      const response = await fetch(`${API_BASE}/cv`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setUploadStatus('CV supprimé avec succès.');
        checkCv();
        setTimeout(() => setUploadStatus(''), 3000);
      }
    } catch (error) {
      console.error('Erreur suppression CV:', error);
    }
  }

  function handleEdit(project) {
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      impact: project.impact,
      stack: project.stack?.join(', ') || '',
      githubUrl: project.githubUrl || '',
      category: project.category
    });
    setShowForm(true);
  }

  async function handleDelete(project) {
    if (!confirm(`Supprimer le projet "${project.title}" ?`)) return;

    try {
      const response = await fetch(`${API_BASE}/projects/${project._id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        loadProjects();
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const payload = {
      ...formData,
      stack: formData.stack.split(',').map(s => s.trim()).filter(Boolean),
      imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1400'
    };

    try {
      const url = editingProject
        ? `${API_BASE}/projects/${editingProject._id}`
        : `${API_BASE}/projects`;

      const response = await fetch(url, {
        method: editingProject ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        loadProjects();
        handleCancel();
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  }

  function handleCancel() {
    setShowForm(false);
    setEditingProject(null);
    setFormData({
      title: '',
      description: '',
      impact: '',
      stack: '',
      githubUrl: '',
      category: 'Cloud et DevOps'
    });
  }

  function handleLogout() {
    localStorage.removeItem('adminAuth');
    onLogout();
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <div>
          <h1>Dashboard Admin</h1>
          <p>Gestion des projets et du CV</p>
        </div>
        <div className="admin-header-actions">
          <button className="admin-btn admin-btn-primary" onClick={() => setShowForm(true)}>
            <Plus size={18} />
            Ajouter un projet
          </button>
          <button className="admin-btn admin-btn-ghost" onClick={handleLogout}>
            <LogOut size={18} />
            Se déconnecter
          </button>
        </div>
      </div>

      <div className="admin-cv-section">
        <div className="admin-cv-card">
          <div className="admin-cv-header">
            <FileText size={28} />
            <div>
              <h3>Curriculum Vitae</h3>
              <p>Gérez votre CV téléchargeable depuis la page d'accueil</p>
            </div>
          </div>

          {uploadStatus && (
            <div className={`admin-cv-status ${uploadStatus.includes('succès') ? 'success' : 'error'}`}>
              {uploadStatus.includes('succès') && <CheckCircle size={18} />}
              {uploadStatus}
            </div>
          )}

          <div className="admin-cv-actions">
            {cvExists ? (
              <>
                <a href={cvUrl} target="_blank" rel="noopener noreferrer" className="admin-btn admin-btn-view">
                  <FileText size={18} />
                  Voir le CV actuel
                </a>
                <label className="admin-btn admin-btn-primary">
                  <Upload size={18} />
                  Remplacer le CV
                  <input type="file" accept=".pdf" onChange={handleCvUpload} style={{ display: 'none' }} />
                </label>
                <button className="admin-btn admin-btn-delete" onClick={handleCvDelete}>
                  <Trash2 size={18} />
                  Supprimer
                </button>
              </>
            ) : (
              <label className="admin-btn admin-btn-primary">
                <Upload size={18} />
                Télécharger un CV (PDF)
                <input type="file" accept=".pdf" onChange={handleCvUpload} style={{ display: 'none' }} />
              </label>
            )}
          </div>
        </div>
      </div>

      {showForm && (
        <div className="admin-modal-overlay" onClick={handleCancel}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2>{editingProject ? 'Modifier le projet' : 'Ajouter un projet'}</h2>
              <button className="admin-close-btn" onClick={handleCancel}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="admin-form">
              <label>
                <span>Titre du projet *</span>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ex: Pipeline CI/CD avec Jenkins"
                  required
                />
              </label>

              <label>
                <span>Description longue *</span>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Décrivez le projet en détail"
                  rows="4"
                  required
                />
              </label>

              <label>
                <span>Ce que j'ai fait *</span>
                <textarea
                  value={formData.impact}
                  onChange={(e) => setFormData({ ...formData, impact: e.target.value })}
                  placeholder="Expliquez votre contribution et l'impact du projet"
                  rows="3"
                  required
                />
              </label>

              <label>
                <span>Technologies utilisées</span>
                <input
                  type="text"
                  value={formData.stack}
                  onChange={(e) => setFormData({ ...formData, stack: e.target.value })}
                  placeholder="AWS, Docker, Jenkins (séparées par des virgules)"
                />
              </label>

              <label>
                <span>Lien GitHub</span>
                <input
                  type="url"
                  value={formData.githubUrl}
                  onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                  placeholder="https://github.com/..."
                />
              </label>

              <label>
                <span>Domaine *</span>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </label>

              <div className="admin-form-actions">
                <button type="submit" className="admin-btn admin-btn-primary">
                  <Save size={18} />
                  {editingProject ? 'Enregistrer' : 'Ajouter'}
                </button>
                <button type="button" className="admin-btn admin-btn-ghost" onClick={handleCancel}>
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="admin-projects-list">
        {projects.length === 0 ? (
          <div className="admin-empty">
            <p>Aucun projet pour le moment</p>
          </div>
        ) : (
          <div className="admin-projects-grid">
            {projects.map(project => (
              <div key={project._id} className="admin-project-card">
                <div className="admin-project-header">
                  <div>
                    <h3>{project.title}</h3>
                    <span className="admin-project-category">{project.category}</span>
                  </div>
                </div>
                <p className="admin-project-desc">{project.description}</p>
                <div className="admin-project-tags">
                  {project.stack?.slice(0, 3).map(tag => (
                    <span key={tag} className="admin-tag">{tag}</span>
                  ))}
                </div>
                <div className="admin-project-actions">
                  <button className="admin-btn-icon admin-btn-edit" onClick={() => handleEdit(project)}>
                    <Edit2 size={16} />
                    Modifier
                  </button>
                  <button className="admin-btn-icon admin-btn-delete" onClick={() => handleDelete(project)}>
                    <Trash2 size={16} />
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
