import Phaser from "phaser";

export default class menu3 extends Phaser.Scene {
  constructor() {
    super({ key: "menu3" });
  }

  //on charge les images
  preload() {}

  create() {
    const menu3 = this.sound.add("menu3");
    menu3.setVolume(0.3);
    menu3.play();
    // on place les éléments de fond
    const menuFond = this.add.image(0, 0, "menuNiv3").setOrigin(0).setDepth(0);

    // Définir la taille de l'image (par exemple, largeur = 200 pixels, hauteur = 150 pixels)
    const largeurImage = 1200;
    const hauteurImage = 800;
    menuFond.setScale(
      largeurImage / menuFond.width,
      hauteurImage / menuFond.height
    );

    // Créez une hitbox rectangulaire blanche
    var hitbox = this.add.rectangle(405, 535, 340, 140);
    hitbox.setOrigin(0.5);
    hitbox.setInteractive({ useHandCursor: true });

    var hitbox2 = this.add.rectangle(79, 721, 90, 90);
    hitbox2.setOrigin(0.5);
    hitbox2.setInteractive({ useHandCursor: true });

    //=========================================================

    // On rend le bouton interactif
    hitbox.setInteractive();
    hitbox2.setInteractive();

    // Cas où la souris passe sur le bouton play
    hitbox.on("pointerover", () => {
      // Vous pouvez ajouter du code ici pour personnaliser l'apparence de la hitbox au survol.
    });
    hitbox2.on("pointerover", () => {
      // Vous pouvez ajouter du code ici pour personnaliser l'apparence de la hitbox au survol.
    });

    // Cas où la souris ne passe plus sur le bouton play
    hitbox.on("pointerout", () => {
      // Vous pouvez réinitialiser l'apparence de la hitbox ici.
    });
    hitbox2.on("pointerout", () => {
      // Vous pouvez réinitialiser l'apparence de la hitbox ici.
    });

    // Cas où la souris clique sur le bouton play :
    // On lance le niveau 2
    hitbox.on("pointerup", () => {
      this.scene.start("niveau3");
    });
    hitbox2.on("pointerup", () => {
      this.scene.start("menuuu");
    });
  }
}
