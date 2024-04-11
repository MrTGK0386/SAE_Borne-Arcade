from flask import Flask
from flask_mysqldb import MySQL
import pandas as pd
import bcrypt

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
        cursor.execute("""GRANT SELECT, INSERT, UPDATE ON `arcade`.gamestats TO 'arcadeGames'@'localhost';""")
        cursor.execute("""GRANT SELECT (arcadeStatus) ON `arcade`.infoBorne TO 'arcadeGames'@'localhost';""")
        mysql.connection.commit()
        cursor.close()

def create_user_table():
    with app.app_context():
        cursor = mysql.connection.cursor()
        cursor.execute("""USE arcade;""")
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS infoBorne (
                name VARCHAR(255) NOT NULL,
                login VARCHAR(255) NOT NULL,
                password VARCHAR(255) NOT NULL,
                arcadeStatus tinyint(2) NOT NULL,
                gameUploadStatus tinyint(1) NOT NULL,
                runtime VARCHAR(255) NOT NULL
            )
        """)
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS games (
                id VARCHAR(255) PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                path VARCHAR(255) NOT NULL,
                launcherType VARCHAR(255) NOT NULL,
                playerNumber VARCHAR(255) NOT NULL,
                uploadDate tinyint(255) NOT NULL,
                status tinyint(2) NOT NULL
            )
        """)
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS gameStats (
                id VARCHAR(255) PRIMARY KEY,
                highScore_info_1 VARCHAR(255) NOT NULL,
                highScore_info_2 VARCHAR(255) NOT NULL,
                highScore_info_3 VARCHAR(255) NOT NULL,
                highScore_info_4 VARCHAR(255) NOT NULL,
                highScore_info_5 VARCHAR(255) NOT NULL,
                highScore_info_6 VARCHAR(255) NOT NULL,
                highScore_info_7 VARCHAR(255) NOT NULL,
                highScore_info_8 VARCHAR(255) NOT NULL,       
                total_time_played tinyint(255) NOT NULL
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
            print(row['password'])
            hashed_password = bcrypt.hashpw(row['password'].encode('utf-8'), bcrypt.gensalt(12))
            arcadeStatus = row['arcadeStatus']
            gameUploadStatus = row['gameUploadStatus']
            runtime = row['runtime']
            cursor.execute('INSERT INTO infoBorne (name, login, password, arcadeStatus, gameUploadStatus, runtime) VALUES (%s, %s, %s, %s, %s, %s)', (name, login, hashed_password, arcadeStatus, gameUploadStatus, runtime))
            mysql.connection.commit()
        cursor.close()

if __name__ == '__main__':
    create_database()  # Appeler la fonction pour créer la base de données et l'utilisateur
    create_demo_account()