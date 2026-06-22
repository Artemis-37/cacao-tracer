# 🌾 Cacao Tracer - Système de Traçabilité du Cacao

**Cacao Tracer** est un système complet de gestion et de traçabilité des chargements de cacao pour les coopératives agricoles.

## ✨ Fonctionnalités Principales

### 🔐 Authentification
- Login sécurisé avec JWT
- Gestion des rôles et permissions
- Interface de connexion intuitive

### 📊 Tableau de Bord
- Vue d'ensemble des opérations
- Statistiques en temps réel
- Graphiques animés

### ⚙️ Paramètres
- **Campagne** : Définir la campagne agricole (ex: 2026/2027)
- **Traites** : Gérer Grande traite et Petite traite avec dates et pourcentages
- **Producteurs** : Importer et gérer la base de données des producteurs
- **Exportateurs** : Enregistrer exportateurs avec logos
- **Véhicules** : Gérer immatriculations et chauffeurs
- **Société** : Informations de la coopérative

### 📋 Opérations
- **Carnet de Reçu** : Génération automatique de numéros
- **Tracer un Chargement** :
  - Saisie des informations de chargement (Exportateur, Projet, Date, Véhicule, Remorque, Chauffeur, Connaissement, Poids, Sacs)
  - Saisie des paramètres d'affectation :
    - Période de livraison (date début - fin)
    - Pourcentage à affecter
    - Délai de livraison (en jours)
    - Intervalle de sacs (min-max)
  - Affectation automatique aux producteurs
  - Calcul du poids par sac (55-75 kg)
  - Barre de progression en temps réel
  - Génération de fiche d'accompagnement

### 💾 Base de Données
- **Export** : Excel, PDF, KML, GeoJSON, JSON, GPX
- **Import** : Données producteurs et configurations

## 🛠️ Stack Technologique

### Backend
- **Framework** : Python Flask
- **Base de données** : PostgreSQL
- **ORM** : SQLAlchemy
- **Authentification** : JWT (PyJWT)
- **Export** : openpyxl, reportlab, geojson

### Frontend
- **Framework** : React 18
- **État** : Redux Toolkit
- **UI** : Material-UI (MUI)
- **Charts** : Recharts
- **Export** : xlsx, jsPDF

## 📦 Installation Rapide

### Docker Compose (Recommandé)

```bash
git clone https://github.com/Artemis-37/cacao-tracer.git
cd cacao-tracer
docker-compose up -d

# Application disponible sur http://localhost:3000
```

## 🚀 Premier Démarrage

### Connexion
- **URL** : http://localhost:3000
- **Email** : admin@cacao-tracer.local
- **Mot de passe** : Admin@123

## 📂 Guide Complet

Voir `docs/INSTALLATION.md` pour l'installation détaillée

---

**Version** : 1.0.0
