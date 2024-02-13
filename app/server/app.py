from flask import Flask,  request, jsonify, redirect,url_for
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user
from models import db  # Importing the db instance and models
from flask_cors import CORS
from models import User
import os


app = Flask(__name__)
CORS(app)
app.secret_key = '2024#1865'
basedir = os.path.abspath(os.path.dirname(__file__))

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'instance/database.db')  # or your actual database URI
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'
db.init_app(app)  # Initialize db with your Flask app

@app.route('/')
def index():
    return "Hello, World!"


@app.route('/set-username', methods=['POST'])
def receive_data():
    #if request.is_json:
        data = request.get_json()
        print("Received data:", data)  # For demonstration, print it to the console
        #send to database
        #item = User(name=current_user, username = data) TODO fix getting current user
        return jsonify({"message": "Data received successfully", "yourData": data}), 200

@app.route('/login', methods=['GET', 'POST'])
def login():
    print(request.json)
    data = request.json
    username = data.get('name')
    password = data.get('password')
    if request.method == 'POST':
        # username = request.form['username']
        # password = request.form['password']
        user = User.query.filter_by(username=username).first()
        if 3 > 2: #TODO add proper login
            #login_user(user)
            print("hehehehe")
            return jsonify({"success": True, "redirectUrl": "/testpage"})
            #return jsonify({"message": "Login successful", "username": username})

        else:
            print("errr")
            return 'Invalid username or password'
    # Here, add your authentication logic
    # For demonstration, let's assume the login is always successful
    #return jsonify({"message": "Login successful", "username": username})

if __name__ == '__main__':
    app.run(debug=True)
