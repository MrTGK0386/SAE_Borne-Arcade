import Phaser from "phaser";

export default class menuuu extends Phaser.Scene {
  constructor() {
    super({ key: "menuuu" });
  }

  preload() {}

  create() {
    const menuFond = this.add.image(0, 0, "menu_fond").setOrigin(0).setDepth(0);

    const largeurImage = 1200;
    const hauteurImage = 800;
    menuFond.setScale(
      largeurImage / menuFond.width,
      hauteurImage / menuFond.height
    );

    var hitbox = this.add.rectangle(615, 490, 440, 180, 0x00ff00, 0);
    hitbox.setOrigin(0.5);
    hitbox.setInteractive({ useHandCursor: true });

    // Créez une image menuAppuyer, initialement hors de l'écran
    const menuAppuyerImage = this.add
      .image(0, 0, "menuAppuyer")
      .setOrigin(0)
      .setDepth(1)
      .setVisible(false);

    hitbox.on("pointerover", () => {
      // Affichez l'image menuAppuyer lorsque la souris survole la hitbox
      menuAppuyerImage.setVisible(true);
    });

    hitbox.on("pointerout", () => {
      // Masquez l'image menuAppuyer lorsque la souris ne survole plus la hitbox
      menuAppuyerImage.setVisible(false);
    });

    hitbox.on("pointerup", () => {
      // Code pour passer à la scène "menu1" lorsque la hitbox est cliquée
      this.scene.start("menu3");
    });
  }
}
