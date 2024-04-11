// chargement des librairies
import Phaser from "phaser";

/***********************************************************************/
/** CONFIGURATION GLOBALE DU JEU ET LANCEMENT 
/***********************************************************************/

// configuration générale du jeu
var player; // désigne le sprite du joueurs
var keys;
var clavier;
var pnj;
var pnj2;
var pnj3;
var pnj4;
var zone_texte;
var zone_texte2;
var zone_texte3;
var zone_texte4;

var ouverture;
var code = "";
var vide = "    ";
var codeAttendu = "1986"; // Le code attendu pour ouvrir la porte
var porteOuverte = false;
var tentativeOuverture = false;

var dialogueText;
var dialogues = [
  "Laurent : Allô ? Guy tu es là ?",
  "Laurent : Mon dieu, je me sens tellement soulagé de savoir que tu es en vie.",
  "Laurent : Ce Christo, quel tyran ! Ne t’inquiète pas, on va te sortir de là.",
  "Laurent : Pour te déplacer tu peux utiliser les commandes ZQSD.",
  "Laurent : Pour sortir de cette prison, il faudra que tu ouvres la porte qui comporte un code secret.",
  "Laurent : Discute avec les personnes de la prison pour avoir des indices sur les chiffres.",
  "Laurent : Pour ouvrir le digicode utilise ESPACE et noublie pas de valider ton code avec ENTER. (Sur MAC, sans pavé numérique : maintenir SHIFT + chiffre)",
  "Laurent : Explore la prison pour en savoir plus, bonne chance."
];
var dialogueIndex = 0;
var dialogueSpeed = 50; // Vitesse d'affichage du texte

export default class niveau1 extends Phaser.Scene {
  constructor() {
    super({ key: "niveau1" });
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

  createSpeechBubble(x, y, width, height, text) {
    const bubbleWidth = width;
    const bubbleHeight = height;
    const bubblePadding = 10;
    const arrowHeight = bubbleHeight / 3;

    const bubble = this.add.graphics({ x: x, y: y });

    // Bubble shadow
    bubble.fillStyle(0x222222, 0.5);
    bubble.fillRoundedRect(6, 6, bubbleWidth, bubbleHeight, 30);

    // Bubble color
    bubble.fillStyle(0xffffff, 1);

    // Bubble outline line style
    bubble.lineStyle(4, 0x565656, 1);

    // Bubble shape and outline
    bubble.strokeRoundedRect(0, 0, bubbleWidth, bubbleHeight, 30);
    bubble.fillRoundedRect(0, 0, bubbleWidth, bubbleHeight, 30);

    // Calculate arrow coordinates
    const point1X = Math.floor(bubbleWidth / 4);
    const point1Y = bubbleHeight;
    const point2X = Math.floor((bubbleWidth / 4) * 1.4);
    const point2Y = bubbleHeight;
    const point3X = Math.floor(bubbleWidth / 4);
    const point3Y = Math.floor(bubbleHeight + arrowHeight);

    // Bubble arrow shadow
    bubble.lineStyle(4, 0x222222, 0.5);
    bubble.lineBetween(point2X - 1, point2Y + 6, point3X + 2, point3Y);

    // Bubble arrow fill
    bubble.fillTriangle(point1X, point1Y, point2X, point2Y, point3X, point3Y);
    bubble.lineStyle(2, 0x565656, 1);
    bubble.lineBetween(point2X, point2Y, point3X, point3Y);
    bubble.lineBetween(point1X, point1Y, point3X, point3Y);

    const content = this.add.text(0, 0, text, {
      fontFamily: "Arial",
      fontSize: 20,
      color: "#000000",
      align: "center",
      wordWrap: { width: bubbleWidth - bubblePadding * 2 }
    });

    const b = content.getBounds();

    content.setPosition(
      bubble.x + bubbleWidth / 2 - b.width / 2,
      bubble.y + bubbleHeight / 2 - b.height / 2
    );

    const container = this.add.container();
    container.add([bubble, content]);

    return container;
  }

  create() {
    const musique1 = this.sound.add("musique1");
    musique1.setVolume(0.3);
    musique1.play();

    this.events.on("shutdown", () => {
      // Cet événement est déclenché lorsque la scène est détruite.
      // Vous pouvez y arrêter la musique "musiqueM".
      musique1.stop();
    });

    const map = this.add.tilemap("carte");
    this.cameras.main.zoom = 1.5;

    // chargement du jeu de tuiles
    const tileset = map.addTilesetImage("sol_mur", "Phaser_tuile");
    const tileset2 = map.addTilesetImage("Sci_furniture", "Maison");

    const mur = map.createDynamicLayer("mur", [tileset, tileset2]);
    this.sol = map.createDynamicLayer("sol", [tileset, tileset2]);
    const meuble = map.createDynamicLayer("meubles", [tileset, tileset2]);
    mur.setCollisionByProperty({ solide: true });
    meuble.setCollisionByProperty({ solide: true });
    meuble.setCollisionByProperty({ interaction: true });

    var explos;
    explos = this.sound.add("explosion");
    // On créée un nouveeau personnage : player et les PNJ

    player = this.physics.add.sprite(400, 777, "img_perso");
    this.pnj = this.physics.add.sprite(130, 480, "pnj");
    this.pnj.body.setSize(70, 70);
    this.pnj2 = this.physics.add.sprite(1521, 133, "pnj2");
    this.pnj2.body.setSize(70, 70);
    this.pnj3 = this.physics.add.sprite(825, 570, "pnj3");
    this.pnj3.body.setSize(70, 70);
    this.pnj4 = this.physics.add.sprite(855, 895, "pnj4");
    this.pnj4.body.setSize(70, 70);
    this.porte = this.physics.add.staticSprite(1104, 271, "img_porte1");
    this.porte.setVisible(false);
    this.physics.add.collider(player, mur);
    this.physics.add.collider(player, meuble);
    this.physics.add.collider(player, meuble);
    //  propriétées physiqyes de l'objet player :
    player.setCollideWorldBounds(true); // le player se cognera contre les bords du monde
    player.body.setSize(30, 28);
    this.physics.world.setBounds(0, 0, 3200, 960);

    //Propriété PNJ
    this.pnj.setCollideWorldBounds(true);
    this.pnj2.setCollideWorldBounds(true);
    this.pnj3.setCollideWorldBounds(true);
    this.pnj4.setCollideWorldBounds(true);

    //  ajout du champs de la caméra de taille identique à celle du monde
    this.cameras.main.setBounds(0, 0, 3200, 960);
    // ancrage de la caméra sur le joueur
    this.cameras.main.startFollow(player);
    this.cameras.main.zoom = 2.3;

    meuble.setTileLocationCallback(41, code, this);

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

    /***********************
     *  CREATION DU CLAVIER *
     ************************/
    // ceci permet de creer un clavier et de mapper des touches, connaitre l'état des touches
    keys = this.input.keyboard.addKeys({
      z: Phaser.Input.Keyboard.KeyCodes.Z,
      q: Phaser.Input.Keyboard.KeyCodes.Q,
      s: Phaser.Input.Keyboard.KeyCodes.S,
      d: Phaser.Input.Keyboard.KeyCodes.D
    });

    ouverture = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );
    clavier = this.input.keyboard.createCursorKeys();

    //ZONES DE TEXTE
    // Create speech bubbles for your PNJs
    this.bubble1 = this.createSpeechBubble(
      83,
      315,
      200,
      110,
      "Dans le dortoir, il y a pile le nombre de lits qu’il nous faut, je vous l’assure !"
    );
    this.bubble2 = this.createSpeechBubble(
      1500,
      10,
      200,
      90,
      "Le menu change 6 fois dans la semaine."
    );
    this.bubble3 = this.createSpeechBubble(
      775,
      400,
      200,
      115,
      "Arg, Combien déja ? Pouvez-vous m'aider à compter les petites ventilations ?"
    );
    this.bubble4 = this.createSpeechBubble(
      810,
      650,
      200,
      165,
      "Un chiffre ? moi ? ça fait longtemps que je suis là, on me l’a donné par dépit… C’est 9 mais ça va pas t’aider mon pote."
    );

    this.bubble1.setVisible(false);
    this.bubble2.setVisible(false);
    this.bubble3.setVisible(false);
    this.bubble4.setVisible(false);

    this.codeSpriteSheet = this.textures.get("sprite_code"); // Remplacez "votre_sprite_sheet" par le nom de votre sprite sheet

    // Créez un sprite qui affiche le sprite sheet
    this.codeSprite = this.add.sprite(1100, 270, "sprite_code"); // Remplacez "votre_sprite_sheet" par le nom de votre sprite sheet
    this.codeSprite.setScale(0.5);

    // Cachez le sprite initialement
    this.codeSprite.setVisible(false);

    //PORTE FINAL CODE
    this.input.keyboard.on(
      "keydown",
      function (event) {
        if (!porteOuverte) {
          if (event.key >= "0" && event.key <= "9") {
            this.currentFrame++;
            // Si une touche numérique est pressée, ajoutez le chiffre au code
            code += event.key;
          } else if (event.key === "Enter") {
            // Si la touche "Entrée" est pressée, vérifiez le code
            if (code === codeAttendu) {
              // Code correct, ouvrez la porte
              porteOuverte = true;
              // Transition vers la scène suivante (par exemple "niveauSuivant")
              this.scene.start("menu2");
            } else {
              // Code incorrect, réinitialisez le code
              code = "";
            }
          }
        }
      },
      this
    );
  }

  update() {
    /// Gestion du déplacement du personnage en fonction des touches appuyées
    // Gestion du déplacement du personnage en fonction des touches appuyées
    if (keys.z.isDown) {
      player.setVelocityY(-200); // Déplacement vers le haut
      player.anims.play("anim_monte", true);
    } else if (keys.s.isDown) {
      player.setVelocityY(200); // Déplacement vers le bas
      player.anims.play("anim_descend", true);
    }
    if (keys.q.isDown) {
      player.setVelocityX(-200); // Déplacement vers la gauche
      player.anims.play("anim_tourne_gauche", true);
    } else if (keys.d.isDown) {
      player.setVelocityX(200); // Déplacement vers la droite
      player.anims.play("anim_tourne_droite", true);
    }

    if (!keys.z.isDown && !keys.s.isDown && !keys.q.isDown && !keys.d.isDown) {
      player.setVelocityY(0);
      player.setVelocityX(0);
      player.anims.play("anim_face", true);
    }

    if (this.physics.overlap(player, this.pnj)) {
      this.bubble1.setVisible(true);
    } else {
      this.bubble1.setVisible(false);
    }

    if (this.physics.overlap(player, this.pnj2)) {
      this.bubble2.setVisible(true);
    } else {
      this.bubble2.setVisible(false);
    }

    if (this.physics.overlap(player, this.pnj3)) {
      this.bubble3.setVisible(true);
    } else {
      this.bubble3.setVisible(false);
    }

    if (this.physics.overlap(player, this.pnj4)) {
      this.bubble4.setVisible(true);
    } else {
      this.bubble4.setVisible(false);
    }

    if (!porteOuverte) {
      if (Phaser.Input.Keyboard.JustDown(ouverture)) {
        tentativeOuverture = true;
      }
    }

    // Calculer la distance entre le joueur et la porte
    const distancePlayerToDoor = Phaser.Math.Distance.Between(
      player.x,
      player.y,
      this.porte.x,
      this.porte.y
    );

    if (!porteOuverte && tentativeOuverture) {
      // Si la distance dépasse un certain seuil (par exemple, 100 pixels), masquez l'image du code
      if (distancePlayerToDoor > 30) {
        this.codeSprite.setVisible(false);
      } else {
        // La porte n'est pas ouverte et une tentative d'ouverture est en cours
        // Affichez la région du sprite sheet correspondant au code
        this.codeSprite.setFrame(this.currentFrame);
        this.codeSprite.setVisible(true);
      }
    } else {
      // La porte est déjà ouverte, la touche "E" n'a pas été enfoncée, ou le joueur n'est pas devant la porte
      // Masquez le sprite
      this.codeSprite.setVisible(false);
    }

    if (code.length === 4 && code !== codeAttendu) {
      // Réinitialisez le code
      code = "";
      this.currentFrame++;
      this.time.delayedCall(
        1000,
        function () {
          this.currentFrame = 0;
        },
        null,
        this
      );
    }
  }
}
