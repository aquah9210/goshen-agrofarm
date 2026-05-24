# Goshen Agrofarm — Site Web Officiel

## 🚀 Déploiement rapide sur Vercel

### Méthode 1 — GitHub + Vercel (recommandée)

1. Créez un repo GitHub nommé `goshen-agrofarm`
2. Uploadez tous ces fichiers dans le repo
3. Allez sur vercel.com → "Add New Project"
4. Connectez votre repo GitHub → "Deploy"
5. ✅ Site en ligne en 2 minutes

### Méthode 2 — Vercel CLI

```bash
npm install -g vercel
vercel login
vercel --prod
```

### Méthode 3 — Drag & Drop

1. Allez sur vercel.com
2. Faites glisser ce dossier entier sur le dashboard Vercel
3. ✅ Déployé instantanément

## 📁 Structure du projet

```
goshen-vercel/
├── src/
│   └── app/
│       ├── page.js          ← Point d'entrée
│       ├── layout.js        ← Layout global + SEO
│       ├── GoshenApp.jsx    ← Application complète
│       └── globals.css      ← Styles globaux
├── public/
│   └── robots.txt
├── package.json
├── next.config.js
├── vercel.json
└── README.md
```

## 🌿 Goshen Agrofarm OS v2.4.1
Excellence agro-pastorale · Adzopé, Côte d'Ivoire
