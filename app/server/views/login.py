from app import login_manager
from models import User
import app 
from flask import   request, jsonify
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user
from flask import render_template, request, redirect, url_for
@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

@app.route('/login', methods=['GET', 'POST'])
def login():
    print(request)
    data = request.json
    username = data.get('name')
    password = data.get('password')
    # Here, add your authentication logic
    # For demonstration, let's assume the login is always successful
    return jsonify({"message": "Login successful", "username": username})

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('login'))

