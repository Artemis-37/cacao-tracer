# Exporter Model
from app import db
from datetime import datetime

class Exporter(db.Model):
    __tablename__ = 'exporters'
    
    id = db.Column(db.Integer, primary_key=True)
    cooperative_id = db.Column(db.Integer, db.ForeignKey('cooperatives.id'), nullable=False)
    name = db.Column(db.String(255), nullable=False, unique=True)
    logo_path = db.Column(db.String(255))
    contact_person = db.Column(db.String(255))
    phone = db.Column(db.String(20))
    email = db.Column(db.String(120))
    address = db.Column(db.Text)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    cooperative = db.relationship('Cooperative', backref='exporters')
    
    def to_dict(self):
        return {
            'id': self.id,
            'cooperative_id': self.cooperative_id,
            'name': self.name,
            'logo_path': self.logo_path,
            'contact_person': self.contact_person,
            'phone': self.phone,
            'email': self.email,
            'address': self.address,
            'is_active': self.is_active
        }
