# Producer Model
from app import db
from datetime import datetime

class Producer(db.Model):
    __tablename__ = 'producers'
    
    id = db.Column(db.Integer, primary_key=True)
    cooperative_id = db.Column(db.Integer, db.ForeignKey('cooperatives.id'), nullable=False)
    name = db.Column(db.String(255), nullable=False)
    phone = db.Column(db.String(20))
    email = db.Column(db.String(120))
    village = db.Column(db.String(255))
    latitude = db.Column(db.Float)
    longitude = db.Column(db.Float)
    estimated_production = db.Column(db.Float)  # kg
    production_delivered = db.Column(db.Float, default=0)  # kg déjà livré
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    cooperative = db.relationship('Cooperative', backref='producers')
    
    def get_remaining_production(self):
        """Retourner la production restante"""
        if self.estimated_production is None:
            return 0
        return max(0, self.estimated_production - self.production_delivered)
    
    def to_dict(self):
        return {
            'id': self.id,
            'cooperative_id': self.cooperative_id,
            'name': self.name,
            'phone': self.phone,
            'email': self.email,
            'village': self.village,
            'latitude': self.latitude,
            'longitude': self.longitude,
            'estimated_production': self.estimated_production,
            'production_delivered': self.production_delivered,
            'remaining_production': self.get_remaining_production(),
            'is_active': self.is_active
        }
