# Backend initialization script
from run import app, db
from app.models import (
    User, Cooperative, Campaign, HarvestSeason,
    Producer, Exporter, Vehicle, Project
)
from datetime import datetime, timedelta

with app.app_context():
    # Drop all tables and recreate
    db.drop_all()
    db.create_all()
    
    print('Creating cooperative...')
    coop = Cooperative(
        name='Cacao Tracer Cooperative',
        acronym='CTC',
        location='Abidjan, Côte dà d’Ivoire',
        email='contact@cacao-tracer.local',
        phone='+225 22 20 20 20',
        website='www.cacao-tracer.local'
    )
    db.session.add(coop)
    db.session.commit()
    
    print('Creating admin user...')
    admin = User(
        email='admin@cacao-tracer.local',
        username='admin',
        first_name='Admin',
        last_name='User',
        role='admin',
        is_active=True
    )
    admin.set_password('Admin@123')
    db.session.add(admin)
    db.session.commit()
    
    print('Database initialization complete!')
