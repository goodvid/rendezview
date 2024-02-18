import redis
import os
basedir = os.path.abspath(os.path.dirname(__file__))
class ApplicationConfig:
    JWT_SECRET_KEY = "secretky"

    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ECHO = True
    SQLALCHEMY_DATABASE_URI = "sqlite:///" + os.path.join(
        basedir, "instance/database.db"
    )

    