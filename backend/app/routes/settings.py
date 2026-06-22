# Routes - Settings (Parameters)
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from app import db
from app.models import (
    Cooperative, Campaign, HarvestSeason, Producer, 
    Exporter, Vehicle
)

settings_bp = Blueprint('settings', __name__, url_prefix='/api/settings')

# Cooperative
@settings_bp.route('/cooperative', methods=['GET', 'POST', 'PUT'])
@jwt_required()
def cooperative():
    """Gérer les informations de la coopérative"""
    if request.method == 'GET':
        coop = Cooperative.query.first()
        if not coop:
            return jsonify({'error': 'Cooperative not found'}), 404
        return jsonify(coop.to_dict()), 200
    
    elif request.method in ['POST', 'PUT']:
        data = request.get_json()
        coop = Cooperative.query.first()
        
        if not coop:
            coop = Cooperative(
                name=data.get('name'),
                acronym=data.get('acronym')
            )
            db.session.add(coop)
        else:
            coop.name = data.get('name', coop.name)
            coop.acronym = data.get('acronym', coop.acronym)
        
        coop.location = data.get('location', coop.location)
        coop.phone = data.get('phone', coop.phone)
        coop.email = data.get('email', coop.email)
        coop.website = data.get('website', coop.website)
        coop.description = data.get('description', coop.description)
        
        db.session.commit()
        return jsonify(coop.to_dict()), 201

# Campaigns
@settings_bp.route('/campaigns', methods=['GET', 'POST'])
@jwt_required()
def campaigns():
    """Gérer les campagnes agricoles"""
    if request.method == 'GET':
        coop = Cooperative.query.first()
        campaigns = Campaign.query.filter_by(cooperative_id=coop.id).all()
        return jsonify([c.to_dict() for c in campaigns]), 200
    
    elif request.method == 'POST':
        data = request.get_json()
        coop = Cooperative.query.first()
        
        campaign = Campaign(
            cooperative_id=coop.id,
            name=data.get('name'),
            start_date=data.get('start_date'),
            end_date=data.get('end_date'),
            is_active=data.get('is_active', True)
        )
        db.session.add(campaign)
        db.session.commit()
        return jsonify(campaign.to_dict()), 201

# Harvest Seasons
@settings_bp.route('/seasons', methods=['GET', 'POST'])
@jwt_required()
def harvest_seasons():
    """Gérer les traites (Grande et Petite)"""
    if request.method == 'GET':
        campaign = Campaign.query.filter_by(is_active=True).first()
        if not campaign:
            return jsonify([]), 200
        seasons = HarvestSeason.query.filter_by(campaign_id=campaign.id).all()
        return jsonify([s.to_dict() for s in seasons]), 200
    
    elif request.method == 'POST':
        data = request.get_json()
        campaign = Campaign.query.filter_by(is_active=True).first()
        
        season = HarvestSeason(
            campaign_id=campaign.id,
            name=data.get('name'),
            type=data.get('type'),
            start_date=data.get('start_date'),
            end_date=data.get('end_date'),
            delivery_percentage=data.get('delivery_percentage', 0),
            is_active=data.get('is_active', True)
        )
        db.session.add(season)
        db.session.commit()
        return jsonify(season.to_dict()), 201

# Producers
@settings_bp.route('/producers', methods=['GET', 'POST'])
@jwt_required()
def producers():
    """Gérer les producteurs"""
    if request.method == 'GET':
        coop = Cooperative.query.first()
        producers = Producer.query.filter_by(cooperative_id=coop.id).all()
        return jsonify([p.to_dict() for p in producers]), 200
    
    elif request.method == 'POST':
        data = request.get_json()
        coop = Cooperative.query.first()
        
        producer = Producer(
            cooperative_id=coop.id,
            name=data.get('name'),
            phone=data.get('phone'),
            email=data.get('email'),
            village=data.get('village'),
            latitude=data.get('latitude'),
            longitude=data.get('longitude'),
            estimated_production=data.get('estimated_production', 0),
            is_active=data.get('is_active', True)
        )
        db.session.add(producer)
        db.session.commit()
        return jsonify(producer.to_dict()), 201

# Exporters
@settings_bp.route('/exporters', methods=['GET', 'POST'])
@jwt_required()
def exporters():
    """Gérer les exportateurs"""
    if request.method == 'GET':
        coop = Cooperative.query.first()
        exporters = Exporter.query.filter_by(cooperative_id=coop.id).all()
        return jsonify([e.to_dict() for e in exporters]), 200
    
    elif request.method == 'POST':
        data = request.get_json()
        coop = Cooperative.query.first()
        
        exporter = Exporter(
            cooperative_id=coop.id,
            name=data.get('name'),
            contact_person=data.get('contact_person'),
            phone=data.get('phone'),
            email=data.get('email'),
            address=data.get('address'),
            is_active=data.get('is_active', True)
        )
        db.session.add(exporter)
        db.session.commit()
        return jsonify(exporter.to_dict()), 201

# Vehicles
@settings_bp.route('/vehicles', methods=['GET', 'POST'])
@jwt_required()
def vehicles():
    """Gérer les véhicules et remorques"""
    if request.method == 'GET':
        coop = Cooperative.query.first()
        vehicles = Vehicle.query.filter_by(cooperative_id=coop.id).all()
        return jsonify([v.to_dict() for v in vehicles]), 200
    
    elif request.method == 'POST':
        data = request.get_json()
        coop = Cooperative.query.first()
        
        vehicle = Vehicle(
            cooperative_id=coop.id,
            registration_number=data.get('registration_number'),
            vehicle_type=data.get('vehicle_type'),
            driver_name=data.get('driver_name'),
            driver_phone=data.get('driver_phone'),
            capacity_kg=data.get('capacity_kg'),
            is_active=data.get('is_active', True)
        )
        db.session.add(vehicle)
        db.session.commit()
        return jsonify(vehicle.to_dict()), 201
