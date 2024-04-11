from flask import Flask, render_template, redirect
import mysql.connector

app = Flask(__name__)


def test_db_connection():
    try:
        conn = mysql.connector.connect(
            host='localhost',
            user='root',
            password='root',
            port = 3307
        )
        conn.ping(reconnect=True)
        conn.close()
        return True
    except mysql.connector.Error as e:
        print("Erreur de connexion au serveur MySQL:", e)
        return False

@app.route('/')
def index():
    return render_template("index.html")

@app.route('/test')
def test():
    if test_db_connection():
        return "La connexion au serveur MySQL est établie avec succès!"
    else:
        return "Erreur lors de la connexion au serveur MySQL."

if (test_db_connection() == True):
    print("Connexion réussie")

if __name__ == '__main__':
    app.run(debug=True, host = '0.0.0.0', port='5000')
