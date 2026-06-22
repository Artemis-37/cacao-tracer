# Project Model
from app import db
from datetime import datetime

class Project(db.Model):
    __tablename__ = 'projects'
    
    id = db.Column(db.Integer, primary_key=True)
    exporter_id = db.Column(db.Integer, db.ForeignKey('exporters.id'), nullable=False)
    name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    exporter = db.relationship('Exporter', backref='projects')
    
    def to_dict(self):
        return {
            'id': self.id,
            'exporter_id': self.exporter_id,
            'name': self.name,
            'description': self.description,
            'is_active': self.is_active
        }
