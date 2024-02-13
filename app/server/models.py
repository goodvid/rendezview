from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

likes_table = db.Table('likes',
    db.Column('user_id', db.Integer, db.ForeignKey('user.userID'), primary_key=True),
    db.Column('post_id', db.Integer, db.ForeignKey('event.eventID'), primary_key=True)
)

class User(db.Model):
    userID = db.Column(db.Integer, primary_key = True)
    username = db.Column(db.String(50), unique=True)
    email = db.Column(db.String(50), unique=True)
    password = db.Column(db.String(50))
    picture = db.Column(db.String(50))
    friends = db.Column(db.String(1000))
    
   
    
    blogs = db.relationship('Blog', backref='blog', lazy=True)
    saved_events = db.relationship('Event', secondary=likes_table, lazy='subquery',
                                  backref=db.backref('events', lazy=True))
    private_events = db.relationship('PrivateEvent', backref='private_event', lazy=True)
    location = db.Column(db.String(50))
    preferences = db.Column(db.String(50))
    calendar = db.Column(db.String(50))
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class Event(db.Model):
    eventID = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String(50))
    location = db.Column(db.String(50))
    event_datetime = db.Column(db.DateTime)
    host = db.Column(db.String(50))
    rating = db.Column(db.Float)
    category = db.Column(db.String(50))
    
    
    

class Blog(db.Model):
    blogID = db.Column(db.Integer, primary_key = True)
    text = db.Column(db.String(5000))
    author = db.Column(db.Integer, db.ForeignKey('user.userID'), nullable=False)
    event = db.Column(db.Integer, db.ForeignKey('event.eventID'))
    time = db.Column(db.DateTime)

class PrivateEvent(db.Model):
    privateID = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String(50))
    location = db.Column(db.String(50))
    event_datetime = db.Column(db.DateTime)
    host = db.Column(db.Integer, db.ForeignKey('user.userID'), nullable=False)
    rating = db.Column(db.Float)
    category = db.Column(db.String(50))