# Loading Allocation Model
from app import db
from datetime import datetime

class LoadingAllocation(db.Model):
    __tablename__ = 'loading_allocations'
    
    id = db.Column(db.Integer, primary_key=True)
    loading_id = db.Column(db.Integer, db.ForeignKey('loadings.id'), nullable=False)
    producer_id = db.Column(db.Integer, db.ForeignKey('producers.id'), nullable=False)
    allocated_weight = db.Column(db.Float, nullable=False)  # Poids alloué (kg)
    allocated_sacks = db.Column(db.Integer, nullable=False)  # Nombre de sacs alloués
    weight_per_sack = db.Column(db.Float)  # Poids moyen par sac
    delivery_date = db.Column(db.DateTime)  # Date de livraison prévue
    status = db.Column(db.String(20), default='allocated')  # allocated, delivered, failed
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    loading = db.relationship('Loading', backref='allocations')
    producer = db.relationship('Producer', backref='allocations')
    
    def to_dict(self):
        return {
            'id': self.id,
            'loading_id': self.loading_id,
            'producer': self.producer.to_dict() if self.producer else None,
            'allocated_weight': self.allocated_weight,
            'allocated_sacks': self.allocated_sacks,
            'weight_per_sack': self.weight_per_sack,
            'delivery_date': self.delivery_date.isoformat() if self.delivery_date else None,
            'status': self.status
        }
