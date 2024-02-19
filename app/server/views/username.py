# file to set username after registration
import app 
from flask import   request, jsonify
#from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user


@app.route('/set-username', methods=['POST'])
def receive_data():
    #if request.is_json:
        data = request.get_json()
        print("Received data:", data)  # For demonstration, print it to the console
        #send to database
        # Process your data here as needed
        # For example, you might store it in a database or perform some calculations

        return jsonify({"message": "Data received successfully", "yourData": data}), 200
    # else:
    #     app.logger.info("rghgt", data, type(data))
        return jsonify({"error": "Request must be JSON"}), 400