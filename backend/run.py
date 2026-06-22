from app import create_app, db
from app.models import (
    User, Cooperative, Campaign, HarvestSeason, 
    Producer, Exporter, Vehicle, Project
)
from datetime import datetime, timedelta

app = create_app()

with app.app_context():
    # Create tables
    db.create_all()
    
    # Initialize default data
    if not Cooperative.query.first():
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
        
        # Create admin user
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
        
        # Create campaign
        campaign = Campaign(
            cooperative_id=coop.id,
            name='2026/2027',
            start_date=datetime.now(),
            end_date=datetime.now() + timedelta(days=365),
            is_active=True
        )
        db.session.add(campaign)
        db.session.commit()
        
        # Create harvest seasons
        season1 = HarvestSeason(
            campaign_id=campaign.id,
            name='Grande Traite',
            type='grande_traite',
            start_date=datetime(2026, 10, 1),
            end_date=datetime(2027, 3, 31),
            delivery_percentage=70,
            is_active=True
        )
        season2 = HarvestSeason(
            campaign_id=campaign.id,
            name='Petite Traite',
            type='petite_traite',
            start_date=datetime(2027, 4, 1),
            end_date=datetime(2027, 9, 30),
            delivery_percentage=30,
            is_active=True
        )
        db.session.add_all([season1, season2])
        db.session.commit()
        
        # Create sample exporters
        exporter = Exporter(
            cooperative_id=coop.id,
            name='OFI (Olam Food Ingredients)',
            contact_person='Contact Person',
            phone='+225 22 00 00 00',
            email='ofi@olam.com',
            is_active=True
        )
        db.session.add(exporter)
        db.session.commit()
        
        # Create projects
        project = Project(
            exporter_id=exporter.id,
            name='Projet Standard',
            description='Projet standard de traçabilité',
            is_active=True
        )
        db.session.add(project)
        db.session.commit()
        
        print('Database initialized successfully!')

if __name__ == '__main__':
    app.run(debug=True)
