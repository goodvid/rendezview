from flask import Flask, request, jsonify
from models import db, User, Event, Blog, PrivateEvent  # Importing the db instance and models

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'  # or your actual database URI
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)  # Initialize db with your Flask app

@app.route('/')
def index():
    return "Hello, World!"

@app.route('/user/register', methods=["POST"])
def register():
    data = request.json

    email = data['email']
    password = data['password']

    print(email)
    print(password)

    id = 1

    while (db.query("select * from users where userID=" + str(id)) != None):
        id += 1

    db.query("insert into users values (" + str(id)
                + "," + email
                + "," + email
                + "," + password
                + "," + "None"
                + "," + "None"
                + "," + "None"
                + "," + "None"
                + "," + "None"
                + "," + "None"
                + "," + "None"
                + "," + "None" + ")")

    return {'200': 'success'}

@app.route('/user/login', methods=["POST"])
def login():
    data = request.json

    email = data['email']
    password = data['password']

    res = db.execute('select * from USERS where email=' + email + ' AND password=' + password + ';')

    return {'200': email + " " + password}

if __name__ == '__main__':
    app.run(debug=True)
