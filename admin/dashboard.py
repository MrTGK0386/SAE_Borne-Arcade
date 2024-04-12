from config.config import MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DB, SECRET_KEY
from flask import Flask, render_template, request, redirect, session ,jsonify
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import text
from random import randint
from datetime import datetime
import bcrypt, urllib.parse, os, shutil
from urllib.parse import unquote_plus

app = Flask(__name__)
app.secret_key = SECRET_KEY
app.config['SQLALCHEMY_DATABASE_URI'] = f'mysql+mysqlconnector://{MYSQL_USER}:{MYSQL_PASSWORD}@{MYSQL_HOST}/{MYSQL_DB}'
db = SQLAlchemy(app)

CHECKED_SVG = """<svg width="125" height="125" viewBox="0 0 125 125" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M62.5 0C27.9824 0 0 27.9824 0 62.5C0 97.0195 27.9824 125 62.5 125C97.0195 125 125 97.0195 125 62.5C125 27.9824 97.0195 0 62.5 0ZM62.5 117.311C32.3457 117.311 7.8125 92.6543 7.8125 62.4998C7.8125 32.3455 32.3457 7.81226 62.5 7.81226C92.6543 7.81226 117.188 32.3456 117.188 62.4998C117.188 92.6539 92.6543 117.311 62.5 117.311ZM87.4434 39.6309L50.7733 76.5312L34.2596 60.0176C32.7343 58.4922 30.2616 58.4922 28.7343 60.0176C27.2089 61.543 27.2089 64.0156 28.7343 65.541L48.0682 84.877C49.5936 86.4004 52.0663 86.4004 53.5936 84.877C53.7694 84.7012 53.9199 84.5096 54.0566 84.3105L92.9707 45.1561C94.4941 43.6307 94.4941 41.1581 92.9707 39.6309C91.4434 38.1055 88.9707 38.1055 87.4434 39.6309Z" fill="#4ECB71"/></svg>"""
STOPPED_SVG = """<svg width="125" height="125" viewBox="0 0 125 125" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M0 62.5C0 45.924 6.5848 30.0268 18.3058 18.3058C30.0268 6.5848 45.924 0 62.5 0C79.076 0 94.9731 6.5848 106.694 18.3058C118.415 30.0268 125 45.924 125 62.5C125 79.076 118.415 94.9731 106.694 106.694C94.9731 118.415 79.076 125 62.5 125C45.924 125 30.0268 118.415 18.3058 106.694C6.5848 94.9731 0 79.076 0 62.5ZM62.5 8.96497C48.3016 8.96497 34.6848 14.6053 24.645 24.645C14.6053 34.6848 8.96497 48.3016 8.96497 62.5C8.96497 76.6984 14.6053 90.3152 24.645 100.355C34.6848 110.395 48.3016 116.035 62.5 116.035C76.6984 116.035 90.3152 110.395 100.355 100.355C110.395 90.3152 116.035 76.6984 116.035 62.5C116.035 48.3016 110.395 34.6848 100.355 24.645C90.3152 14.6053 76.6984 8.96497 62.5 8.96497ZM84.7143 40.2952C85.5988 41.18 86.0957 42.3799 86.0957 43.6311C86.0957 44.8822 85.5988 46.0822 84.7143 46.967L69.1718 62.5L84.7143 78.033C85.6002 78.919 86.098 80.1206 86.098 81.3736C86.098 82.6266 85.6002 83.8283 84.7143 84.7143C83.8283 85.6002 82.6266 86.098 81.3736 86.098C80.1206 86.098 78.919 85.6002 78.033 84.7143L62.5 69.1718L46.967 84.7143C46.5283 85.153 46.0075 85.5009 45.4343 85.7384C44.8611 85.9758 44.2468 86.098 43.6264 86.098C43.006 86.098 42.3916 85.9758 41.8184 85.7384C41.2453 85.5009 40.7244 85.153 40.2857 84.7143C39.847 84.2756 39.4991 83.7547 39.2616 83.1816C39.0242 82.6084 38.902 81.994 38.902 81.3736C38.902 80.7532 39.0242 80.1389 39.2616 79.5657C39.4991 78.9925 39.847 78.4717 40.2857 78.033L55.8282 62.5L40.2857 46.967C39.3998 46.081 38.902 44.8794 38.902 43.6264C38.902 42.3734 39.3998 41.1717 40.2857 40.2857C41.1717 39.3998 42.3734 38.902 43.6264 38.902C44.8794 38.902 46.081 39.3998 46.967 40.2857L62.5 55.8282L78.033 40.2857C78.4713 39.8463 78.992 39.4977 79.5652 39.2598C80.1385 39.022 80.753 38.8995 81.3736 38.8995C81.9942 38.8995 82.6088 39.022 83.182 39.2598C83.7553 39.4977 84.276 39.8558 84.7143 40.2952Z" fill="#F24E1E"/></svg>"""
VERRIFYING = """<?xml version="1.0" encoding="utf-8"?><!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools --><svg fill="#FFD057" width="800px" height="800px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M2.062,11.346a.99.99,0,0,1,0-.691C3.773,6,7.674,3,12,3s8.227,3,9.938,7.655a.987.987,0,0,1,0,.69,13.339,13.339,0,0,1-1.08,2.264,1,1,0,1,1-1.715-1.028A11.3,11.3,0,0,0,19.928,11C18.451,7.343,15.373,5,12,5S5.549,7.343,4.072,11a9.315,9.315,0,0,0,6.167,5.787,1,1,0,0,1-.478,1.942A11.393,11.393,0,0,1,2.062,11.346ZM16,11a4,4,0,0,0-5.577-3.675,1.5,1.5,0,1,1-2.1,2.1A4,4,0,1,0,16,11Zm1.5,10a1,1,0,0,0,1-1V18.5H20a1,1,0,0,0,0-2H18.5V15a1,1,0,0,0-2,0v1.5H15a1,1,0,0,0,0,2h1.5V20A1,1,0,0,0,17.5,21Z"/></svg>"""
EDIT_SVG = """<svg width="800px" height="800px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title /><g id="Complete"><g id="edit"><g><path d="M20,16v4a2,2,0,0,1-2,2H4a2,2,0,0,1-2-2V6A2,2,0,0,1,4,4H8" fill="none" stroke="#000000"stroke-linecap="round" stroke-linejoin="round" stroke-width="2" /><polygon fill="none" points="12.5 15.8 22 6.2 17.8 2 8.3 11.5 8 16 12.5 15.8" stroke="#000000"stroke-linecap="round" stroke-linejoin="round" stroke-width="2" /></g></g></g></svg>"""
GEAR_SVG = """<?xml version="1.0" encoding="utf-8"?><!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools --><svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M12.0002 8C9.79111 8 8.00024 9.79086 8.00024 12C8.00024 14.2091 9.79111 16 12.0002 16C14.2094 16 16.0002 14.2091 16.0002 12C16.0002 9.79086 14.2094 8 12.0002 8ZM10.0002 12C10.0002 10.8954 10.8957 10 12.0002 10C13.1048 10 14.0002 10.8954 14.0002 12C14.0002 13.1046 13.1048 14 12.0002 14C10.8957 14 10.0002 13.1046 10.0002 12Z" fill="#000000"/><path fill-rule="evenodd" clip-rule="evenodd" d="M11.2867 0.5C9.88583 0.5 8.6461 1.46745 8.37171 2.85605L8.29264 3.25622C8.10489 4.20638 7.06195 4.83059 6.04511 4.48813L5.64825 4.35447C4.32246 3.90796 2.83873 4.42968 2.11836 5.63933L1.40492 6.83735C0.67773 8.05846 0.954349 9.60487 2.03927 10.5142L2.35714 10.7806C3.12939 11.4279 3.12939 12.5721 2.35714 13.2194L2.03927 13.4858C0.954349 14.3951 0.67773 15.9415 1.40492 17.1626L2.11833 18.3606C2.83872 19.5703 4.3225 20.092 5.64831 19.6455L6.04506 19.5118C7.06191 19.1693 8.1049 19.7935 8.29264 20.7437L8.37172 21.1439C8.6461 22.5325 9.88584 23.5 11.2867 23.5H12.7136C14.1146 23.5 15.3543 22.5325 15.6287 21.1438L15.7077 20.7438C15.8954 19.7936 16.9384 19.1693 17.9553 19.5118L18.3521 19.6455C19.6779 20.092 21.1617 19.5703 21.8821 18.3606L22.5955 17.1627C23.3227 15.9416 23.046 14.3951 21.9611 13.4858L21.6432 13.2194C20.8709 12.5722 20.8709 11.4278 21.6432 10.7806L21.9611 10.5142C23.046 9.60489 23.3227 8.05845 22.5955 6.83732L21.8821 5.63932C21.1617 4.42968 19.678 3.90795 18.3522 4.35444L17.9552 4.48814C16.9384 4.83059 15.8954 4.20634 15.7077 3.25617L15.6287 2.85616C15.3543 1.46751 14.1146 0.5 12.7136 0.5H11.2867ZM10.3338 3.24375C10.4149 2.83334 10.7983 2.5 11.2867 2.5H12.7136C13.2021 2.5 13.5855 2.83336 13.6666 3.24378L13.7456 3.64379C14.1791 5.83811 16.4909 7.09167 18.5935 6.38353L18.9905 6.24984C19.4495 6.09527 19.9394 6.28595 20.1637 6.66264L20.8771 7.86064C21.0946 8.22587 21.0208 8.69271 20.6764 8.98135L20.3586 9.24773C18.6325 10.6943 18.6325 13.3057 20.3586 14.7523L20.6764 15.0186C21.0208 15.3073 21.0946 15.7741 20.8771 16.1394L20.1637 17.3373C19.9394 17.714 19.4495 17.9047 18.9905 17.7501L18.5936 17.6164C16.4909 16.9082 14.1791 18.1618 13.7456 20.3562L13.6666 20.7562C13.5855 21.1666 13.2021 21.5 12.7136 21.5H11.2867C10.7983 21.5 10.4149 21.1667 10.3338 20.7562L10.2547 20.356C9.82113 18.1617 7.50931 16.9082 5.40665 17.6165L5.0099 17.7501C4.55092 17.9047 4.06104 17.714 3.83671 17.3373L3.1233 16.1393C2.9058 15.7741 2.97959 15.3073 3.32398 15.0186L3.64185 14.7522C5.36782 13.3056 5.36781 10.6944 3.64185 9.24779L3.32398 8.98137C2.97959 8.69273 2.9058 8.2259 3.1233 7.86067L3.83674 6.66266C4.06106 6.28596 4.55093 6.09528 5.0099 6.24986L5.40676 6.38352C7.50938 7.09166 9.82112 5.83819 10.2547 3.64392L10.3338 3.24375Z" fill="#000000"/></svg>"""
LOCKED = """<svg width="96" height="125" viewBox="0 0 96 125" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M83.3333 41.6667H77.381V29.7619C77.381 13.3333 64.0476 0 47.619 0C31.1905 0 17.8571 13.3333 17.8571 29.7619V41.6667H11.9048C5.35714 41.6667 0 47.0238 0 53.5714V113.095C0 119.643 5.35714 125 11.9048 125H83.3333C89.881 125 95.2381 119.643 95.2381 113.095V53.5714C95.2381 47.0238 89.881 41.6667 83.3333 41.6667ZM47.619 95.2381C41.0714 95.2381 35.7143 89.881 35.7143 83.3333C35.7143 76.7857 41.0714 71.4286 47.619 71.4286C54.1667 71.4286 59.5238 76.7857 59.5238 83.3333C59.5238 89.881 54.1667 95.2381 47.619 95.2381ZM66.0714 41.6667H29.1667V29.7619C29.1667 19.5833 37.4405 11.3095 47.619 11.3095C57.7976 11.3095 66.0714 19.5833 66.0714 29.7619V41.6667Z" fill="#FF6565"/></svg>"""
UNLOCKED = """<svg width="125" height="125" viewBox="0 0 125 125" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M93.75 41.6667C96.5127 41.6667 99.1622 42.7641 101.116 44.7176C103.069 46.6711 104.167 49.3207 104.167 52.0833V104.167C104.167 106.929 103.069 109.579 101.116 111.532C99.1622 113.486 96.5127 114.583 93.75 114.583H31.25C28.4873 114.583 25.8378 113.486 23.8843 111.532C21.9308 109.579 20.8333 106.929 20.8333 104.167V52.0833C20.8333 49.3207 21.9308 46.6711 23.8843 44.7176C25.8378 42.7641 28.4873 41.6667 31.25 41.6667H78.125V31.25C78.125 27.106 76.4788 23.1317 73.5485 20.2015C70.6183 17.2712 66.644 15.625 62.5 15.625C58.356 15.625 54.3817 17.2712 51.4515 20.2015C48.5212 23.1317 46.875 27.106 46.875 31.25H36.4583C36.4583 24.3433 39.202 17.7195 44.0858 12.8358C48.9695 7.952 55.5933 5.20833 62.5 5.20833C65.9198 5.20833 69.3062 5.88192 72.4657 7.19063C75.6252 8.49935 78.4961 10.4176 80.9142 12.8358C83.3324 15.2539 85.2507 18.1248 86.5594 21.2843C87.8681 24.4438 88.5417 27.8302 88.5417 31.25V41.6667H93.75ZM62.5 88.5417C65.2627 88.5417 67.9122 87.4442 69.8657 85.4907C71.8192 83.5372 72.9167 80.8877 72.9167 78.125C72.9167 75.3623 71.8192 72.7128 69.8657 70.7593C67.9122 68.8058 65.2627 67.7083 62.5 67.7083C59.7373 67.7083 57.0878 68.8058 55.1343 70.7593C53.1808 72.7128 52.0833 75.3623 52.0833 78.125C52.0833 80.8877 53.1808 83.5372 55.1343 85.4907C57.0878 87.4442 59.7373 88.5417 62.5 88.5417Z" fill="#4ECB71"/></svg>"""

class infoborne(db.Model):
    name = db.Column(db.String(255), primary_key=True)
    login = db.Column(db.String(255), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    arcadeStatus = db.Column(db.SmallInteger, nullable=False)
    gameUploadStatus = db.Column(db.Boolean, nullable=False)
    runtime = db.Column(db.String(255), nullable=False)

class games(db.Model):
    name = db.Column(db.String(255), primary_key=True)
    version = db.Column(db.String(255), nullable=True)
    description = db.Column(db.String, nullable= True)
    creator_name = db.Column(db.String, nullable= True)
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
    top_five_games = games.query.order_by(games.total_time_played.desc()).limit(1).all()
    all_games = games.query.all()  # Récupérer tous les jeux

    for game in top_five_games:
        game.formatted_duration = format_duration(game.total_time_played)
    for game in all_games:
        game.formatted_duration = format_duration(game.total_time_played)
    for game in all_games:
        game.formatted_uploadDate = convert_unix_timestamp_to_date(game.uploadDate)
            
    for game in all_games:
        if (game.status == 2):
            game.status_svg = CHECKED_SVG
        elif (game.status == 1):
            game.status_svg = VERRIFYING
        elif (game.status == 0):
            game.status_svg = STOPPED_SVG
    for game in all_games:
        game.name = game.name.replace(" ", "%20")

    for game in all_games:
        encoded_name = urllib.parse.quote(game.name)
        game.modify = f'<a href="/game_info?game_name={encoded_name}">{EDIT_SVG}</a>'

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
        upload_status_svg = LOCKED
        upload_status_text = "Dépôts fermé"
    elif gameUploadStatus == 1:
        upload_status_svg = UNLOCKED
        upload_status_text = "Dépôts overts"
    return render_template('dashboard.html', arcade_status_svg=arcade_status_svg, arcade_status_text=arcade_status_text, upload_status_svg=upload_status_svg, upload_status_text=upload_status_text, top_five_games=top_five_games, all_games=all_games)

@app.route('/change_arcade_status', methods=['POST'])
def change_arcade_status():
    if 'loggedin' not in session:
        return redirect('/')
    new_status = request.form.get('arcade_status')
    if new_status is None or new_status not in ['0', '1', '2']:
        return "Invalid status", 400
    arcade = infoborne.query.first()
    arcade.arcadeStatus = int(new_status)
    db.session.commit()
    
    return redirect('/dashboard')

@app.route('/change_upload_status', methods=['POST'])
def change_upload_status():
    if 'loggedin' not in session:
        return redirect('/')
    new_status = request.form.get('upload_status')
    if new_status is None or new_status not in ['0', '1']:
        return "Invalid status", 400
    arcade = infoborne.query.first()
    arcade.gameUploadStatus = int(new_status)
    db.session.commit()
    
    return redirect('/dashboard')

@app.template_filter('urldecode')
def urldecode_filter(s):
    return unquote_plus(s)

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
    
def convert_unix_timestamp_to_date(unix_timestamp):
    date_object = datetime.utcfromtimestamp(unix_timestamp)
    formatted_date = date_object.strftime('%d/%m/%y')
    return formatted_date

@app.route('/game_info')
def game_info():
    game_name = request.args.get('game_name')
    game_name = game_name.replace("%20", " ")
    game = games.query.filter_by(name=game_name).first()
    if game:
        game_data = {
            'name': game.name,
            'version': game.version,
            'description': game.description,
            'creator_name': game.creator_name,
            'path': game.path,
            'gitRepo': game.gitRepo,
            'launcherType': game.launcherType,
            'playerNumber': game.playerNumber,
            'uploadDate': convert_unix_timestamp_to_date(game.uploadDate),
            'status': game.status,
            'total_time_played': format_duration(game.total_time_played)
        }
        return render_template('game_info.html', game=game_data)
    else:
        return jsonify({'error': 'Game not found'}), 404

import os

@app.route('/game_info/<game_name>/update_status', methods=['POST'])
def update_status(game_name):
    new_status = request.form['status']
    game = games.query.filter_by(name=game_name).first()
    
    if game:
        current_status = game.status
        if int(new_status) != current_status:
            game.status = int(new_status)
            
            if new_status == '2':
                source_path = './temp/'+game_name
                destination_path = './games'
            elif new_status == '1' or new_status == '0':
                source_path = './games/'+game_name
                destination_path = './temp'
            
            if not os.path.exists(destination_path+'/'+game_name):
                try:
                    shutil.move(source_path, destination_path)
                except shutil.Error as e:
                    return "Erreur lors du déplacement du fichier : {}".format(str(e)), 500
            else:
                db.session.commit()
                return redirect('/dashboard')
            db.session.commit()
            return redirect('/dashboard')
        else:
            db.session.commit()
            return redirect('/dashboard')
    else:
        return "Jeu non trouvé", 404
    
if __name__ == '__main__':
    database_test()
    app.run(debug=True)