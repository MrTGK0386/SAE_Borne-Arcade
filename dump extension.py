import subprocess

# Exécuter pip freeze et capturer la sortie
output = subprocess.check_output(["pip", "freeze"]).decode("utf-8")

# Parcourir chaque ligne de sortie
for package in output.split("\n"):
    # Ignorer les lignes vides
    if not package:
        continue
    # Extraire le nom du package
    package_name = package.split("==")[0]
    # Désinstaller le package
    subprocess.call(["pip", "uninstall", "-y", package_name])
