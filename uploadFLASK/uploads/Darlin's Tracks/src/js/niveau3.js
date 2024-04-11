// chargement des librairies
import Phaser from "phaser";

/***********************************************************************/
/** CONFIGURATION GLOBALE DU JEU ET LANCEMENT 
/***********************************************************************/

// configuration générale du jeu
var player; // désigne le sprite du joueur

var clavier; // pour la gestion du clavier
var keys;
var tile;
var Xq = -200;
var Xd = 200;
var Yz = -200;
var Ys = 200;
var chronoTexte;
var monTimer;
var chrono = 0;

var dialogueText;
var dialogues = [
  "Laurent : T’es sorti de la prison Guy ! J’arrive pas à y croire !",
  "Laurent : En revanche, tu es maintenant dans le bâtiment de Christo.",
  "Laurent : Tu pourrais sortir et t’enfuir... mais, je pense que mon idée va te plaire.",
  "Laurent : Et si on allait se venger de ce gars en allant récupérer tes albums ?",
  "Laurent : Bien, dis-toi qu’une fois que tu commenceras à explorer son bâtiment, les robots prendront au moins 4 minutes à te trouver, il faut que tu fasses vite !",
  "Laurent : Trouve le chemin vers son bureau.",
  "Laurent : Ah oui ! J'ai failli oublier, quand je me suis baladé dans cette endroit, je ne savais plus du tout marcher... tu verras.",
  "Laurent : Aller ! Bon courage, je te recontacte une fois que tu es dedans."
];
var dialogueIndex = 0;
var dialogueSpeed = 50; // Vitesse d'affichage du texte

export default class niveau3 extends Phaser.Scene {
  constructor() {
    super({ key: "niveau3" });
    this.paveNumerique = null;
    this.codeTexte = null;
    this.imageCode = null;
    this.codeSpriteSheet = null;
    this.currentFrame = 0;
    this.bubble1 = null;
  }

  preload() {
    this.load.spritesheet("img_perso", "src/assets/daf.png", {
      frameWidth: 42,
      frameHeight: 44
    });
  }

  create() {
    const map = this.add.tilemap("carte3");
    // chargement du jeu de tuiles
    const tileset = map.addTilesetImage("sol_mur", "Phaser_tuile3");
    const tileset2 = map.addTilesetImage("meubles", "Meuble");
    const musique3 = this.sound.add("musique3");
    musique3.setVolume(0.3);
    musique3.play();

    this.events.on("shutdown", () => {
      // Cet événement est déclenché lorsque la scène est détruite.
      // Vous pouvez y arrêter la musique "musiqueM".
      musique3.stop();
    });

    const sol = map.createDynamicLayer("sol", [tileset, tileset2]);
    this.mur = map.createDynamicLayer("mur", [tileset, tileset2]);
    this.meuble = map.createDynamicLayer("Stuff", [tileset, tileset2]);
    this.mur.setCollisionByProperty({ solide: true });
    this.meuble.setCollisionByProperty({ solide: true });
    player = this.physics.add.sprite(170, 873, "img_perso");
    this.physics.add.collider(player, this.mur);
    this.physics.add.collider(player, this.meuble);
    //  propriétées physiqyes de l'objet player :

    player.setCollideWorldBounds(true); // le player se cognera contre les bords du monde
    player.body.setSize(30, 30);
    this.physics.world.setBounds(0, 0, 3200, 960);
    chronoTexte = this.add.text(10, 620, "Chrono: 0", {
      fontSize: "24px",
      fill: "#FFFFFF" //Couleur de l'écriture
    });
    chronoTexte.depth = 8;

    chronoTexte.setScrollFactor(0);
    //  ajout du champs de la caméra de taille identique à celle du monde
    this.cameras.main.setBounds(0, 0, 3200, 960);
    // ancrage de la caméra sur le joueur
    this.cameras.main.startFollow(player);
    this.cameras.main.zoom = 2;

    dialogueText = this.add.text(150, 450, "", {
      font: "16px fantasy",
      fill: "#000000",
      backgroundColor: "rgba(255, 255, 255, 0.7)",
      padding: {
        left: 200,
        right: 200,
        top: 20,
        bottom: 20
      }
    });

    dialogueText.setScrollFactor(0);
    dialogueText.setDepth(1);
    dialogueText.setWordWrapWidth(300);

    const displayDialogue = () => {
      if (dialogueIndex < dialogues.length) {
        const currentDialogue = dialogues[dialogueIndex];
        let currentIndex = 0;

        const dialogueInterval = setInterval(() => {
          if (currentIndex < currentDialogue.length) {
            const currentText = dialogueText.text;
            dialogueText.setText(currentText + currentDialogue[currentIndex]);
            currentIndex++;
          } else {
            clearInterval(dialogueInterval); // Arrêter l'affichage du dialogue
            dialogueIndex++;

            // Vérifier si c'est le dernier dialogue
            if (dialogueIndex === dialogues.length) {
              // C'est le dernier dialogue, attendez une seconde avant de masquer le fond du texte
              setTimeout(() => {
                dialogueText.setVisible(false);
              }, 2000);
            }

            // Délai avant d'afficher le dialogue suivant
            this.time.delayedCall(2000, () => {
              if (dialogueIndex < dialogues.length) {
                dialogueText.setText(""); // Effacer le texte actuel
                displayDialogue(); // Afficher le dialogue suivant
              }
            });
          }
        }, dialogueSpeed);
      }
    };

    displayDialogue(); // Commencer l'affichage du premier dialogue

    this.anims.create({
      key: "anim_tourne_gauche", // key est le nom de l'animation : doit etre unique poru la scene.
      frames: this.anims.generateFrameNumbers("img_perso", {
        start: 5,
        end: 3
      }), // on prend toutes les frames de img perso numerotées de 0 à 3
      frameRate: 10, // vitesse de défilement des frames
      repeat: -1 // nombre de répétitions de l'animation. -1 = infini
    });

    this.anims.create({
      key: "anim_descend", // key est le nom de l'animation : doit etre unique poru la scene.
      frames: this.anims.generateFrameNumbers("img_perso", {
        start: 9,
        end: 11
      }), // on prend toutes les frames de img perso numerotées de 0 à 3
      frameRate: 10, // vitesse de défilement des frames
      repeat: -1 // nombre de répétitions de l'animation. -1 = infini
    });

    this.anims.create({
      key: "anim_monte", // key est le nom de l'animation : doit etre unique poru la scene.
      frames: this.anims.generateFrameNumbers("img_perso", {
        start: 6,
        end: 8
      }), // on prend toutes les frames de img perso numerotées de 0 à 3
      frameRate: 10, // vitesse de défilement des frames
      repeat: -1 // nombre de répétitions de l'animation. -1 = infini
    });

    // creation de l'animation "anim_tourne_face" qui sera jouée sur le player lorsque ce dernier n'avance pas.
    this.anims.create({
      key: "anim_face",
      frames: [{ key: "img_perso", frame: 1 }],
      frameRate: 20
    });

    // creation de l'animation "anim_tourne_droite" qui sera jouée sur le player lorsque ce dernier tourne à droite
    this.anims.create({
      key: "anim_tourne_droite",
      frames: this.anims.generateFrameNumbers("img_perso", {
        start: 0,
        end: 2
      }),
      frameRate: 10,
      repeat: -1
    });

    keys = this.input.keyboard.addKeys({
      haut: Phaser.Input.Keyboard.KeyCodes.Z,
      gauche: Phaser.Input.Keyboard.KeyCodes.Q,
      bas: Phaser.Input.Keyboard.KeyCodes.S,
      droite: Phaser.Input.Keyboard.KeyCodes.D,
      space: Phaser.Input.Keyboard.KeyCodes.SPACE
    });

    clavier = this.input.keyboard.createCursorKeys();

    this.codeSpriteSheet = this.textures.get("sprite_code"); // Remplacez "votre_sprite_sheet" par le nom de votre sprite sheet

    // Créez un sprite qui affiche le sprite sheet
    this.codeSprite = this.add.sprite(570, 370, "sprite_code"); // Remplacez "votre_sprite_sheet" par le nom de votre sprite sheet

    // Cachez le sprite initialement
    this.codeSprite.setVisible(false);

    var tile = this.mur.getTileAtWorldXY(player.x, player.y);
    var tiles = this.meuble.getTileAtWorldXY(player.x, player.y);

    this.physics.add.overlap(player, this.meuble, (player, tiles) => {
      if (tiles.properties.fin) {
        if (keys.haut.isDown) {
          this.scene.start("menu4");
        }
      }
    });

    this.physics.add.overlap(player, this.mur, (player, tile) => {
      if (tile.properties.changement1) {
        keys = this.input.keyboard.addKeys({
          gauche: Phaser.Input.Keyboard.KeyCodes.Z,
          bas: Phaser.Input.Keyboard.KeyCodes.Q,
          droite: Phaser.Input.Keyboard.KeyCodes.S,
          haut: Phaser.Input.Keyboard.KeyCodes.D
        });
      } else if (tile.properties.changement2) {
        keys = this.input.keyboard.addKeys({
          bas: Phaser.Input.Keyboard.KeyCodes.Z,
          droite: Phaser.Input.Keyboard.KeyCodes.Q,
          haut: Phaser.Input.Keyboard.KeyCodes.S,
          gauche: Phaser.Input.Keyboard.KeyCodes.D
        });
      } else if (tile.properties.changement3) {
        keys = this.input.keyboard.addKeys({
          droite: Phaser.Input.Keyboard.KeyCodes.Z,
          haut: Phaser.Input.Keyboard.KeyCodes.Q,
          gauche: Phaser.Input.Keyboard.KeyCodes.S,
          bas: Phaser.Input.Keyboard.KeyCodes.D
        });
      } else if (tile.properties.changement4) {
        keys = this.input.keyboard.addKeys({
          gauche: Phaser.Input.Keyboard.KeyCodes.Z,
          droite: Phaser.Input.Keyboard.KeyCodes.Q,
          bas: Phaser.Input.Keyboard.KeyCodes.S,
          haut: Phaser.Input.Keyboard.KeyCodes.D
        });
      }
    });

    monTimer = this.time.addEvent({
      delay: 1000,
      callback: compteUneSeconde,
      callbackScope: this,
      loop: true
    });
  }

  update() {
    if (keys.haut.isDown) {
      player.setVelocityY(-200); // Déplacement vers le haut
      player.anims.play("anim_monte", true);
    } else if (keys.bas.isDown) {
      player.setVelocityY(200); // Déplacement vers le bas
      player.anims.play("anim_descend", true);
    }
    if (keys.gauche.isDown) {
      player.setVelocityX(-200); // Déplacement vers la gauche
      player.anims.play("anim_tourne_gauche", true);
    } else if (keys.droite.isDown) {
      player.setVelocityX(200); // Déplacement vers la droite
      player.anims.play("anim_tourne_droite", true);
    }

    if (
      !keys.haut.isDown &&
      !keys.bas.isDown &&
      !keys.gauche.isDown &&
      !keys.droite.isDown
    ) {
      player.setVelocityY(0);
      player.setVelocityX(0);
      player.anims.play("anim_face", true);
    }
  }
}

function compteUneSeconde() {
  chrono = chrono + 1; // on incremente le chronometre d'une unite
  console.log(chrono);
  //chronoTexte.setText("Chrono: " + chrono); // mise à jour de l'affichage
  if (chrono == 240) {
    this.scene.start("menu3");
  }
}
