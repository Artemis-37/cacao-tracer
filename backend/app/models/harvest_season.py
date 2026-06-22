# Harvest Season Model
from app import db
from datetime import datetime
from enum import Enum

class HarvestType(Enum):
    GRANDE = 'grande_traite'
    PETITE = 'petite_traite'

class HarvestSeason(db.Model):
    __tablename__ = 'harvest_seasons'
    
    id = db.Column(db.Integer, primary_key=True)
    campaign_id = db.Column(db.Integer, db.ForeignKey('campaigns.id'), nullable=False)
    name = db.Column(db.String(50), nullable=False)  # Grande traite, Petite traite
    type = db.Column(db.String(20), nullable=False)  # grande_traite, petite_traite
    start_date = db.Column(db.DateTime, nullable=False)
    end_date = db.Column(db.DateTime, nullable=False)
    delivery_percentage = db.Column(db.Float, default=0)  # Pourcentage de livraison autorisé
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    campaign = db.relationship('Campaign', backref='seasons')
    
    def to_dict(self):
        return {
            'id': self.id,
            'campaign_id': self.campaign_id,
            'name': self.name,
            'type': self.type,
            'start_date': self.start_date.isoformat(),
            'end_date': self.end_date.isoformat(),
            'delivery_percentage': self.delivery_percentage,
            'is_active': self.is_active
        }
