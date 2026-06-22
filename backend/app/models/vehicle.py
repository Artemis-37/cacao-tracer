# Vehicle Model
from app import db
from datetime import datetime

class Vehicle(db.Model):
    __tablename__ = 'vehicles'
    
    id = db.Column(db.Integer, primary_key=True)
    cooperative_id = db.Column(db.Integer, db.ForeignKey('cooperatives.id'), nullable=False)
    registration_number = db.Column(db.String(50), unique=True, nullable=False)  # N° d'immatriculation
    vehicle_type = db.Column(db.String(50))  # Camion, Remorque, etc.
    driver_name = db.Column(db.String(255))
    driver_phone = db.Column(db.String(20))
    capacity_kg = db.Column(db.Float)  # Capacité en kg
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    cooperative = db.relationship('Cooperative', backref='vehicles')
    
    def to_dict(self):
        return {
            'id': self.id,
            'cooperative_id': self.cooperative_id,
            'registration_number': self.registration_number,
            'vehicle_type': self.vehicle_type,
            'driver_name': self.driver_name,
            'driver_phone': self.driver_phone,
            'capacity_kg': self.capacity_kg,
            'is_active': self.is_active
        }
