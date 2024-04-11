import Phaser from "phaser";

export default class menu2 extends Phaser.Scene {
  constructor() {
    super({ key: "menu2" });
  }

  preload() {}

  create() {
    const menu2 = this.sound.add("menu2");
    menu2.setVolume(0.3);
    menu2.play();
    const menuFond = this.add.image(0, 0, "menu_Niv2").setOrigin(0).setDepth(0);
    const largeurImage = 1200;
    const hauteurImage = 800;
    menuFond.setScale(
      largeurImage / menuFond.width,
      hauteurImage / menuFond.height
    );

    // Créez une hitbox rectangulaire verte
    var hitbox = this.add.rectangle(820, 330, 340, 140);
    hitbox.setOrigin(0.5);
    hitbox.setInteractive({ useHandCursor: true });

    var hitbox2 = this.add.rectangle(79, 721, 90, 90);
    hitbox2.setOrigin(0.5);
    hitbox2.setInteractive({ useHandCursor: true });

    //=========================================================

    // Rendre la hitbox interactive
    hitbox.setInteractive();
    hitbox2.setInteractive();

    hitbox.on("pointerover", () => {
      // Le code à exécuter lorsque la souris survole la hitbox
      // Vous pouvez ajouter du code ici pour modifier la couleur ou l'apparence de la hitbox au survol.
    });
    hitbox2.on("pointerover", () => {
      // Vous pouvez ajouter du code ici pour personnaliser l'apparence de la hitbox au survol.
    });

    hitbox.on("pointerout", () => {
      // Le code à exécuter lorsque la souris quitte la hitbox
      // Vous pouvez réinitialiser la couleur de la hitbox ici.
    });
    hitbox2.on("pointerout", () => {
      // Vous pouvez réinitialiser l'apparence de la hitbox ici.
    });

    hitbox.on("pointerup", () => {
      this.scene.start("niveau2");
    });
    hitbox2.on("pointerup", () => {
      this.scene.start("menuu");
    });
  }
}
