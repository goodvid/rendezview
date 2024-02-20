from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

events_table = db.Table('user_events',
    db.Column('user_id', db.Integer, db.ForeignKey('user.id'), primary_key=True),
    db.Column('event_id', db.Integer, db.ForeignKey('event.eventID'), primary_key=True)
)

class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key = True)
    email = db.Column(db.String, unique=True)
    username = db.Column(db.String(50), unique=True)
    password = db.Column(db.String(50))
    picture = db.Column(db.String(50))
    friends = db.Column(db.String(1000))

    blogs = db.relationship('Blog', backref='blog', lazy=True)
    saved_events = db.relationship(
        "Event",
        secondary=events_table,
        lazy="subquery",
        backref=db.backref("events", lazy=True),
    )
    #private_events = db.relationship('PrivateEvent', backref='private_event', lazy=True)
    location = db.Column(db.String(50))
    preferences = db.Column(db.String(50))
    calendar = db.Column(db.String(50))
    def set_password(self, passwrd):
        self.password = generate_password_hash(passwrd)

    def check_password(self, check):
        return check_password_hash(self.password, check)

    def is_authenticated(self):
        return True

    def is_active(self):
        return True

    def is_anonymous(self):
        return False

    def get_id(self):
        return str(self.id)


class Event(db.Model):
    
    eventID = db.Column(db.Integer, primary_key = True)
    desc = db.Column(db.String(500))
    name = db.Column(db.String(50))
    location = db.Column(db.String(50))
    event_datetime = db.Column(db.DateTime)
    hostName = db.Column(db.String(50))
    userID = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=True)
    rating = db.Column(db.Float)
    category = db.Column(db.String(50))

    type = db.Column(db.String(50))
    def as_dict(self):
        return {
            'eventID': self.eventID,
            'desc': self.desc,
            'name': self.name,
            'location': self.location,
            'event_datetime': self.event_datetime,
            'hostName' : self.hostName,
            'userID': self.userID,
            'rating' : self.rating,
            'category': self.category,
            'type': self.type
        }

class Blog(db.Model):
    blogID = db.Column(db.Integer, primary_key = True)
    text = db.Column(db.String(5000))
    author = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    event = db.Column(db.Integer, db.ForeignKey('event.eventID'))
    time = db.Column(db.DateTime)