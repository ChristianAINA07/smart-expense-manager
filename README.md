# FinTrack Pro - Smart Business Expense Manager

FinTrack Pro est une application web full-stack de gestion financière moderne conçue pour les entrepreneurs et les petites entreprises. Elle permet de suivre les flux de trésorerie (revenus et dépenses) en temps réel, de définir des limites budgétaires par catégorie et de générer des rapports financiers professionnels.

## 🚀 Fonctionnalités Principales

- **Authentification Sécurisée (JWT)** : Inscription et connexion multi-utilisateurs avec hachage des mots de passe (Bcrypt) et protection des routes par stratégie Passport JWT.
- **Gestion des Flux Financiers (CRUD)** : Formulaire d'ajout rapide pour les revenus et dépenses avec mise à jour dynamique des indicateurs.
- **Business Insights Engine** : Algorithme backend analysant automatiquement l'état financier et déclenchant des alertes visuelles lorsque les dépenses approchent ou dépassent les limites budgétaires définies.
- **Tableau de Bord Analytique** : Graphiques interactifs animés (Pie Chart et Bar Chart via Recharts) pour une visualisation claire de la répartition des coûts et de l'évolution annuelle.
- **Rapports Professionnels** : Exportation instantanée au format PDF du résumé financier mensuel et de l'historique détaillé.
- **Navigation Optimisée** : Interface Single Page Application (SPA) moderne avec défilement fluide (smooth-scroll) vers l'historique.

## 🛠️ Technologies Utilisées

### Backend
- **Framework** : NestJS (TypeScript)
- **Base de Données** : PostgreSQL
- **ORM** : Prisma v7 (avec Driver Adapter `pg`)
- **Sécurité** : Passport, Passport-JWT, Bcrypt

### Frontend
- **Framework** : React (TypeScript) avec Vite (Parser Oxc/Rolldown)
- **Style** : Tailwind CSS v4 (Dark Theme moderne)
- **Graphiques** : Recharts
- **Génération PDF** : jsPDF & jspdf-autotable
- **Icônes** : Lucide React

## 📦 Installation et Lancement Local

### 1. Cloner le projet
```bash
cd C:\smart-expense-manager
```

### 2. Configurer le Backend
Ouvrez le dossier `backend` et configurez le fichier `.env` :
```env
DATABASE_URL="postgresql://postgres:VOTRE_PASSWORD@localhost:5432/smart_expense_db?schema=public"
JWT_SECRET="super-secret-key-123"
```

Installez les dépendances et lancez le serveur :
```bash
cd backend
npm install
npx prisma db push
npm run start:dev
```

### 3. Configurer le Frontend
Ouvrez un autre terminal dans le dossier `frontend`, installez les modules et lancez l'application :
```bash
cd frontend
npm install
npm run dev
```
L'application sera accessible sur `http://localhost:5173/`.

## 📸 Aperçu de l'Application

### 1. Page d'Authentification
![FinTrack Pro Login](./assets/1_login.png)

### 2. Tableau de Bord Analytique (Vue Complète)
![FinTrack Pro Dashboard](./assets/2_dashboard.png)

### 3. Rapport Financier Exporté (PDF)
![FinTrack Pro PDF Report](./assets/3_pdf_report.png)

### 4. Base de Données Relationnelle (PostgreSQL via pgAdmin)
![PostgreSQL Database Architecture](./assets/4_database.PNG)
