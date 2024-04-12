from config.config import MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DB
from flask import Flask, render_template, request, redirect, jsonify  # Add jsonify to imports
from urllib.parse import urlparse
import configparser, git, os, zipfile, time, re
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = f'mysql+mysqlconnector://{MYSQL_USER}:{MYSQL_PASSWORD}@{MYSQL_HOST}/{MYSQL_DB}'
db = SQLAlchemy(app)

UPLOAD_FOLDER = './temp'
ALLOWED_EXTENSIONS = {'zip'}

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

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

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def remove_quotes(string):
    pattern = r'^"|"$'  # Pattern to match quotes at the beginning or end of the string
    new_string = re.sub(pattern, '', string)
    return new_string

@app.route('/')
def index():
    gameUploadStatus = infoborne.query.with_entities(infoborne.gameUploadStatus).first()[0]
    if (gameUploadStatus == 1):
            print("Arcade ouvert")
            return render_template('index.html')
    else:
        return render_template('closed.html')

@app.route('/fetch' , methods=['POST'])
def fetch_repo():
    gameUploadStatus = infoborne.query.with_entities(infoborne.gameUploadStatus).first()[0]
    if (gameUploadStatus == 0):
        return render_template('closed.html')
    else:
        repo_url = request.values["url"]+'.git'
        try:
            parsed_url = urlparse(repo_url)
            repo_name = os.path.splitext(os.path.basename(parsed_url.path))[0]
            repo_dir = os.path.join('./uploadFLASK/temp', repo_name)

            if os.path.exists(repo_dir):
                return jsonify({'error': 'Repository directory already exists'}), 400

            git.Repo.clone_from(repo_url, repo_dir)

            config_file_path = os.path.join(repo_dir, 'config.ini')
            if not os.path.exists(config_file_path):
                print("Pas de fichier config")
                return jsonify({'error': 'config.ini not found in the repository'}), 500

            return jsonify({'message': 'Repository cloned successfully'}), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return redirect(request.url)

    file = request.files['file']

    if file.filename == '':
        return "Aucun fichier sélectionné."

    if file and allowed_file(file.filename):
        if not os.path.exists(UPLOAD_FOLDER):
            os.makedirs(UPLOAD_FOLDER)

        file_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
        file.save(file_path)

        if file.filename.endswith('.zip'):
            with zipfile.ZipFile(file_path, 'r') as zip_ref:
                zip_ref.extractall(UPLOAD_FOLDER)

            extracted_folder_name = os.path.splitext(file.filename)[0]
            print(extracted_folder_name)

            os.remove(file_path)

            config_file_path = os.path.join(app.config['UPLOAD_FOLDER'], extracted_folder_name, 'config.ini')

            if os.path.exists(config_file_path):
                config = configparser.ConfigParser()
                config.read(config_file_path, encoding='utf-8')

                section = 'gameinfo'
                game_name = remove_quotes(config.get(section, 'game_name'))
                game_description = remove_quotes(config.get(section, 'game_description'))
                game_creator_name = remove_quotes(config.get(section, 'game_creator_name'))
                game_launcher = config.get(section, 'game_launcher')
                game_player_number = config.get(section, 'game_player_number')
                game_version = remove_quotes( config.get(section, 'game_version'))

                arcade = games.query.filter_by(name=game_name).first()  # Vérifier si le jeu existe déjà
                if arcade:
                    return "Ce jeu existe déjà dans la base de données."
                else:
                    new_game = games(name=game_name, description=game_description, creator_name=game_creator_name, path=extracted_folder_name, launcherType=game_launcher, playerNumber=game_player_number, uploadDate=int(time.time()), status=1, total_time_played=0, version=game_version)
                    db.session.add(new_game)
                    db.session.commit()
                    response = f"Le jeu {game_name} a été ajouté avec succès à la base de données."
                    return response
            else:
                return "Le fichier config.ini n'a pas été trouvé dans le dossier uploadé."

    return "Une erreur s'est produite lors du traitement du fichier."

if __name__ == '__main__':
    app.run(debug=True)
