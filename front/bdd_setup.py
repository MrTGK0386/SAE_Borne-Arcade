from flask import Flask
from flask_mysqldb import MySQL
import pandas as pd
import bcrypt, time, random

app = Flask(__name__)

# Configuration de la base de données MySQL
app.config['MYSQL_HOST'] = 'localhost'  # Mettez l'adresse de votre phpmyadmin
app.config['MYSQL_USER'] = 'root'  # Mettez le nom d'utilisateur de votre phpmyadmin
app.config['MYSQL_PASSWORD'] = 'root'  # Mettez le mot de passe de votre phpmyadmin
# app.config['']
mysql = MySQL(app)

def create_database():
    with app.app_context():
        cursor = mysql.connection.cursor()
        cursor.execute("""CREATE DATABASE IF NOT EXISTS arcade;""")
        cursor.execute("""USE arcade;""")
        cursor.execute("""CREATE USER IF NOT EXISTS 'admin'@'localhost' IDENTIFIED BY 'admin';""")
        cursor.execute("""GRANT ALL PRIVILEGES ON arcade.* TO 'admin'@'localhost';""")
        cursor.execute("""CREATE USER IF NOT EXISTS 'arcadeGames'@'localhost' IDENTIFIED BY 'arcadeGames';""")
        create_user_table()
        cursor.execute("""GRANT SELECT ON `arcade`.games TO 'arcadeGames'@'localhost';""")
        cursor.execute("""GRANT SELECT (arcadeStatus) ON `arcade`.infoBorne TO 'arcadeGames'@'localhost';""")
        mysql.connection.commit()
        cursor.close()

def create_user_table():
    with app.app_context():
        cursor = mysql.connection.cursor()
        cursor.execute("""USE arcade;""")
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS infoBorne (
                name VARCHAR(255) PRIMARY KEY,
                login VARCHAR(255) NOT NULL,
                password VARCHAR(255) NOT NULL,
                arcadeStatus tinyint(2) NOT NULL,
                gameUploadStatus tinyint(1) NOT NULL,
                runtime VARCHAR(255) NOT NULL
            )
        """)
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS games (
                name VARCHAR(255) PRIMARY KEY,
                version VARCHAR(255),
                description TEXT,
                creator_name TEXT,
                path VARCHAR(255) NOT NULL,
                gitRepo VARCHAR(255),
                launcherType VARCHAR(255) NOT NULL,
                playerNumber VARCHAR(255) NOT NULL,
                uploadDate int NOT NULL,
                status tinyint(2) NOT NULL,
                total_time_played int NULL
            )
        """)
        mysql.connection.commit()
        cursor.close()

def create_demo_account():
    with app.app_context():

        data = {
            'name': ['Borne de démo'],
            'login': ['root'],
            'password': ['root'],
            'arcadeStatus': [2],
            'gameUploadStatus': [True],
            'runtime': ['17896221'],
        }
        df = pd.DataFrame(data)

        cursor = mysql.connection.cursor()
        cursor.execute("""USE arcade;""")
        for index, row in df.iterrows(): # Notez l'utilisation de 'index, row'
            name = row['name']
            login = row['login']
            hashed_password = bcrypt.hashpw(row['password'].encode('utf-8'), bcrypt.gensalt(12))
            arcadeStatus = row['arcadeStatus']
            gameUploadStatus = row['gameUploadStatus']
            runtime = row['runtime']
            cursor.execute('INSERT INTO infoBorne (name, login, password, arcadeStatus, gameUploadStatus, runtime) VALUES (%s, %s, %s, %s, %s, %s)', (name, login, hashed_password, arcadeStatus, gameUploadStatus, runtime))
            mysql.connection.commit()
        cursor.close()

def create_demo_games():
    with app.app_context():

        data = {
            'name': ["Super Mario", "The Legend of Zelda", "Minecraft", "Tetris", "FIFA", "Call of Duty", "Fortnite", "Pokemon", "Grand Theft Auto", "League of Legends", "Assassin's Creed", "Overwatch", "Fallout", "Counter-Strike", "Rocket League", "Donkey Kong"],
            'version': ['1.0','2.1', '1.18', '1.0', '1.0', '1.0', '1.0', '1.0', '1.0', '1.0', '1.0', '1.0', '1.0', '1.0', '1.0', '1.0'],
        }
        df = pd.DataFrame(data)

        cursor = mysql.connection.cursor()
        cursor.execute("""USE arcade;""")
        for index, row in df.iterrows(): # Notez l'utilisation de 'index, row'
            name = row['name'],
            version = row['version']
            path = "root",
            gitRepo = "root",
            launcherType = "phaser",
            playerNumber = 0,
            uploadDate = int(time.time()),
            status = 2
            total_time_played = get_random_time_elapsed()
            cursor.execute('INSERT INTO games (name,version, path, gitRepo, launcherType, playerNumber, uploadDate, status, total_time_played) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)', (name, version, path, gitRepo, launcherType, playerNumber, uploadDate, status, total_time_played))
            mysql.connection.commit()
        cursor.close()

def get_random_time_elapsed():
    current_time = int(time.time()) -1712848361 - random.randint(-3000, 0)
    return current_time


if __name__ == '__main__':
    create_database()  # Appeler la fonction pour créer la base de données et l'utilisateur
    create_demo_account()
    # create_demo_games()