from flask import Flask, jsonify
import git
import os
from urllib.parse import urlparse

app = Flask(__name__)

@app.route('/')
def fetch_repo():
    repo_url = 'https://github.com/MrTGK0386/SAE_Borne-Arcade.git'  # Remplacez owner et repository par les informations de votre dépôt
    try:
        parsed_url = urlparse(repo_url)
        repo_name = os.path.splitext(os.path.basename(parsed_url.path))[0]  # Extraire le nom du repo à partir de l'URL
        repo_dir = os.path.join('temp', repo_name)  # Chemin du dossier où le dépôt sera cloné

        if os.path.exists(repo_dir):
            return jsonify({'error': 'Repository directory already exists'}), 400

        git.Repo.clone_from(repo_url, repo_dir)
        return jsonify({'message': 'Repository cloned successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
