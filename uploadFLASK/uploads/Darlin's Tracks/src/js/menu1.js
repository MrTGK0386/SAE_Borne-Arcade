import Phaser from "phaser";

export default class menu1 extends Phaser.Scene {
  constructor() {
    super({ key: "menu1" });
  }
  //on charge les images
  preload() {
    this.load.image("menu_Niv1", "/src/assets/menuNiveau1.png");
  }

  create() {
    const menu1 = this.sound.add("menu1");
    menu1.setVolume(0.3);
    menu1.play();
    // on place les éléments de fond
    const menuFond = this.add.image(0, 0, "menu_Niv1").setOrigin(0).setDepth(0);

    // Définir la taille de l'image (par exemple, largeur = 200 pixels, hauteur = 150 pixels)
    const largeurImage = 1200;
    const hauteurImage = 800;
    menuFond.setScale(
      largeurImage / menuFond.width,
      hauteurImage / menuFond.height
    );

    var hitbox = this.add.rectangle(405, 330, 340, 140);
    hitbox.setOrigin(0.5);
    hitbox.setInteractive({ useHandCursor: true });

    var hitbox2 = this.add.rectangle(79, 721, 90, 90);
    hitbox2.setOrigin(0.5);
    hitbox2.setInteractive({ useHandCursor: true });

    // Créez une image menuAppuyer, initialement hors de l'écran
    const menuAppuyerImage = this.add
      .image(0, 0, "menuAppuyer")
      .setOrigin(0)
      .setDepth(1)
      .setVisible(false);
    //=========================================================
    //on rend le bouton interratif
    hitbox.setInteractive();
    hitbox2.setInteractive();

    //Cas ou la souris passe sur le bouton play
    hitbox.on("pointerover", () => {});
    hitbox2.on("pointerover", () => {});

    //Cas ou la souris ne passe plus sur le bouton play
    hitbox.on("pointerout", () => {});
    hitbox2.on("pointerout", () => {});

    //Cas ou la sourris clique sur le bouton play :
    // on lance le niveau 1
    hitbox.on("pointerup", () => {
      this.scene.start("niveau1");
    });
    hitbox2.on("pointerup", () => {
      this.scene.start("menu");
    });
  }
}
