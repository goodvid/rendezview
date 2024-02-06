from flask import Flask
from flask_cors import CORS
from models import db
app = Flask(__name__)
CORS(app)


app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'

db.init_app(app)
    
with app.app_context():
    db.create_all()

    

   