from config.config import MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DB, SECRET_KEY
from flask import Flask, render_template, request, redirect, session
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import text
from random import randint
import bcrypt

app = Flask(__name__)
app.secret_key = SECRET_KEY
app.config['SQLALCHEMY_DATABASE_URI'] = f'mysql+mysqlconnector://{MYSQL_USER}:{MYSQL_PASSWORD}@{MYSQL_HOST}/{MYSQL_DB}'
db = SQLAlchemy(app)

class infoborne(db.Model):
    name = db.Column(db.String(255), primary_key=True)
    login = db.Column(db.String(255), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    arcadeStatus = db.Column(db.SmallInteger, nullable=False)
    gameUploadStatus = db.Column(db.Boolean, nullable=False)
    runtime = db.Column(db.String(255), nullable=False)

class games(db.Model):
    name = db.Column(db.String(255), primary_key=True)
    path = db.Column(db.String(255), nullable=False)
    gitRepo = db.Column(db.String(255), nullable=True)
    launcherType =db.Column(db.String(255), nullable=False)
    playerNumber = db.Column(db.String(255), nullable=False)
    uploadDate = db.Column(db.Integer, nullable=False)
    status = db.Column(db.SmallInteger, nullable=False)
    total_time_played = db.Column(db.Integer, nullable=True)

@app.route('/', methods=['GET', 'POST'])
def login():
    if 'loggedin' in session:
        return redirect('/dashboard') 
    if request.method == 'POST':
        login = request.form['login']
        password = request.form['password']
        user = infoborne.query.filter_by(login=login).first()
        if user:
            if bcrypt.checkpw(password.encode('utf-8'), user.password.encode('utf-8')):
                session['loggedin'] = True
                return redirect('dashboard')
            else:
                error_message =  'Mot de passe incorecte'
                arcadeName = infoborne.query.with_entities(infoborne.name).first()[0]
                return render_template('login.html', error_message=error_message, arcadeName=arcadeName)
        else:
            error_message =  'Mot de passe incorecte'
            arcadeName = infoborne.query.with_entities(infoborne.name).first()[0]
            return render_template('login.html', error_message=error_message, arcadeName=arcadeName)
    arcadeName = infoborne.query.with_entities(infoborne.name).first()[0]
    return render_template('login.html', arcadeName=arcadeName)

@app.route('/logout')
def logout():
    session.pop('loggedin', None)
    return redirect("/")

@app.route('/dashboard')

def dashboard():
    if 'loggedin' not in session:
        return redirect('/') 
    arcadeStatus = infoborne.query.with_entities(infoborne.arcadeStatus).first()[0]
    gameUploadStatus = infoborne.query.with_entities(infoborne.gameUploadStatus).first()[0]
    top_five_games = games.query.order_by(games.total_time_played.desc()).limit(10).all()
    for game in top_five_games:
        game.formatted_duration = format_duration(game.total_time_played)


    CHECKED_SVG = """<svg width="125" height="125" viewBox="0 0 125 125" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M62.5 0C27.9824 0 0 27.9824 0 62.5C0 97.0195 27.9824 125 62.5 125C97.0195 125 125 97.0195 125 62.5C125 27.9824 97.0195 0 62.5 0ZM62.5 117.311C32.3457 117.311 7.8125 92.6543 7.8125 62.4998C7.8125 32.3455 32.3457 7.81226 62.5 7.81226C92.6543 7.81226 117.188 32.3456 117.188 62.4998C117.188 92.6539 92.6543 117.311 62.5 117.311ZM87.4434 39.6309L50.7733 76.5312L34.2596 60.0176C32.7343 58.4922 30.2616 58.4922 28.7343 60.0176C27.2089 61.543 27.2089 64.0156 28.7343 65.541L48.0682 84.877C49.5936 86.4004 52.0663 86.4004 53.5936 84.877C53.7694 84.7012 53.9199 84.5096 54.0566 84.3105L92.9707 45.1561C94.4941 43.6307 94.4941 41.1581 92.9707 39.6309C91.4434 38.1055 88.9707 38.1055 87.4434 39.6309Z" fill="#4ECB71"/></svg>"""
    STOPPED_SVG = """<svg width="125" height="125" viewBox="0 0 125 125" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M0 62.5C0 45.924 6.5848 30.0268 18.3058 18.3058C30.0268 6.5848 45.924 0 62.5 0C79.076 0 94.9731 6.5848 106.694 18.3058C118.415 30.0268 125 45.924 125 62.5C125 79.076 118.415 94.9731 106.694 106.694C94.9731 118.415 79.076 125 62.5 125C45.924 125 30.0268 118.415 18.3058 106.694C6.5848 94.9731 0 79.076 0 62.5ZM62.5 8.96497C48.3016 8.96497 34.6848 14.6053 24.645 24.645C14.6053 34.6848 8.96497 48.3016 8.96497 62.5C8.96497 76.6984 14.6053 90.3152 24.645 100.355C34.6848 110.395 48.3016 116.035 62.5 116.035C76.6984 116.035 90.3152 110.395 100.355 100.355C110.395 90.3152 116.035 76.6984 116.035 62.5C116.035 48.3016 110.395 34.6848 100.355 24.645C90.3152 14.6053 76.6984 8.96497 62.5 8.96497ZM84.7143 40.2952C85.5988 41.18 86.0957 42.3799 86.0957 43.6311C86.0957 44.8822 85.5988 46.0822 84.7143 46.967L69.1718 62.5L84.7143 78.033C85.6002 78.919 86.098 80.1206 86.098 81.3736C86.098 82.6266 85.6002 83.8283 84.7143 84.7143C83.8283 85.6002 82.6266 86.098 81.3736 86.098C80.1206 86.098 78.919 85.6002 78.033 84.7143L62.5 69.1718L46.967 84.7143C46.5283 85.153 46.0075 85.5009 45.4343 85.7384C44.8611 85.9758 44.2468 86.098 43.6264 86.098C43.006 86.098 42.3916 85.9758 41.8184 85.7384C41.2453 85.5009 40.7244 85.153 40.2857 84.7143C39.847 84.2756 39.4991 83.7547 39.2616 83.1816C39.0242 82.6084 38.902 81.994 38.902 81.3736C38.902 80.7532 39.0242 80.1389 39.2616 79.5657C39.4991 78.9925 39.847 78.4717 40.2857 78.033L55.8282 62.5L40.2857 46.967C39.3998 46.081 38.902 44.8794 38.902 43.6264C38.902 42.3734 39.3998 41.1717 40.2857 40.2857C41.1717 39.3998 42.3734 38.902 43.6264 38.902C44.8794 38.902 46.081 39.3998 46.967 40.2857L62.5 55.8282L78.033 40.2857C78.4713 39.8463 78.992 39.4977 79.5652 39.2598C80.1385 39.022 80.753 38.8995 81.3736 38.8995C81.9942 38.8995 82.6088 39.022 83.182 39.2598C83.7553 39.4977 84.276 39.8558 84.7143 40.2952Z" fill="#F24E1E"/></svg>"""
    if arcadeStatus == 0:
        arcade_status_svg = STOPPED_SVG
        arcade_status_text = "Borne à l'arrêt"
    elif arcadeStatus == 1:
        arcade_status_svg = """<svg width="126" height="126" viewBox="0 0 126 126" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M92.6594 109.847L84.6733 117.833C82.7057 119.801 80.2751 120.815 77.3816 120.875C74.4881 120.935 71.9997 119.921 69.9164 117.833C67.9488 115.866 66.965 113.407 66.965 110.458C66.965 107.509 67.9488 105.049 69.9164 103.076L77.9025 95.0902C77.4395 93.8171 77.0923 92.4861 76.8608 91.0972C76.6293 89.7083 76.5136 88.3194 76.5136 86.9305C76.5136 80.2176 78.8863 74.4884 83.6316 69.743C88.377 64.9977 94.1061 62.625 100.819 62.625C101.861 62.625 102.902 62.6551 103.944 62.7153C104.986 62.7754 105.969 62.9768 106.895 63.3194C108.169 63.7824 108.951 64.7384 109.243 66.1875C109.534 67.6366 109.215 68.8217 108.284 69.743L100.819 77.2083C99.4302 78.5972 98.7357 80.2176 98.7357 82.0694C98.7357 83.9213 99.4302 85.5416 100.819 86.9305C102.092 88.2037 103.713 88.8403 105.68 88.8403C107.648 88.8403 109.268 88.2037 110.541 86.9305L118.006 79.4653C118.932 78.5393 120.118 78.2199 121.562 78.5069C123.006 78.794 123.962 79.5764 124.43 80.8541C124.777 81.7801 124.981 82.7639 125.041 83.8055C125.101 84.8472 125.129 85.8889 125.125 86.9305C125.125 93.6435 122.752 99.3727 118.006 104.118C113.261 108.863 107.532 111.236 100.819 111.236C99.3144 111.236 97.8978 111.12 96.5691 110.889C95.2404 110.657 93.9371 110.31 92.6594 109.847ZM23.3888 111.236C16.2129 105.449 10.5416 98.3611 6.37498 89.9722C2.20833 81.5833 0.125 72.4676 0.125 62.625C0.125 53.9444 1.77546 45.8148 5.07637 38.2361C8.37728 30.6574 12.831 24.0602 18.4374 18.4444C24.0439 12.8287 30.6411 8.37268 38.229 5.07639C45.817 1.78009 53.9489 0.12963 62.6248 0.125C75.4719 0.125 86.9881 3.59722 97.1732 10.5417C107.358 17.4861 114.881 26.456 119.743 37.4514C120.553 39.3032 120.553 41.0972 119.743 42.8333C118.932 44.5694 117.601 45.7847 115.75 46.4792C114.013 47.0579 112.307 46.9421 110.632 46.1319C108.956 45.3217 107.71 44.0486 106.895 42.3125C103.076 33.9792 97.2033 27.1805 89.2774 21.9167C81.3515 16.6528 72.4673 14.0185 62.6248 14.0139C49.0831 14.0139 37.5971 18.7315 28.1666 28.1667C18.736 37.6018 14.0185 49.088 14.0138 62.625C14.0138 70.9583 15.8958 78.5972 19.6596 85.5416C23.4235 92.4861 28.486 98.1574 34.8471 102.556V90.4028C34.8471 88.4352 35.5137 86.787 36.8471 85.4583C38.1804 84.1296 39.8285 83.4629 41.7915 83.4583C43.7545 83.4537 45.4049 84.1204 46.7429 85.4583C48.0808 86.7963 48.7452 88.4444 48.7359 90.4028V118.181C48.7359 120.148 48.0693 121.799 46.7359 123.132C45.4026 124.465 43.7545 125.13 41.7915 125.125H14.0138C12.0462 125.125 10.3981 124.458 9.06941 123.125C7.74071 121.792 7.07405 120.143 7.06942 118.181C7.06479 116.218 7.73145 114.569 9.06941 113.236C10.4074 111.903 12.0555 111.236 14.0138 111.236H23.3888Z" fill="#FFD057"/></svg>"""
        arcade_status_text = "Borne en maintenance"
    elif arcadeStatus == 2:
        arcade_status_svg = CHECKED_SVG
        arcade_status_text = "Borne en fonctionnement"

    if gameUploadStatus == 0:
        upload_status_svg = STOPPED_SVG
        upload_status_text = "Dépôts fermé"
    elif gameUploadStatus == 1:
        upload_status_svg = CHECKED_SVG
        upload_status_text = "Dépôts overts"
    return render_template('dashboard.html', arcade_status_svg=arcade_status_svg, arcade_status_text=arcade_status_text, upload_status_svg=upload_status_svg, upload_status_text=upload_status_text, top_five_games=top_five_games)

def database_test():
    with app.app_context():
        try:
            db.session.execute(text('SELECT 1'))
            print('Connexion à la BDD réussi')
        except Exception as e:
            print('Connexion à la BDD échoué', e)

def format_duration(seconds):
    hours, remainder = divmod(seconds, 3600)
    minutes, seconds = divmod(remainder, 60)
    return f"{hours}h {minutes}m {seconds}s"

if __name__ == '__main__':
    database_test()
    app.run(debug=True)