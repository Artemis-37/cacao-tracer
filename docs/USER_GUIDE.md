# 🌾 Cacao Tracer - Guide de l'Utilisateur

## Vue d'ensemble

**Cacao Tracer** est un système complet pour gérer et traçer les chargements de cacao de votre coopérative agricole.

## 🔐 Connexion

1. Accueil: http://localhost:3000
2. Email: `admin@cacao-tracer.local`
3. Mot de passe: `Admin@123`
4. Cliquer "Se connecter"

## 📊 Tableau de Bord

Affiche des statistiques en temps réel:
- Nombre de producteurs
- Nombre de chargements
- Poids total traité
- Chargements completés

## ⚙️ Paramétrage Initial (OBLIGATOIRE)

### 1. Société
Configure les informations de votre coopérative:
- Nom de la coopérative
- Sigle (acronýme)
- Localisation
- Téléphone / Email
- Site web
- Logo (optionnel)

### 2. Campagne
Définissez la campagne agricole:
- Nom (ex: 2026/2027)
- Date de début
- Date de fin

### 3. Traites (Grande et Petite)
Définissez les saisons de récolte:

**Grande Traite:**
- Date début: 1er octobre
- Date fin: 31 mars
- Pourcentage: 70%

**Petite Traite:**
- Date début: 1er avril
- Date fin: 30 septembre
- Pourcentage: 30%

### 4. Producteurs
Importez votre base de producteurs:
- Via CSV (Paramètres > Producteurs > Importer)
- Ou ajouter manuellement

Données requises:
- Nom
- Téléphone (optionnel)
- Email (optionnel)
- Village
- Latitude / Longitude (pour localisation)
- **Production estimée (kg)** - CRUCIAL

### 5. Exportateurs
Enregistrez vos partenaires exportateurs:
- Nom
- Personne de contact
- Téléphone / Email
- Adresse
- Logo (optionnel)

### 6. Véhicules
Recensez votre flotte:
- N° d'immatriculation
- Type (Camion/Remorque)
- Nom du chauffeur
- Téléphone du chauffeur
- Capacité (kg)

## 📋 Opérations

### Carnet de Reçu
Générez des numéros de reçu automatiques pour chaque achat producteur.

### Tracer un Chargement

**PROCESSUS EN 2 ÉTAPES :**

#### **ÉTAPE 1 : SAISIE INITIALE**

Entrée les données du chargement:

| Champ | Description |
|-------|-------------|
| **Exportateur** | Sélectionner dans la liste déroulante |
| **Projet** | Sélectionner le projet associé |
| **Date de chargement** | Date physique du chargement |
| **N° Véhicule** | Numéro d'immatriculation du véhicule |
| **N° Remorque** | Numéro d'immatriculation de la remorque |
| **Conducteur** | Nom du chauffeur |
| **Connaissement** | Numéro de connaissement (Bill of Lading) |
| **Poids déclaré** | Poids total en kg |
| **Nombre total de sacs** | Nombre de sacs du chargement |

**Action:** Cliquer "Suivant →"

---

#### **ÉTAPE 2 : PARAMÈTRES D'ALLOCATION AUTOMATIQUE**

Configurer l'allocation intelligente du chargement aux producteurs:

| Paramètre | Description | Exemple |
|-----------|-------------|----------|
| **Période de livraison - Début** | Date de début de la période | 15/01/2026 |
| **Période de livraison - Fin** | Date de fin de la période | 28/02/2026 |
| **Pourcentage à affecter** | % du poids total à allouer aux producteurs | 100 (= affecter 100% du poids) |
| **Délai de livraison** | Nombre de jours avant livraison | 30 jours |
| **Intervalle MIN de sacs** | Nombre minimum par producteur | 1 sac |
| **Intervalle MAX de sacs** | Nombre maximum par producteur | 10 sacs |

**Le système va automatiquement:**
1. ✅ Calculer le poids à allouer = `declared_weight × (delivery_percentage / 100)`
2. ✅ Sélectionner des producteurs aléatoires
3. ✅ Allouer 1-10 sacs par producteur (selon l'intervalle)
4. ✅ Calculer poids/sac aléatoire entre 55-75 kg
5. ✅ Respecter l'estimation de production restante
6. ✅ Générer une date de livraison aléatoire entre les dates
7. ✅ Afficher une barre de progression animée

**Actions:**
- 🔄 **Tracer** - Lance l'allocation automatique
- 👁️ **Voir la liste** - Affiche les allocations générées
- ✅ **Valider le chargement** - Finalise et génère la fiche d'accompagnement
- ← **Retour** - Revenir à l'étape 1

---

### Liste des Allocations

Affiche pour chaque producteur:
- **Nom du producteur**
- **Poids alloué (kg)**
- **Nombre de sacs**
- **Poids moyen/sac (55-75 kg)**
- **Date de livraison prévue**

### Fiche d'Accompagnement

Après validation, vous pouvez:
- 📊 **Imprimer** - Version papier
- 💾 **Exporter PDF** - Pour archivage digital
- 📋 **Exporter Excel** - Pour analyse
- 🗺 **Exporter GeoJSON** - Pour mapping

## 💾 Base de Données

### Importer
**Importer des producteurs depuis un fichier CSV**

Format CSV attendu:
```csv
name,phone,email,village,latitude,longitude,estimated_production,is_active
Producteur 1,+225 01 23 45 67,prod1@example.com,Village A,6.8276,-5.2893,5000,true
```

### Exporter

**Formats disponibles:**
- 📋 **Producteurs (Excel)** - Liste complète avec production
- 📦 **Chargements (Excel)** - Historique des chargements
- 🗺 **GeoJSON** - Données géographiques pour mapping
- 🖨 **PDF** - Rapports format PDF
- 📄 **JSON** - Format brut pour intégrations

---

## 🐛 Calcul Automatique - Détails Techniques

### Poids par Sac
- **Min:** 55 kg
- **Max:** 75 kg
- **Calcul:** Aléatoire entre 55-75 kg par allocation

### Allocation aux Producteurs
1. Sélection aléatoire d'un producteur actif
2. Vérification de sa production restante
3. Allocation de `min_sacks` à `max_sacks` sacs
4. Calcul du poids = nombre de sacs × poids moyen
5. Limitation au poids restant et production restante

### Dates de Livraison
- Si période spécifiée: date aléatoire entre début et fin
- Sinon: date du chargement + délai en jours

---

## 📐 FAQs

**Q: Qu'est-ce que "Production estimée"?**
R: La quantité de cacao que le producteur peut fournir (en kg) sur la campagne.

**Q: Comment le système respecte "Production restante"?**
R: Il garde en mémoire ce qui a déjà été alloué et n'alloue pas plus que la production estimée.

**Q: Puis-je modifier une allocation?**
R: Actuellement, les allocations sont finales. Pour modifier, créez un nouveau chargement.

**Q: Que signifie "Intervalle de sacs"?**
R: Le nombre de sacs distribués aléatoirement entre min et max pour chaque producteur.

---

**Version:** 1.0.0
