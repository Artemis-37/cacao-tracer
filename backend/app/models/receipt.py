# Receipt Model
from app import db
from datetime import datetime

class Receipt(db.Model):
    __tablename__ = 'receipts'
    
    id = db.Column(db.Integer, primary_key=True)
    cooperative_id = db.Column(db.Integer, db.ForeignKey('cooperatives.id'), nullable=False)
    receipt_number = db.Column(db.String(50), unique=True, nullable=False, index=True)
    producer_id = db.Column(db.Integer, db.ForeignKey('producers.id'), nullable=False)
    weight_received = db.Column(db.Float, nullable=False)  # kg
    sacks_received = db.Column(db.Integer, nullable=False)
    receipt_date = db.Column(db.DateTime, default=datetime.utcnow)
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    cooperative = db.relationship('Cooperative', backref='receipts')
    producer = db.relationship('Producer', backref='receipts')
    
    def to_dict(self):
        return {
            'id': self.id,
            'receipt_number': self.receipt_number,
            'producer': self.producer.to_dict() if self.producer else None,
            'weight_received': self.weight_received,
            'sacks_received': self.sacks_received,
            'receipt_date': self.receipt_date.isoformat(),
            'notes': self.notes
        }
