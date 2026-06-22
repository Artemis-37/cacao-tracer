# Routes - Operations UPDATED
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from app import db
from app.models import (
    Loading, LoadingAllocation, Receipt, Producer, 
    Cooperative, Exporter, Project
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

# Step 1: Create Loading (SAISIE INITIALE)
@operations_bp.route('/loadings', methods=['POST'])
@jwt_required()
def create_loading():
    """
    Créer un nouveau chargement avec saisie initiale uniquement.
    
    Données requises (SAISIE INITIALE UNIQUEMENT):
    - exporter_id
    - project_id
    - loading_date
    - vehicle_number (N° Véhicule)
    - trailer_number (N° Remorque)
    - driver_name (Conducteur)
    - bill_of_lading (Connaissement)
    - declared_weight (Poids déclaré en kg)
    - total_sacks (Nombre total de sacs)
    """
    data = request.get_json()
    coop = Cooperative.query.first()
    
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
        status='pending'
    )
    
    db.session.add(loading)
    db.session.commit()
    
    return jsonify(loading.to_dict()), 201

# Step 2: Auto-allocate Loading to Producers (PARAMETRES D'ALLOCATION)
@operations_bp.route('/loadings/<int:loading_id>/allocate', methods=['POST'])
@jwt_required()
def allocate_loading(loading_id):
    """
    Affecter automatiquement le chargement aux producteurs.
    
    Paramètres d'allocation automatique (DANS LE CORPS DE LA REQUETE):
    - delivery_start_date (date début de période de livraison)
    - delivery_end_date (date fin de période de livraison)
    - delivery_percentage (pourcentage à affecter, ex: 100)
    - delivery_deadline_days (délai de livraison en jours, ex: 30)
    - min_sacks (intervalle MIN de sacs par producteur, ex: 1)
    - max_sacks (intervalle MAX de sacs par producteur, ex: 10)
    """
    loading = Loading.query.get(loading_id)
    if not loading:
        return jsonify({'error': 'Loading not found'}), 404
    
    data = request.get_json()
    
    # Mettre à jour les paramètres d'allocation
    loading.delivery_start_date = datetime.fromisoformat(data.get('delivery_start_date')) if data.get('delivery_start_date') else None
    loading.delivery_end_date = datetime.fromisoformat(data.get('delivery_end_date')) if data.get('delivery_end_date') else None
    loading.delivery_percentage = float(data.get('delivery_percentage', 100))
    loading.delivery_deadline_days = int(data.get('delivery_deadline_days', 30))
    loading.min_sacks = int(data.get('min_sacks', 1))
    loading.max_sacks = int(data.get('max_sacks', 10))
    
    db.session.commit()
    
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
    
    while weight_remaining > 0 and sacks_remaining > 0 and producers:
        # Sélectionner un producteur aléatoire
        producer = random.choice(producers)
        remaining_production = producer.get_remaining_production()
        
        if remaining_production <= 0:
            producers.remove(producer)
            continue
        
        # Déterminer le nombre de sacs à allouer (selon intervalle min-max)
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
            # Date aléatoire entre start_date et end_date
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
    
    # Générer le numéro de reçu
    from datetime import datetime
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
