# Cooperative Model
from app import db
from datetime import datetime

class Cooperative(db.Model):
    __tablename__ = 'cooperatives'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    acronym = db.Column(db.String(50), unique=True, nullable=False)
    logo_path = db.Column(db.String(255))
    location = db.Column(db.String(255))
    phone = db.Column(db.String(20))
    email = db.Column(db.String(120))
    website = db.Column(db.String(255))
    description = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'acronym': self.acronym,
            'logo_path': self.logo_path,
            'location': self.location,
            'phone': self.phone,
            'email': self.email,
            'website': self.website,
            'description': self.description
        }
