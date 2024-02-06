from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()
friends_association = db.Table('friends',
    db.Column('friend_a_id', db.Integer, db.ForeignKey('user.userID'), primary_key=True),
    db.Column('friend_b_id', db.Integer, db.ForeignKey('user.userID'), primary_key=True)
)


class User(db.Model):
    userID = db.Column(db.Integer, primary_key = True)
    username = db.Column(db.String(50), unique=True)
    email = db.Column(db.String(50), unique=True)
    password = db.Column(db.String(50))
    picture = db.Column(db.String(50))
    friends = db.relationship('User', 
                              secondary=friends_association, 
                              primaryjoin=(friends_association.c.friend_a_id == id), 
                              secondaryjoin=(friends_association.c.friend_b_id == id),
                              backref=db.backref('added_friends', lazy='dynamic'),
                              lazy='dynamic')
    
    blogs = db.relationship('Blog', backref='blogs', lazy=True)
    events = db.relationship('Event', backref='event', lazy=True)
    private_events = db.relationship('PrivateEvent', backref='private', lazy=True)
    location = db.Column(db.String(50))
    preferences = db.Column(db.String(50))
    calendar = db.Column(db.String(50))

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
    author = db.relationship('User', backref='user', lazy=True)
    event = db.relationship('Event', backref='event', lazy=True)
    time = db.Column(db.DateTime)

class PrivateEvent(db.Model):
    privateID = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String(50))
    location = db.Column(db.String(50))
    event_datetime = db.Column(db.DateTime)
    host = db.relationship('User', backref='user', lazy=True)
    rating = db.Column(db.Float)
    category = db.Column(db.String(50))