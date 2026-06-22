# 📖 Guide d'Utilisation - Cacao Tracer v1.0

## Flux Complet: Ouvrir une Traite → Tracer des Chargements → Fermer la Traite

### 1️⃣ OUVRIR UNE TRAITE (Opérations > Ouvrir une traite)

**Étapes:**
1. Aller à **Opérations** → **Ouvrir une traite**
2. Sélectionner le type de traite:
   - 🌱 **Grande Traite** (Oct-Mar, 70%)
   - 🌾 **Petite Traite** (Avr-Sep, 30%)
3. Cliquer **🔓 Ouvrir la Traite**
4. Confirmer l'ouverture

**Résultat:** La traite est ouverte et vous pouvez créer des chargements.

---

### 2️⃣ CONFIGURER LES DATES DE LIVRAISON GLOBALES

**Opération optionnelle, mais recommandée:**
1. Aller à **Paramètres** → **Société**
2. Remplir les champs:
   - **Période de livraison globale - Début** (ex: 15/01/2026)
   - **Période de livraison globale - Fin** (ex: 28/02/2026)
3. Enregistrer

Ces dates servent de **defaults** pour tous les chargements.

---

### 3️⃣ TRACER UN CHARGEMENT (Opérations > Tracer un Chargement)

**⚠️ IMPORTANT:** Une traite doit être **ouverte** avant de créer un chargement.

**Étape 1: Période de Livraison (SAISIE MANUELLE)**
```
Début de livraison    : 15/01/2026
Fin de livraison      : 28/02/2026
```

**Étape 2: Informations de la Coopérative**
```
Exportateur      : OFI (Olam Food Ingredients)
Projet           : Projet Standard
Date chargement  : 10/01/2026
N° Véhicule      : CIM-2026-001
N° Remorque      : RAM-2026-001
Conducteur       : Jean Dupont
Connaissement    : BL-2026-001
Poids déclaré    : 5000 kg
Nombre de sacs   : 75 sacs
```

**Étape 3: Paramètres d'Allocation (SAISIE MANUELLE)**
```
Pourcentage à affecter      : 70%  (Max: 70% de la Grande Traite)
Délai de livraison (jours)  : 30 jours (avant réallocation même producteur)
Intervalle MIN sacs         : 1 sac
Intervalle MAX sacs         : 10 sacs
```

**Le système va automatiquement:**
- ✅ Calculer le poids: 5000 × (70/100) = 3500 kg
- ✅ Distribuer à producteurs aléatoires (1-10 sacs chacun)
- ✅ Calculer poids/sac: 55-75 kg
- ✅ Respecter délai de 30j avant réallocation
- ✅ Générer date de livraison entre 15/01 et 28/02

**Action:** Cliquer **🔄 Créer et Tracer le Chargement**

**Résultat:**
- 👁️ Voir la liste des allocations (cliquer "Voir la liste")
- 📋 Valider le chargement (générer fiche d'accompagnement)

---

### 4️⃣ FERMER UNE TRAITE (Opérations > Fermer une traite)

**Étapes:**
1. Aller à **Opérations** → **Fermer une traite**
2. Sélectionner la traite ouverte (auto-sélection si 1 seule)
3. Cliquer **🔒 Fermer la Traite**
4. Confirmer la fermeture

**Résultat:**
- La traite est fermée ✅
- Vous ne pouvez plus créer de chargements pour cette traite
- Vous pouvez ouvrir une autre traite ou la même traite plus tard

---

## 🔑 Concepts Clés

### Traite (Harvest Season)
- **Grande Traite:** Octobre-Mars, Max 70% livraison
- **Petite Traite:** Avril-Septembre, Max 30% livraison
- **Statut:** Ouverte ou Fermée
- **État:** Une seule traite peut être ouverte à la fois par type

### Pourcentage à Affecter
- **Exemple:** Grande Traite = 70% max
- **Pour un chargement:** Je peux affecter 0-70%
- **Ne PAS dépasser:** Le max de la traite
- **Saisie:** Manuelle par l'utilisateur

### Délai de Livraison (Jours)
- **Définition:** Nombre de jours avant réallocation au même producteur
- **Exemple:** Délai = 30 jours
  - Producteur X reçoit un chargement le 15/01
  - Prochaine allocation possible: 15/02 (après 30 jours)
  - Avant le 15/02: le système saute ce producteur

### Intervalle de Sacs
- **MIN:** Nombre minimum par producteur (ex: 1)
- **MAX:** Nombre maximum par producteur (ex: 10)
- **Automatique:** Le système choisit aléatoire entre MIN-MAX
- **Poids/sac:** 55-75 kg (calculé automatiquement)

---

## 📊 État et Statuts

### Traite
| État | Signification | Action |
|------|---------------|--------|
| 🟢 OUVERTE | Traite active | Créer chargements |
| 🔴 FERMÉE | Traite inactive | Ouvrir pour réactiver |

### Chargement
| État | Signification |
|------|---------------|
| ⏳ Pending | En attente d'allocation |
| 🔄 In Progress | Allocation en cours |
| ✅ Completed | Poids et sacs atteints |

---

## 🎯 Cas d'Usage Typique

**Scénario:** Traiter 3 chargements de Grande Traite en janvier

```
1️⃣ LUNDI 10/01
   → Ouvrir Grande Traite

2️⃣ LUNDI 10/01 - Chargement 1
   Période: 15/01 - 31/01
   Poids: 2500 kg, Pourcentage: 50%
   Affectés: 1250 kg à producteurs

3️⃣ JEUDI 13/01 - Chargement 2
   Période: 15/01 - 31/01
   Poids: 3000 kg, Pourcentage: 50%
   Affectés: 1500 kg à producteurs
   → Certains producteurs du chargement 1 peuvent être réalloués
     (si délai de 30j respecté)

4️⃣ SAMEDI 15/01 - Chargement 3
   Période: 15/01 - 31/01
   Poids: 2000 kg, Pourcentage: 70%
   Affectés: 1400 kg à producteurs

5️⃣ LUNDI 01/02
   → Tous les chargements sont validés
   → Générer fiches d'accompagnement
   → Exporter données

6️⃣ LUNDI 28/02
   → Fermer Grande Traite (fin de saison)
```

---

## ⚠️ Erreurs Courantes

### ❌ "Aucune traite ouverte"
**Solution:** Aller à Opérations → Ouvrir une traite

### ❌ "Pourcentage dépasse le maximum"
**Exemple:** Grande Traite = 70% max
- ✅ Correct: 70% ou moins
- ❌ Incorrect: 80% ou plus
**Solution:** Réduire le pourcentage

### ❌ "Une Grande Traite est déjà ouverte"
**Solution:** Fermer d'abord la Grande Traite ouverte

---

**Version:** 1.0.0  
**Dernière mise à jour:** 2026-06-22
