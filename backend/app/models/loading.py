# Loading Model - UPDATED
from app import db
from datetime import datetime
import uuid

class Loading(db.Model):
    __tablename__ = 'loadings'
    
    id = db.Column(db.Integer, primary_key=True)
    loading_number = db.Column(db.String(50), unique=True, nullable=False, index=True)
    cooperative_id = db.Column(db.Integer, db.ForeignKey('cooperatives.id'), nullable=False)
    exporter_id = db.Column(db.Integer, db.ForeignKey('exporters.id'), nullable=False)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'), nullable=False)
    loading_date = db.Column(db.DateTime, nullable=False)
    vehicle_number = db.Column(db.String(50), nullable=False)  # N° Véhicule
    trailer_number = db.Column(db.String(50))  # N° Remorque
    driver_name = db.Column(db.String(255))  # Conducteur
    bill_of_lading = db.Column(db.String(100))  # Connaissement
    declared_weight = db.Column(db.Float, nullable=False)  # Poids déclaré (kg)
    total_sacks = db.Column(db.Integer, nullable=False)  # Nombre total de sacs
    
    # PARAMETRES D'ALLOCATION AUTOMATIQUE SEULEMENT
    delivery_start_date = db.Column(db.DateTime)  # Période de livraison - début
    delivery_end_date = db.Column(db.DateTime)  # Période de livraison - fin
    delivery_percentage = db.Column(db.Float)  # Pourcentage à affecter
    delivery_deadline_days = db.Column(db.Integer)  # Délai de livraison en jours
    min_sacks = db.Column(db.Integer)  # Intervalle MIN de sacs par allocation
    max_sacks = db.Column(db.Integer)  # Intervalle MAX de sacs par allocation
    
    status = db.Column(db.String(20), default='pending')  # pending, in_progress, completed, cancelled
    tracking_data = db.Column(db.JSON)  # Données de traçage JSON
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    cooperative = db.relationship('Cooperative', backref='loadings')
    exporter = db.relationship('Exporter', backref='loadings')
    project = db.relationship('Project', backref='loadings')
    
    def to_dict(self, include_tracking=False):
        data = {
            'id': self.id,
            'loading_number': self.loading_number,
            'loading_date': self.loading_date.isoformat(),
            'vehicle_number': self.vehicle_number,
            'trailer_number': self.trailer_number,
            'driver_name': self.driver_name,
            'bill_of_lading': self.bill_of_lading,
            'declared_weight': self.declared_weight,
            'total_sacks': self.total_sacks,
            'status': self.status,
            'exporter': self.exporter.to_dict() if self.exporter else None,
            'project': self.project.to_dict() if self.project else None
        }
        
        if include_tracking:
            data['tracking_data'] = self.tracking_data or []
        
        return data
