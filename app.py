from flask import Flask, request, jsonify
from flask_jwt_extended import (
    JWTManager, jwt_required, create_access_token,
    jwt_required, create_refresh_token,
    get_jwt_identity, get_jwt, set_access_cookies, unset_jwt_cookies,
    set_refresh_cookies
)
import pyrebase
import requests
import os
from flask_cors import CORS, cross_origin
import json
import redis
import time
from datetime import timedelta
from datetime import timezone
from datetime import datetime

ACCESS_EXPIRES = timedelta(hours=1)

app = Flask(__name__)
CORS(app)

config = {
    "apiKey": os.getenv("FIREBASE_API_KEY"),
    "authDomain": os.getenv("FIREBASE_AUTH_DOMAIN"),
    "databaseURL": os.getenv("FIREBASE_DATABASE_URL"),
    "storageBucket": os.getenv("FIREBASE_STORAGE_BUCKET")
}

firebase = pyrebase.initialize_app(config)
auth = firebase.auth()
db = firebase.database()
app.secret_key = os.getenv("SECRET_KEY")

# Setup the Flask-JWT-Extended extension
app.config['JWT_SECRET_KEY'] = os.getenv("JWT_SECRET_KEY")  # Change this!
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = ACCESS_EXPIRES
app.config["JWT_TOKEN_LOCATION"] = ["cookies"]
app.config["JWT_COOKIE_SECURE"] = False

app.config['JWT_ACCESS_COOKIE_PATH'] = '/api/'
app.config['JWT_COOKIE_CSRF_PROTECT'] = True
app.config['JWT_CSRF_CHECK_FORM'] = True

jwt = JWTManager(app)


@app.after_request
def refresh_expiring_jwts(response):
    try:
        exp_timestamp = get_jwt()["exp"]
        now = datetime.now(timezone.utc)
        target_timestamp = datetime.timestamp(now + timedelta(minutes=30))
        if target_timestamp > exp_timestamp:
            access_token = create_access_token(identity=get_jwt_identity())
            set_access_cookies(response, access_token)
        return response
    except (RuntimeError, KeyError):
        # Case where there is not a valid JWT. Just return the original respone
        return response


@app.route("/api/register", methods=["POST"])
@cross_origin()
def register():
    if not request.is_json:
        return jsonify({"msg": "Missing JSON in request"}), 400

    email = request.json.get('email', None)
    password = request.json.get('password', None)
    first_name = request.json.get('first_name', None)
    last_name = request.json.get('last_name', None)
    hall_name = request.json.get('hall_name', None)

    if not email:
        return jsonify({"msg": "Missing email parameter"}), 400
    if not password:
        return jsonify({"msg": "Missing password parameter"}), 400
    if not first_name:
        return jsonify({"msg": "Missing First Name parameter"}), 400
    if not last_name:
        return jsonify({"msg": "Missing Last Name parameter"}), 400
    if not hall_name:
        return jsonify({"msg": "Missing Hall name parameter"}), 400

    try:
        auth.create_user_with_email_and_password(email, password)
        user = auth.sign_in_with_email_and_password(email, password)
    except Exception as e:
        error_json = e.args[1]
        error = json.loads(error_json)['error']['message']
        return jsonify({"msg": error}), 400

    # create tokens
    id = user['localId']

    try:
        db.child("users").child(id).set(
            {"first_name": first_name, "last_name": last_name, "hall_name": hall_name})
    except:
        return jsonify({"msg": "Error signing up"}), 400

    access_token = create_access_token(identity=id)
    refresh_token = create_refresh_token(identity=id)
    response = jsonify({"msg": "Successfully signed up"})
    set_access_cookies(response, access_token)
    set_refresh_cookies(response, refresh_token)

    return response, 200


@app.route('/api/login', methods=['POST'])
@cross_origin()
def login():
    if not request.is_json:
        return jsonify({"msg": "Missing JSON in request"}), 400

    email = request.json.get('email', None)
    password = request.json.get('password', None)
    if not email:
        return jsonify({"msg": "Missing email parameter"}), 400
    if not password:
        return jsonify({"msg": "Missing password parameter"}), 400

    # Log the user in
    try:
        user = auth.sign_in_with_email_and_password(email, password)
    except Exception as e:
        error_json = e.args[1]
        error = json.loads(error_json)['error']['message']
        return jsonify({"msg": error}), 400

    # create tokens
    id = user['localId']
    access_token = create_access_token(identity=id)
    refresh_token = create_refresh_token(identity=id)
    response = jsonify({"msg": "Successfully signed in"})
    set_access_cookies(response, access_token)
    set_refresh_cookies(response, refresh_token)
    return response, 200


@app.route("/api/forgotpassword", methods=["POST"])
@cross_origin()
def forgot_password():
    if not request.is_json:
        return jsonify({"msg": "Missing JSON in request"}), 400

    email = request.json.get('email', None)
    if not email:
        return jsonify({"msg": "Missing email parameter"}), 400

    try:
        auth.send_password_reset_email(email)
    except Exception as e:

        error_json = e.args[1]
        error = json.loads(error_json)['error']['message']
        return jsonify({"msg": error}), 400

    return jsonify({"msg": "Password reset email sent successfully"}), 200


@app.route('/', methods=['GET'])
def home():
    return "<h1>Hello World</h1>"


@app.route('/api/user', methods=['GET'])
@cross_origin()
@jwt_required()
def user():
    try:
        current_user = get_jwt_identity()
        try:
            user_details = db.child("users").child(current_user).get()
            return jsonify({"currentUser": current_user, "firstName": user_details.val()['first_name'], "lastName": user_details.val()['last_name'], "hallName": user_details.val()['hall_name']}), 200
        except Exception as e:
            return jsonify({"msg": e}), 400
    except Exception as e:
        print(e)
        return jsonify({"msg": e}), 400


@app.route("/api/logout", methods=["DELETE"])
@cross_origin()
def logout():
    response = jsonify({"msg": "Successfully logged out"})
    unset_jwt_cookies(response)
    return response, 200


@app.route("/api/venues/addvenue", methods=["POST"])
@cross_origin()
def api_addvenue():
    try:
        if "secretKey" in request.form:
            if request.form["secretKey"] == app.secret_key:
                name = request.form["name"]
                max_capacity = int(request.form["max_capacity"])
                occupant = 0
                blk = request.form["blk"]
                created_at = time.time()
                hall_name = request.form["hall_name"]

                if created_at and max_capacity and name and blk and hall_name:
                    try:
                        data = {
                            "name": name,
                            "max_capacity": max_capacity,
                            "occupant": occupant,
                            "blk": blk,
                            "hall_name": hall_name,
                            "created_at": created_at
                        }
                        db.child("venues").child(
                            hall_name).child(blk).push(data)
                        return jsonify({"msg": "Sucessfully added venue"}), 400
                    except Exception as e:
                        return jsonify({"msg": e}), 400
                else:
                    return jsonify({"msg": "Missing parameters"}), 400
            else:
                return jsonify({"msg": "User not authenticated"}), 403
        else:
            return jsonify({"msg": "User not authenticated"}), 403
    except Exception as e:
        print(e)
        return jsonify({"msg": e}), 400


@app.route("/api/venues/<hall_name>/<block>", methods=["GET"])
@cross_origin()
@jwt_required()
def api_venues(hall_name, block):
    try:
        venues = db.child("venues").child(hall_name).child(block).get()
        output = []
        for p in venues.each():
            try:
                output.append(
                    {
                        "id": p.key(),
                        "name": p.val()["name"],
                        "blk": p.val()["blk"],
                        "max_capacity": p.val()["max_capacity"],
                        "occupant": p.val()["occupant"],
                        "blk": p.val()["blk"],
                        "created_at": p.val()["created_at"],
                        "occupant_list": p.val()["occupant_list"]
                    }
                )
            except:
                output.append(
                    {
                        "id": p.key(),
                        "name": p.val()["name"],
                        "blk": p.val()["blk"],
                        "max_capacity": p.val()["max_capacity"],
                        "occupant": p.val()["occupant"],
                        "blk": p.val()["blk"],
                        "created_at": p.val()["created_at"]
                    }
                )
        return jsonify({"data": output, "jwt": (get_jwt() or {}).get("csrf")}), 200
    except Exception as e:
        print(e)
        return jsonify({"msg": "No facilities found"}), 200


@app.route("/api/venues/<hall_name>", methods=["GET"])
@cross_origin()
@jwt_required()
def api_blocks(hall_name):
    try:
        venues = db.child("venues").child(hall_name).get()
        output = []
        for p in venues.each():
            if p.key() != 'hall':
                output.append(
                    {
                        "id": p.key()
                    }
                )
        return jsonify(output), 200
    except:
        return jsonify({"msg": "No blocks found"}), 200


@app.route("/api/venues/checkin", methods=["POST"])
@cross_origin()
@jwt_required()
def api_check_in():
    occupant_id = request.form["occupant_id"]
    venue_id = request.form["venue_id"]
    hall = request.form["hall_name"]
    blk = request.form["blk_name"]
    if occupant_id and venue_id:
        try:
            current_occupant = db.child("venues").child(hall).child(blk).child(venue_id).child(
                "occupant").get()

            db.child("venues").child(hall).child(blk).child(venue_id).child(
                "occupant").set(current_occupant.val() + 1)

            occupant_list = db.child("venues").child(hall).child(blk).child(venue_id).child(
                "occupant_list").get().val()

            if occupant_list is None:
                occupant_list = []

            occupant_list.append(occupant_id)

            db.child("venues").child(hall).child(blk).child(venue_id).child(
                "occupant_list").set(occupant_list)

            return jsonify({"msg": "Succesfully checked in"}), 200
        except Exception as e:
            print(e)
            return jsonify({"msg": "Error checking in"}), 400
    else:
        return jsonify({"msg": "Missing parameters"}), 400


@app.route("/api/venues/checkout", methods=["POST"])
@cross_origin()
@jwt_required()
def api_check_out():
    occupant_id = request.form["occupant_id"]
    venue_id = request.form["venue_id"]
    hall = request.form["hall_name"]
    blk = request.form["blk_name"]
    if occupant_id and venue_id:
        try:
            current_occupant = db.child("venues").child(hall).child(blk).child(venue_id).child(
                "occupant").get()

            db.child("venues").child(hall).child(blk).child(venue_id).child(
                "occupant").set(current_occupant.val() - 1)

            occupant_list = db.child("venues").child(hall).child(blk).child(venue_id).child(
                "occupant_list").get().val()

            occupant_list.remove(occupant_id)

            db.child("venues").child(hall).child(blk).child(venue_id).child(
                "occupant_list").set(occupant_list)

            return jsonify({"msg": "Succesfully checked out"}), 200
        except Exception as e:
            print(e)
            return jsonify({"msg": "Error checking out"}), 400
    else:
        return jsonify({"msg": "Missing parameters"}), 400


if __name__ == "__main__":
    app.run()
