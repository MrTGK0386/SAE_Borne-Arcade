// chargement des librairies
import Phaser from "phaser";

/***********************************************************************/
/** CONFIGURATION GLOBALE DU JEU ET LANCEMENT 
/***********************************************************************/

// configuration générale du jeu
var player; // désigne le sprite du joueurs
var keys;
var clavier;

var cursors;
var boutonFeu;
var groupeBullets;
var groupemobs;

var groupemobs2;

var groupeitems;

var itemsCollected = 0; // Variable pour suivre le nombre d'items collectés
var porte; // Ajoutez la porte à la scène
var mobs;

var playerLife = 3;

var dialogueText;
var dialogues = [
  "Laurent : Guy, tu m’entends toujours ?",
  "Laurent : Parfait ! Je vois que tu es toujours dans l’enceinte de la prison mais plus dans la partie pénitentiaire.",
  "Laurent : Cette partie est fortement gardée, attention de ne pas mourir.",
  "Laurent : Pour tirer appuie sur ENTER, tu tireras dans la direction que tu regardes.",
  "Laurent : Tu as 3 point de vie, à chaque fois que touchera un ennemi tu réapparaitras au début. Si tu perd les 3 PV tout les mobs réapparaitrons.",
  "Laurent : Pour sortir, récupère les deux objets spéciaux se trouvant sur 2 ennemis gardes.",
  "Laurent : Dès que tu as les deux objets en ta possession, cherche la porte et sort de là !"
];
var dialogueIndex = 0;
var dialogueSpeed = 50; // Vitesse d'affichage du texte

export default class niveau2 extends Phaser.Scene {
  constructor() {
    super({ key: "niveau2" });
    this.paveNumerique = null;
    this.codeTexte = null;
    this.imageCode = null;
    this.codeSpriteSheet = null;
    this.currentFrame = 0;
    this.bubble1 = null;
    this.pointsVieJoueur = 3;
  }

  collisionAvecMob(player, mob) {
    if (this.pointsVieJoueur > 0) {
      this.pointsVieJoueur--; // Décrémentez les points de vie du joueur
      console.log("Points de vie restants : " + this.pointsVieJoueur);

      if (this.pointsVieJoueur <= 0) {
        console.log(
          "Le joueur n'a plus de points de vie, recommencez le niveau !"
        );
        // Vous pouvez réinitialiser le niveau ici
        // Par exemple, en rechargeant la scène ou en effectuant d'autres actions nécessaires
        this.scene.restart("niveau2"); // Ceci redémarrera la scène actuelle
        this.pointsVieJoueur = 3;
      } else {
        // Réinitialisez la position du joueur
        player.setPosition(829, 848); // Remplacez ces coordonnées par la position initiale souhaitée
      }
    }
  }

  interactWithPorte(player, porte) {
    if (itemsCollected >= 2) {
      // Le joueur a collecté au moins 2 objets, vous pouvez passer au niveau suivant ici
      console.log("Niveau suivant !");
      this.scene.start("menu3");
      // Réinitialisez le nombre d'objets collectés
      // Vous pouvez changer de scène ou effectuer d'autres actions pour passer au niveau suivant
    } else {
      console.log("Collectez plus d'objets pour passer au niveau suivant !");
    }
  }

  tirer(player) {
    var coefDirX = 1; // Par défaut, le coefficient X est 1 (tir vers la droite)
    var coefDirY = 0; // Par défaut, le coefficient Y est 0 (pas de tir en haut ou en bas)

    if (keys.q.isDown) {
      coefDirX = -1; // Si le joueur se déplace vers la gauche, le coefficient X est -1
    } else if (keys.d.isDown) {
      coefDirX = 1; // Si le joueur se déplace vers la droite, le coefficient X est 1
    }

    if (keys.z.isDown) {
      coefDirY = -1; // Si le joueur se déplace vers le haut, le coefficient Y est -1
    } else if (keys.s.isDown) {
      coefDirY = 1; // Si le joueur se déplace vers le bas, le coefficient Y est 1
    }

    // Créez la balle à côté du joueur
    var bullet = groupeBullets.create(
      player.x + 25 * coefDirX,
      player.y + 25 * coefDirY,
      "bullet"
    );

    // Paramètres physiques de la balle.
    bullet.setCollideWorldBounds(true);

    // Gestion de la disparition de la balle lorsqu'elle atteint les bords du niveau
    bullet.body.onWorldBounds = true;
    bullet.body.allowGravity = false;
    bullet.setVelocity(1000 * coefDirX, 1000 * coefDirY); // Vitesse en x et en y

    // Événement déclenché lorsque la balle atteint les bords du monde
    this.physics.world.on("worldbounds", (body) => {
      if (body.gameObject === bullet) {
        bullet.destroy(); // Détruisez la balle lorsque elle touche les bords
      }
    });
  }

  hit2(bullet, mob) {
    mob.pointsVie--;
    if (mob.pointsVie == 0) {
      mob.destroy();
    }
    bullet.destroy();
  }

  hit(bullet, mob2) {
    if (mob2.pointsVie > 0) {
      mob2.pointsVie--;

      if (mob2.pointsVie === 0) {
        var item = this.physics.add.image(mob2.x, mob2.y, "item");
        item.setCollideWorldBounds(true);
        item.setBounce(0.2);
        groupeitems.add(item);
        mob2.destroy();
      }

      bullet.destroy();
    }
  }

  collectItem(player, item) {
    item.destroy();
    itemsCollected++;
    console.log("oui");
  }

  preload() {
    this.load.spritesheet("trompette", "/src/assets/sprite-guysaxo.png", {
      frameWidth: 42,
      frameHeight: 44
    });
    this.load.image("mechant", "/src/assets/mechant.png");
  }

  create() {
    const musique2 = this.sound.add("musique2");
    musique2.setVolume(0.3);
    musique2.play();

    this.events.on("shutdown", () => {
      // Cet événement est déclenché lorsque la scène est détruite.
      // Vous pouvez y arrêter la musique "musiqueM".
      musique2.stop();
    });

    const map = this.add.tilemap("carte2");
    this.cameras.main.zoom = 1.5;

    // chargement du jeu de tuiles
    const tileset = map.addTilesetImage("map2_sol_mur", "Phaser_tuile2");
    const tileset2 = map.addTilesetImage("map2_furniture", "Maison2");

    this.sol = map.createDynamicLayer("sol", [tileset, tileset2]);
    const mur = map.createDynamicLayer("mur", [tileset, tileset2]);
    const meuble = map.createDynamicLayer("meubles", [tileset, tileset2]);
    mur.setCollisionByProperty({ solide: true });
    meuble.setCollisionByProperty({ solide: true });
    meuble.setCollisionByProperty({ interaction: true });

    // On créée un nouveeau personnage : player et les PNJ

    player = this.physics.add.sprite(829, 848, "trompette");
    this.physics.add.collider(player, mur);
    this.physics.add.collider(player, meuble);
    this.physics.add.collider(player, meuble);
    //  propriétées physiqyes de l'objet player :
    player.setCollideWorldBounds(true); // le player se cognera contre les bords du monde
    player.body.setSize(30, 28);
    this.physics.world.setBounds(0, 0, 3200, 960);
    porte = this.physics.add.staticSprite(622, 60, "img_porte1");
    porte.setVisible(false);

    this.physics.add.collider(porte, mur);
    this.physics.add.overlap(player, porte, this.interactWithPorte, null, this);

    //  ajout du champs de la caméra de taille identique à celle du monde
    this.cameras.main.setBounds(0, 0, 3200, 960);
    // ancrage de la caméra sur le joueur
    this.cameras.main.startFollow(player);
    this.cameras.main.zoom = 2.3;

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
      frames: this.anims.generateFrameNumbers("trompette", {
        start: 5,
        end: 3
      }), // on prend toutes les frames de img perso numerotées de 0 à 3
      frameRate: 10, // vitesse de défilement des frames
      repeat: -1 // nombre de répétitions de l'animation. -1 = infini
    });

    this.anims.create({
      key: "anim_descend", // key est le nom de l'animation : doit etre unique poru la scene.
      frames: this.anims.generateFrameNumbers("trompette", {
        start: 9,
        end: 11
      }), // on prend toutes les frames de img perso numerotées de 0 à 3
      frameRate: 10, // vitesse de défilement des frames
      repeat: -1 // nombre de répétitions de l'animation. -1 = infini
    });

    this.anims.create({
      key: "anim_monte", // key est le nom de l'animation : doit etre unique poru la scene.
      frames: this.anims.generateFrameNumbers("trompette", {
        start: 6,
        end: 8
      }), // on prend toutes les frames de img perso numerotées de 0 à 3
      frameRate: 10, // vitesse de défilement des frames
      repeat: -1 // nombre de répétitions de l'animation. -1 = infini
    });

    // creation de l'animation "anim_tourne_face" qui sera jouée sur le player lorsque ce dernier n'avance pas.
    this.anims.create({
      key: "anim_face",
      frames: [{ key: "trompette", frame: 1 }],
      frameRate: 20
    });

    // creation de l'animation "anim_tourne_droite" qui sera jouée sur le player lorsque ce dernier tourne à droite
    this.anims.create({
      key: "anim_tourne_droite",
      frames: this.anims.generateFrameNumbers("trompette", {
        start: 0,
        end: 2
      }),
      frameRate: 10,
      repeat: -1
    });

    cursors = this.input.keyboard.createCursorKeys();
    boutonFeu = this.input.keyboard.addKey("ENTER");

    groupemobs = this.physics.add.group();
    this.physics.add.collider(groupemobs, mur);
    this.physics.add.collider(groupemobs, meuble);

    groupemobs2 = this.physics.add.group();
    groupeitems = this.physics.add.group();
    this.physics.add.overlap(player, groupeitems, this.collectItem, null, this);
    this.physics.add.collider(groupemobs2, mur);
    this.physics.add.collider(groupemobs2, meuble);

    groupeBullets = this.physics.add.group();
    this.physics.add.collider(groupeBullets, mur, function (bullet, tile) {
      bullet.destroy(); // Détruisez la balle lorsqu'elle entre en collision avec un mur
    });

    var mob1 = groupemobs.create(1074, 557, "mechant");
    mob1.pointsVie = 3;
    mob1.setSize(550, 500);

    var mob2 = groupemobs.create(1203, 493, "mechant");
    mob2.pointsVie = 3;
    mob2.setSize(550, 500);

    var mob3 = groupemobs.create(1002, 518, "mechant");
    mob3.pointsVie = 3;
    mob3.setSize(550, 500);

    var mob4 = groupemobs.create(1616, 789, "mechant");
    mob4.pointsVie = 3;
    mob4.setSize(550, 500);

    var mob5 = groupemobs.create(1418, 114, "mechant");
    mob5.pointsVie = 3;
    mob5.setSize(550, 500);

    var mob6 = groupemobs.create(885, 232, "mechant");
    mob6.pointsVie = 3;
    mob6.setSize(550, 500);

    var mob7 = groupemobs.create(330, 301, "mechant");
    mob7.pointsVie = 3;
    mob7.setSize(550, 500);

    var mob8 = groupemobs.create(303, 816, "mechant");
    mob8.pointsVie = 3;
    mob8.setSize(550, 500);

    var mob9 = groupemobs.create(82, 812, "mechant");
    mob9.pointsVie = 3;
    mob9.setSize(550, 500);

    var mob10 = groupemobs.create(570, 630, "mechant");
    mob10.pointsVie = 3;
    mob10.setSize(550, 500);

    var mob11 = groupemobs.create(1722, 734, "mechant");
    mob11.pointsVie = 3;
    mob11.setSize(550, 500);

    var mob12 = groupemobs.create(1601, 389, "mechant");
    mob12.pointsVie = 3;
    mob12.setSize(550, 500);

    var mob13 = groupemobs2.create(1780, 120, "mechant");
    mob13.pointsVie = 15;
    mob13.setSize(550, 500);

    var mob14 = groupemobs2.create(1123, 396, "mechant");
    mob14.pointsVie = 15;
    mob14.setSize(550, 500);

    this.physics.add.overlap(groupeBullets, groupemobs, this.hit2, null, this);
    this.physics.add.overlap(groupeBullets, groupemobs2, this.hit, null, this);
    this.physics.add.overlap(
      player,
      groupemobs,
      this.collisionAvecMob,
      null,
      this
    );
    this.physics.add.overlap(
      player,
      groupemobs2,
      this.collisionAvecMob,
      null,
      this
    );

    groupemobs.children.iterate(function (mob) {
      mob.direction = 1; // 1 pour descendre, -1 pour monter
      mob.setScale(0.1);
    });

    groupemobs2.children.iterate(function (mob2) {
      mob2.direction = 1; // 1 pour descendre, -1 pour monter
      mob2.setScale(0.1);
    });

    this.pointsDeVieText = this.add.text(player.x - 16, player.y - 40, "", {
      fontSize: "24px",
      fill: "#fff"
    });
    this.pointsDeVieText.setOrigin(0.8);
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

    clavier = this.input.keyboard.createCursorKeys();

    this.codeSpriteSheet = this.textures.get("sprite_code"); // Remplacez "votre_sprite_sheet" par le nom de votre sprite sheet

    // Créez un sprite qui affiche le sprite sheet
    this.codeSprite = this.add.sprite(570, 370, "sprite_code"); // Remplacez "votre_sprite_sheet" par le nom de votre sprite sheet

    // Cachez le sprite initialement
    this.codeSprite.setVisible(false);
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

    if (Phaser.Input.Keyboard.JustDown(boutonFeu)) {
      console.log("Tir effectué");
      this.tirer(player);
    }

    groupemobs.children.iterate(function (mob) {
      if (mob.direction === 1) {
        // Si la direction est descendante
        mob.setVelocityY(200); // Déplacement vers le bas
        if (mob.body.blocked.down) {
          // Si le mob est bloqué en bas
          mob.direction = -1; // Changez la direction pour monter
          mob.setVelocityY(-200); // Déplacement vers le haut
        }
      } else if (mob.direction === -1) {
        // Si la direction est montante
        mob.setVelocityY(-200); // Déplacement vers le haut
        if (mob.body.blocked.up) {
          // Si le mob est bloqué en haut
          mob.direction = 1; // Changez la direction pour descendre
          mob.setVelocityY(200); // Déplacement vers le bas
        }
      }
    });

    groupemobs2.children.iterate(function (mob2) {
      if (mob2.direction === 1) {
        // Si la direction est descendante
        mob2.setVelocityY(200); // Déplacement vers le bas
        if (mob2.body.blocked.down) {
          // Si le mob est bloqué en bas
          mob2.direction = -1; // Changez la direction pour monter
          mob2.setVelocityY(-200); // Déplacement vers le haut
        }
      } else if (mob2.direction === -1) {
        // Si la direction est montante
        mob2.setVelocityY(-200); // Déplacement vers le haut
        if (mob2.body.blocked.up) {
          // Si le est bloqué en haut
          mob2.direction = 1; // Changez la direction pour descendre
          mob2.setVelocityY(200); // Déplacement vers le bas
        }
      }
    });

    this.pointsDeVieText.setPosition(player.x, player.y - 40);
    this.pointsDeVieText.setText(this.pointsVieJoueur);
  }
}
