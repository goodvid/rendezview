from flask import Flask
from flask_cors import CORS
from models import db
from app import app


with app.app_context():
    db.create_all()
    

    

   