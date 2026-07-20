import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 21019;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://127.0.0.1:5173';
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/portfolio_perso';

const categoryOrder = ['Cloud et DevOps', 'Réseaux', 'Systèmes', 'Développement web'];

app.use(cors({ origin: CLIENT_ORIGIN }));
app.use(express.json({ limit: '8mb' }));

// Configuration pour servir les fichiers statiques (CV)
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// Configuration Multer pour l'upload du CV
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    cb(null, 'cv_dieynaba_senghor.pdf');
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Seuls les fichiers PDF sont acceptés.'));
    }
  }
});

const defaultProfile = {
  name: 'Dieynaba Senghor',
  initials: 'DS',
  title: 'Future Cloud & DevOps Engineer',
  location: 'Dakar, Sénégal',
  summary:
    'Diplômée en réseaux informatiques, je développe des projets autour du Cloud, du DevOps et de l\'automatisation. J\'aime concevoir des infrastructures fiables, optimiser les déploiements et relier mes bases réseaux/systèmes aux pratiques cloud modernes.',
  education: [
    { period: '2025 – 2026', title: 'Formation Cloud AWS DevOps', institution: 'Orange Digital Center' },
    { period: '2022 – 2025', title: 'Licence professionnelle en Réseaux informatiques', institution: 'ISI Dakar' }
  ],
  highlights: ['AWS', 'Docker', 'Jenkins', 'Linux', 'CI/CD', 'Terraform']
};

const seedProjects = [
  {
    category: 'Cloud et DevOps',
    title: 'Infrastructure AWS sécurisée',
    description:
      'Conception d\'une architecture VPC complète avec segmentation réseau et contrôles d\'accès pour garantir la sécurité des ressources cloud.',
    stack: ['AWS', 'VPC', 'IAM', 'Security Groups'],
    impact: 'Conception d\'une architecture VPC avec sous-réseaux publics et privés, configuration des groupes de sécurité, mise en place des services applicatifs et définition des règles d\'accès IAM.',
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1400',
    githubUrl: '',
    demoUrl: ''
  },
  {
    category: 'Cloud et DevOps',
    title: 'Pipeline CI/CD pour application web',
    description:
      'Mise en place d\'un pipeline complet d\'intégration et de déploiement continu pour automatiser la livraison d\'applications.',
    stack: ['Jenkins', 'Docker', 'Git', 'CI/CD'],
    impact: 'Mise en place d\'un pipeline automatisé de build, test et déploiement avec Git comme déclencheur, intégration de Docker pour la conteneurisation et configuration des étapes de livraison continue.',
    imageUrl: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&q=80&w=1400',
    githubUrl: '',
    demoUrl: ''
  },
  {
    category: 'Cloud et DevOps',
    title: 'Monitoring et supervision applicative',
    description:
      'Mise en place d\'une solution de monitoring complète avec alertes et tableaux de bord pour suivre la santé des applications.',
    stack: ['AWS CloudWatch', 'Alerting', 'Logs'],
    impact: 'Configuration du suivi des performances et de la disponibilité, mise en place de la collecte de journaux et création d\'alertes pour détecter les incidents en temps réel.',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1400',
    githubUrl: '',
    demoUrl: ''
  },
  {
    category: 'Cloud et DevOps',
    title: 'Backup automatisé PME vers AWS S3',
    description:
      'Conception d\'un système de sauvegarde automatisé et chiffré vers AWS S3 dans le cadre d\'une simulation PME.',
    stack: ['AWS', 'S3', 'IAM', 'Encryption', 'Automation'],
    impact: 'Conception d\'un système de sauvegarde automatisé avec chiffrement des données, configuration des politiques IAM pour sécuriser l\'accès au bucket S3 et automatisation complète du processus de sauvegarde.',
    imageUrl: 'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?auto=format&fit=crop&q=80&w=1400',
    githubUrl: '',
    demoUrl: ''
  },
  {
    category: 'Cloud et DevOps',
    title: 'Conteneurisation du portfolio avec Docker',
    description:
      'Containerisation complète du portfolio MERN afin de garantir un environnement reproductible et faciliter le déploiement.',
    stack: ['Docker', 'Docker Compose', 'MongoDB', 'React', 'Express'],
    impact: 'Conteneurisation complète du portfolio MERN avec création des Dockerfiles pour le frontend React et le backend Express, orchestration via docker-compose avec trois services (mongodb, backend, frontend) sur un réseau bridge personnalisé.',
    imageUrl: 'https://images.unsplash.com/photo-1605745341112-85968b19335b?auto=format&fit=crop&q=80&w=1400',
    githubUrl: 'https://github.com/dsenghor96/PROJET_DOCKER',
    demoUrl: ''
  },
  {
    category: 'Cloud et DevOps',
    title: 'Site e-commerce statique haute performance',
    description:
      'Architecture serverless optimisée pour les performances et les faibles coûts avec distribution mondiale.',
    stack: ['AWS S3', 'CloudFront', 'Serverless'],
    impact: 'Mise en place d\'une architecture serverless avec hébergement des fichiers statiques sur AWS S3, configuration de CloudFront comme CDN pour la distribution mondiale et optimisation du cache pour réduire les temps de chargement.',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1400',
    githubUrl: '',
    demoUrl: ''
  },
  {
    category: 'Cloud et DevOps',
    title: 'Pipeline CI/CD Jenkins',
    description:
      'Automatisation du build, des tests et du déploiement avec Jenkins et Docker.',
    stack: ['Jenkins', 'Docker', 'Git', 'CI/CD'],
    impact: 'Configuration de Jenkins pour automatiser le build, les tests et le déploiement, intégration avec Git pour déclencher le pipeline à chaque push et utilisation de Docker pour garantir des environnements reproductibles.',
    imageUrl: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?auto=format&fit=crop&q=80&w=1400',
    githubUrl: '',
    demoUrl: ''
  },
  {
    category: 'Cloud et DevOps',
    title: 'Monitoring CloudWatch',
    description:
      'Mise en place d\'un monitoring avec alertes temps réel sur AWS CloudWatch.',
    stack: ['AWS CloudWatch', 'Alerting', 'Notifications'],
    impact: 'Mise en place de tableaux de bord CloudWatch pour surveiller les métriques AWS, configuration d\'alarmes pour détecter les anomalies et mise en place de notifications automatiques en cas d\'incident.',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1400',
    githubUrl: '',
    demoUrl: ''
  },
  {
    category: 'Cloud et DevOps',
    title: 'Infrastructure as Code',
    description:
      'Provisionnement automatisé d\'infrastructures AWS avec CloudFormation.',
    stack: ['CloudFormation', 'AWS', 'IaC'],
    impact: 'Écriture de templates CloudFormation pour provisionner automatiquement les ressources AWS, versionnement de l\'infrastructure dans Git et déploiement reproductible en quelques minutes.',
    imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=1400',
    githubUrl: '',
    demoUrl: ''
  },
  {
    category: 'Réseaux',
    title: 'Segmentation réseau avec VLAN',
    description:
      'Conception d\'une architecture réseau segmentée avec VLAN et plan d\'adressage IP afin d\'améliorer l\'organisation et la sécurité réseau.',
    stack: ['VLAN', 'Switching', 'Subnetting'],
    impact: 'Réseau structuré avec meilleure sécurité et administration simplifiée.',
    imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=1400',
    githubUrl: '',
    demoUrl: ''
  },
  {
    category: 'Réseaux',
    title: 'Routage inter-VLAN et ACL',
    description:
      'Mise en place du routage inter-VLAN avec règles ACL afin de contrôler les communications entre différents segments réseau.',
    stack: ['Routing', 'ACL', 'Cisco'],
    impact: 'Contrôle des accès avec communication sécurisée et isolation des services.',
    imageUrl: 'https://images.unsplash.com/photo-1683322499436-f4383dd59f5a?auto=format&fit=crop&q=80&w=1400',
    githubUrl: '',
    demoUrl: ''
  },
  {
    category: 'Systèmes',
    title: 'Administration système Linux',
    description:
      'Administration d\'environnements Linux avec gestion des utilisateurs, permissions, services système et automatisation Bash.',
    stack: ['Linux', 'Bash', 'System Administration'],
    impact: 'Administration système avec automatisation des tâches et gestion sécurisée des services.',
    imageUrl: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&q=80&w=1400',
    githubUrl: '',
    demoUrl: ''
  },
  {
    category: 'Systèmes',
    title: 'Sauvegarde automatisée sous Linux',
    description:
      'Création de scripts Bash automatisant les sauvegardes système et la planification des tâches via Cron.',
    stack: ['Linux', 'Bash', 'Cron'],
    impact: 'Automatisation système avec réduction des tâches manuelles et fiabilité des sauvegardes.',
    imageUrl: 'https://images.unsplash.com/photo-1597852074816-d933c7d2b988?auto=format&fit=crop&q=80&w=1400',
    githubUrl: '',
    demoUrl: ''
  },
  {
    category: 'Développement web',
    title: 'Portfolio MERN Full Stack',
    description:
      'Développement d\'un portfolio full stack moderne avec frontend React, backend Express et base de données MongoDB. Création d\'une interface responsive et dynamique mettant en valeur des projets techniques.',
    stack: ['React', 'Node.js', 'Express', 'MongoDB', 'Tailwind CSS'],
    impact: 'Architecture full stack avec interface moderne et gestion dynamique des données.',
    imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=1400',
    githubUrl: '',
    demoUrl: ''
  },
  {
    category: 'Développement web',
    title: 'API REST de gestion de contenus',
    description:
      'Développement d\'une API REST permettant la gestion de contenus avec opérations CRUD et structuration des routes backend.',
    stack: ['Node.js', 'Express', 'MongoDB'],
    impact: 'Architecture backend claire avec API scalable et gestion de données MongoDB.',
    imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1400',
    githubUrl: '',
    demoUrl: ''
  },
  {
    category: 'Développement web',
    title: 'Interfaces web responsives',
    description:
      'Création d\'interfaces web modernes, responsives et optimisées pour différents écrans avec Tailwind CSS et JavaScript.',
    stack: ['HTML', 'CSS', 'Tailwind CSS', 'JavaScript'],
    impact: 'Responsive design avec expérience utilisateur améliorée et frontend moderne.',
    imageUrl: 'https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&q=80&w=1400',
    githubUrl: '',
    demoUrl: ''
  }
];

const sectionIntros = {
  'Cloud et DevOps': 'Automatisation, infrastructure AWS, CI/CD et monitoring pour des environnements fiables et scalables.',
  'Réseaux': 'Architecture réseau avec VLAN, routage et contrôle d\'accès pour une infrastructure sécurisée.',
  'Systèmes': 'Administration Linux et automatisation pour une gestion efficace des environnements de production.',
  'Développement web': 'Applications full-stack modernes avec React, Node.js et bases de données pour des solutions complètes.'
};

const profileSchema = new mongoose.Schema(
  {
    name: String,
    initials: String,
    title: String,
    location: String,
    summary: String,
    education: [{ period: String, title: String, institution: String }],
    highlights: [String]
  },
  { timestamps: true }
);

const projectSchema = new mongoose.Schema(
  {
    category: { type: String, required: true, enum: categoryOrder },
    title: { type: String, required: true, trim: true, unique: true },
    description: { type: String, required: true, trim: true },
    stack: [{ type: String, trim: true }],
    impact: { type: String, required: true, trim: true },
    imageUrl: { type: String, required: true, trim: true },
    githubUrl: { type: String, trim: true, default: '' },
    demoUrl: { type: String, trim: true, default: '' }
  },
  { timestamps: true }
);

const Profile = mongoose.model('Profile', profileSchema);
const Project = mongoose.model('Project', projectSchema);

let mongoReady = false;

function groupProjects(projects) {
  const grouped = categoryOrder.map((category) => ({
    category,
    intro: sectionIntros[category],
    projects: []
  }));

  for (const project of projects) {
    const section = grouped.find((item) => item.category === project.category);
    if (section) {
      section.projects.push(project);
    }
  }

  return grouped.filter((section) => section.projects.length > 0);
}

function normalizeProject(payload) {
  const stack = Array.isArray(payload.stack)
    ? payload.stack
    : String(payload.stack || '')
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);

  return {
    category: payload.category,
    title: String(payload.title || '').trim(),
    description: String(payload.description || '').trim(),
    stack,
    impact: String(payload.impact || '').trim(),
    imageUrl: String(payload.imageUrl || '').trim()
  };
}

async function seedDatabase() {
  await Profile.findOneAndUpdate({}, defaultProfile, { upsert: true, new: true });

  for (const project of seedProjects) {
    await Project.findOneAndUpdate(
      { title: project.title },
      { $set: project },
      { upsert: true, new: true }
    );
  }
}

async function connectDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    mongoReady = true;
    await seedDatabase();
    console.log('MongoDB connecté et projets initiaux synchronisés.');
  } catch (error) {
    console.log('MongoDB indisponible: aucune donnée mock ne sera exposée pour les projets.');
    console.log(error.message);
  }
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, database: mongoReady ? 'connected' : 'disconnected', port: PORT });
});

app.get('/api/profile', async (_req, res) => {
  if (!mongoReady) {
    return res.status(503).json({ error: 'MongoDB n\'est pas connecté.' });
  }

  const profile = await Profile.findOne().lean();
  res.json(profile);
});

app.get('/api/projects', async (_req, res) => {
  if (!mongoReady) {
    return res.status(503).json({ error: 'MongoDB n\'est pas connecté.' });
  }

  const projects = await Project.find().sort({ createdAt: 1 }).lean();
  res.json(groupProjects(projects));
});

app.post('/api/projects', async (req, res) => {
  if (!mongoReady) {
    return res.status(503).json({ error: 'MongoDB n\'est pas connecté. Lance MongoDB puis vérifie MONGODB_URI dans .env.' });
  }

  const project = normalizeProject(req.body);

  if (!categoryOrder.includes(project.category)) {
    return res.status(400).json({ error: 'Catégorie invalide.' });
  }

  if (!project.title || !project.description || !project.impact || !project.imageUrl) {
    return res.status(400).json({ error: 'Titre, description, impact et image sont requis.' });
  }

  const createdProject = await Project.create(project);
  const projects = await Project.find().sort({ createdAt: 1 }).lean();

  res.status(201).json({
    ok: true,
    message: 'Projet ajouté dans MongoDB.',
    project: createdProject,
    sections: groupProjects(projects)
  });
});

app.put('/api/projects/:id', async (req, res) => {
  if (!mongoReady) {
    return res.status(503).json({ error: 'MongoDB n\'est pas connecté.' });
  }

  const project = normalizeProject(req.body);

  if (!categoryOrder.includes(project.category)) {
    return res.status(400).json({ error: 'Catégorie invalide.' });
  }

  if (!project.title || !project.description || !project.impact) {
    return res.status(400).json({ error: 'Titre, description et impact sont requis.' });
  }

  const updatedProject = await Project.findByIdAndUpdate(
    req.params.id,
    { $set: project },
    { new: true, runValidators: true }
  );

  if (!updatedProject) {
    return res.status(404).json({ error: 'Projet introuvable.' });
  }

  res.json({
    ok: true,
    message: 'Projet mis à jour.',
    project: updatedProject
  });
});

app.delete('/api/projects/:id', async (req, res) => {
  if (!mongoReady) {
    return res.status(503).json({ error: 'MongoDB n\'est pas connecté.' });
  }

  const deletedProject = await Project.findByIdAndDelete(req.params.id);

  if (!deletedProject) {
    return res.status(404).json({ error: 'Projet introuvable.' });
  }

  res.json({
    ok: true,
    message: 'Projet supprimé.'
  });
});

// Routes pour la gestion du CV
app.post('/api/cv/upload', upload.single('cv'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Aucun fichier fourni.' });
  }

  res.json({
    ok: true,
    message: 'CV téléchargé avec succès.',
    filename: req.file.filename,
    url: `/uploads/${req.file.filename}`
  });
});

app.get('/api/cv/check', (req, res) => {
  const cvPath = path.join(uploadsDir, 'cv_dieynaba_senghor.pdf');
  const exists = fs.existsSync(cvPath);

  res.json({
    exists,
    url: exists ? '/uploads/cv_dieynaba_senghor.pdf' : null
  });
});

app.delete('/api/cv', (req, res) => {
  const cvPath = path.join(uploadsDir, 'cv_dieynaba_senghor.pdf');

  if (fs.existsSync(cvPath)) {
    fs.unlinkSync(cvPath);
    res.json({
      ok: true,
      message: 'CV supprimé avec succès.'
    });
  } else {
    res.status(404).json({ error: 'Aucun CV trouvé.' });
  }
});

app.use((error, _req, res, _next) => {
  if (error?.code === 11000) {
    return res.status(409).json({ error: 'Un projet avec ce titre existe déjà.' });
  }

  console.error(error);
  res.status(500).json({ error: 'Erreur serveur.' });
});

await connectDatabase();

app.listen(PORT, () => {
  console.log(`API disponible sur http://127.0.0.1:${PORT}`);
});
