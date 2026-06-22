# Routes - Operations - UPDATED
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from app import db
from app.models import (
    Loading, LoadingAllocation, Receipt, Producer, 
    Cooperative, Exporter, Project, HarvestSeason, Campaign
)
from datetime import datetime, timedelta
import random

operations_bp = Blueprint('operations', __name__, url_prefix='/api/operations')

# Generate Loading Number
def generate_loading_number():
    """Générer un numéro de chargement unique"""
    from datetime import datetime
    timestamp = datetime.utcnow().strftime('%Y%m%d%H%M%S')
    return f"CHG-{timestamp}"

# ============================================
# GESTION DES TRAITES (Ouvrir/Fermer)
# ============================================

# Ouvrir une traite
@operations_bp.route('/harvest-seasons/open', methods=['POST'])
@jwt_required()
def open_harvest_season():
    """
    Ouvrir une traite (Grande ou Petite).
    
    Données requises:
    - season_type: 'grande_traite' ou 'petite_traite'
    """
    data = request.get_json()
    season_type = data.get('season_type')
    
    # Vérifier qu'une traite du même type n'est pas déjà ouverte
    existing_open = HarvestSeason.query.filter_by(
        type=season_type,
        is_active=True
    ).first()
    
    if existing_open:
        return jsonify({
            'error': f'Une {existing_open.name} est déjà ouverte. Veuillez d\'abord la fermer.'
        }), 400
    
    # Récupérer la campagne active
    campaign = Campaign.query.filter_by(is_active=True).first()
    if not campaign:
        return jsonify({'error': 'Aucune campagne active trouvée'}), 404
    
    # Chercher la traite définie pour cette campagne
    season = HarvestSeason.query.filter_by(
        campaign_id=campaign.id,
        type=season_type
    ).first()
    
    if not season:
        return jsonify({
            'error': f'Traite de type {season_type} non trouvée dans la campagne active'
        }), 404
    
    # Ouvrir la traite
    season.is_active = True
    season.opened_at = datetime.utcnow()
    season.closed_at = None
    db.session.commit()
    
    return jsonify({
        'message': f'{season.name} ouverte avec succès',
        'season': season.to_dict()
    }), 200

# Fermer une traite
@operations_bp.route('/harvest-seasons/<int:season_id>/close', methods=['POST'])
@jwt_required()
def close_harvest_season(season_id):
    """
    Fermer une traite ouverte.
    
    Paramètres:
    - season_id: ID de la traite à fermer
    """
    season = HarvestSeason.query.get(season_id)
    if not season:
        return jsonify({'error': 'Traite non trouvée'}), 404
    
    if not season.is_active:
        return jsonify({
            'error': f'{season.name} est déjà fermée'
        }), 400
    
    # Fermer la traite
    season.is_active = False
    season.closed_at = datetime.utcnow()
    db.session.commit()
    
    return jsonify({
        'message': f'{season.name} fermée avec succès',
        'season': season.to_dict()
    }), 200

# Lister toutes les traites (y compris ouvertes/fermées)
@operations_bp.route('/harvest-seasons', methods=['GET'])
@jwt_required()
def get_harvest_seasons():
    """
    Obtenir toutes les traites de la campagne active.
    """
    campaign = Campaign.query.filter_by(is_active=True).first()
    if not campaign:
        return jsonify([]), 200
    
    seasons = HarvestSeason.query.filter_by(campaign_id=campaign.id).all()
    return jsonify([s.to_dict() for s in seasons]), 200

# Traite actuellement ouverte
@operations_bp.route('/harvest-seasons/active', methods=['GET'])
@jwt_required()
def get_active_harvest_season():
    """
    Obtenir la traite actuellement ouverte (s'il y en a une).
    """
    active = HarvestSeason.query.filter_by(is_active=True).first()
    if not active:
        return jsonify({'message': 'Aucune traite ouverte', 'season': None}), 200
    return jsonify(active.to_dict()), 200

# ============================================
# GESTION DES CHARGEMENTS
# ============================================

# Step 1: Create Loading (SAISIE INITIALE)
@operations_bp.route('/loadings', methods=['POST'])
@jwt_required()
def create_loading():
    """
    Créer un nouveau chargement avec saisie initiale + paramètres allocation.
    
    Données requises:
    - exporter_id
    - project_id
    - loading_date
    - vehicle_number (N° Véhicule)
    - trailer_number (N° Remorque)
    - driver_name (Conducteur)
    - bill_of_lading (Connaissement)
    - declared_weight (Poids déclaré en kg)
    - total_sacks (Nombre total de sacs)
    
    Paramètres d'allocation (SAISIE MANUELLE):
    - delivery_start_date (début période livraison)
    - delivery_end_date (fin période livraison)
    - delivery_percentage (pourcentage à affecter, validé vs traite)
    - delivery_deadline_days (délai en jours avant réallocation)
    """
    data = request.get_json()
    coop = Cooperative.query.first()
    
    # Valider le pourcentage contre la traite
    delivery_percentage = float(data.get('delivery_percentage', 100))
    
    # Récupérer la traite active
    active_season = HarvestSeason.query.filter_by(is_active=True).first()
    
    if not active_season:
        return jsonify({'error': 'Aucune traite ouverte. Veuillez d\'abord ouvrir une traite.'}), 400
    
    max_percentage = active_season.delivery_percentage
    
    if delivery_percentage > max_percentage:
        return jsonify({
            'error': f'Pourcentage d\'affectation ({delivery_percentage}%) dépasse le maximum de la traite ({max_percentage}%)'
        }), 400
    
    loading = Loading(
        loading_number=generate_loading_number(),
        cooperative_id=coop.id,
        exporter_id=data.get('exporter_id'),
        project_id=data.get('project_id'),
        loading_date=datetime.fromisoformat(data.get('loading_date')),
        vehicle_number=data.get('vehicle_number'),
        trailer_number=data.get('trailer_number'),
        driver_name=data.get('driver_name'),
        bill_of_lading=data.get('bill_of_lading'),
        declared_weight=float(data.get('declared_weight')),
        total_sacks=int(data.get('total_sacks')),
        # Paramètres d'allocation (SAISIE MANUELLE)
        delivery_start_date=datetime.fromisoformat(data.get('delivery_start_date')) if data.get('delivery_start_date') else None,
        delivery_end_date=datetime.fromisoformat(data.get('delivery_end_date')) if data.get('delivery_end_date') else None,
        delivery_percentage=delivery_percentage,
        delivery_deadline_days=int(data.get('delivery_deadline_days', 30)),
        # Intervalle de sacs (automatique)
        min_sacks=int(data.get('min_sacks', 1)),
        max_sacks=int(data.get('max_sacks', 10)),
        status='pending'
    )
    
    db.session.add(loading)
    db.session.commit()
    
    return jsonify(loading.to_dict()), 201

# Step 2: Auto-allocate Loading to Producers
@operations_bp.route('/loadings/<int:loading_id>/allocate', methods=['POST'])
@jwt_required()
def allocate_loading(loading_id):
    """
    Affecter automatiquement le chargement aux producteurs.
    """
    loading = Loading.query.get(loading_id)
    if not loading:
        return jsonify({'error': 'Loading not found'}), 404
    
    # Supprimer les allocations existantes
    LoadingAllocation.query.filter_by(loading_id=loading_id).delete()
    db.session.commit()
    
    # Calculer le poids à affecter
    total_weight = loading.declared_weight * (loading.delivery_percentage / 100)
    weight_remaining = total_weight
    sacks_remaining = loading.total_sacks
    
    # Récupérer les producteurs actifs
    producers = Producer.query.filter_by(
        cooperative_id=loading.cooperative_id,
        is_active=True
    ).all()
    
    allocations = []
    last_allocation_dates = {}
    
    while weight_remaining > 0 and sacks_remaining > 0 and producers:
        # Sélectionner un producteur aléatoire
        producer = random.choice(producers)
        remaining_production = producer.get_remaining_production()
        
        if remaining_production <= 0:
            producers.remove(producer)
            continue
        
        # Vérifier le délai de livraison
        last_date = last_allocation_dates.get(producer.id)
        if last_date:
            days_since = (loading.loading_date - last_date).days
            if days_since < loading.delivery_deadline_days:
                continue
        
        # Déterminer le nombre de sacs à allouer
        sacks_to_allocate = random.randint(
            loading.min_sacks,
            min(loading.max_sacks, sacks_remaining)
        )
        
        # Calculer le poids moyen par sac (55-75 kg)
        weight_per_sack = random.uniform(55, 75)
        weight_to_allocate = sacks_to_allocate * weight_per_sack
        
        # Limiter au poids restant et à la production restante du producteur
        weight_to_allocate = min(weight_to_allocate, weight_remaining, remaining_production)
        sacks_to_allocate = int(weight_to_allocate / weight_per_sack)
        
        if sacks_to_allocate <= 0:
            producers.remove(producer)
            continue
        
        # Calculer la date de livraison
        delivery_date = loading.loading_date + timedelta(days=loading.delivery_deadline_days)
        if loading.delivery_start_date and loading.delivery_end_date:
            days_diff = (loading.delivery_end_date - loading.delivery_start_date).days
            random_days = random.randint(0, max(1, days_diff))
            delivery_date = loading.delivery_start_date + timedelta(days=random_days)
        
        # Créer l'allocation
        allocation = LoadingAllocation(
            loading_id=loading_id,
            producer_id=producer.id,
            allocated_weight=weight_to_allocate,
            allocated_sacks=sacks_to_allocate,
            weight_per_sack=weight_per_sack,
            delivery_date=delivery_date,
            status='allocated'
        )
        
        db.session.add(allocation)
        allocations.append(allocation)
        
        # Mettre à jour le producteur
        producer.production_delivered += weight_to_allocate
        
        # Tracker la dernière allocation
        last_allocation_dates[producer.id] = delivery_date
        
        # Mettre à jour les totaux
        weight_remaining -= weight_to_allocate
        sacks_remaining -= sacks_to_allocate
        
        if weight_remaining <= 0 or sacks_remaining <= 0:
            break
    
    # Mettre à jour le statut du chargement
    if weight_remaining <= 0 and sacks_remaining <= 0:
        loading.status = 'completed'
    else:
        loading.status = 'in_progress'
    
    db.session.commit()
    
    return jsonify({
        'loading': loading.to_dict(),
        'allocations': [a.to_dict() for a in allocations],
        'weight_allocated': total_weight - weight_remaining,
        'weight_remaining': weight_remaining,
        'sacks_allocated': loading.total_sacks - sacks_remaining,
        'sacks_remaining': sacks_remaining
    }), 200

# Get Loading Details
@operations_bp.route('/loadings/<int:loading_id>', methods=['GET'])
@jwt_required()
def get_loading(loading_id):
    """Obtenir les détails d'un chargement"""
    loading = Loading.query.get(loading_id)
    if not loading:
        return jsonify({'error': 'Loading not found'}), 404
    
    allocations = LoadingAllocation.query.filter_by(loading_id=loading_id).all()
    
    return jsonify({
        'loading': loading.to_dict(include_tracking=True),
        'allocations': [a.to_dict() for a in allocations]
    }), 200

# Generate Receipt
@operations_bp.route('/receipts', methods=['POST'])
@jwt_required()
def create_receipt():
    """Générer un reçu"""
    data = request.get_json()
    coop = Cooperative.query.first()
    
    timestamp = datetime.utcnow().strftime('%Y%m%d%H%M%S')
    receipt_number = f"RCP-{timestamp}"
    
    receipt = Receipt(
        cooperative_id=coop.id,
        receipt_number=receipt_number,
        producer_id=data.get('producer_id'),
        weight_received=float(data.get('weight_received')),
        sacks_received=int(data.get('sacks_received')),
        notes=data.get('notes')
    )
    
    db.session.add(receipt)
    db.session.commit()
    
    return jsonify(receipt.to_dict()), 201
