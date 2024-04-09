const fs = require('fs');
const readline = require('readline');

// Lire le fichier config.ini
fs.readFile('config.ini', 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  // Analyser le contenu du fichier config.ini
  const config = parseConfig(data);

  // Créer une interface pour lire l'entrée clavier
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  // Attendre les entrées clavier
  rl.on('line', (input) => {
    // Vérifier si la touche est configurée dans le fichier config.ini
    if (config[input]) {
      console.log(`Action associée à la touche ${input}: ${config[input]}`);
      // Exécuter l'action associée
      executeAction(config[input]);
    } else {
      console.log(`Touche non configurée: ${input}`);
    }
  });
});

// Fonction pour analyser le contenu du fichier config.ini
function parseConfig(data) {
  const config = {};
  // Supposons que le fichier config.ini a des lignes de la forme "touche = action"
  const lines = data.split('\n');
  for (const line of lines) {
    const [key, value] = line.split('=');
    config[key.trim()] = value.trim();
  }
  return config;
}

// Fonction pour exécuter une action
function executeAction(action) {
  // Implémentez vos actions ici en fonction de ce que vous attendez de chaque action
  console.log(`Action exécutée: ${action}`);
}
