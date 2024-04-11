from flask import Flask, render_template, request, redirect
import os
import zipfile
import configparser

app = Flask(__name__)

UPLOAD_FOLDER = '../uploadFLASK/uploads'
ALLOWED_EXTENSIONS = {'zip'}

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return redirect(request.url)

    file = request.files['file']

    if file.filename == '':
        return "Aucun fichier sélectionné."

    if file and allowed_file(file.filename):
        # Créez le dossier 'uploads' s'il n'existe pas
        if not os.path.exists(UPLOAD_FOLDER):
            os.makedirs(UPLOAD_FOLDER)

        # Enregistrez le fichier uploadé
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
        file.save(file_path)

        # Vérifiez si le fichier est un zip
        if file.filename.endswith('.zip'):
            # Extraire le contenu de l'archive zip
            with zipfile.ZipFile(file_path, 'r') as zip_ref:
                zip_ref.extractall(UPLOAD_FOLDER)

            # Obtenir le nom du dossier extrait (sans l'extension .zip)
            extracted_folder_name = os.path.splitext(file.filename)[0]
            print(extracted_folder_name)

            # Supprimez le fichier zip après l'extraction
            os.remove(file_path)

            # Recherchez le fichier config.ini dans le dossier uploadé
            config_file_path = os.path.join(app.config['UPLOAD_FOLDER'], extracted_folder_name, 'config.ini')
            print(config_file_path)

            if os.path.exists(config_file_path):
                config = configparser.ConfigParser()
                # Assurez-vous que le fichier est lu en UTF-8
                config.read(config_file_path, encoding='utf-8')

                # Accédez aux valeurs de la section 'gameinfo'
                section = 'gameinfo'
                game_name = config.get(section, 'game_name')
                game_description = config.get(section, 'game_description')
                game_creator_name = config.get(section, 'game_creator_name')

                # Construire la réponse
                response = f"Contenu de la section {section}: {game_name}, {game_description}, {game_creator_name}"

                return response
            else:
                return "Le fichier config.ini n'a pas été trouvé dans le dossier uploadé."

    return "Une erreur s'est produite lors du traitement du fichier."

if __name__ == '__main__':
    app.run(debug=True)
