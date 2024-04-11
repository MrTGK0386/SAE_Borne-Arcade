import Phaser from "phaser";

export default class menu extends Phaser.Scene {
  constructor() {
    super({ key: "menu" });
  }

  preload() {
    this.load.image("menu_fond", "/src/assets/menu.png");
    this.load.image("menu_Niv1", "/src/assets/menuNiveau1.png");
    this.load.image("menuNiv3", "/src/assets/menuNiv3.png");
    this.load.image("menu_Niv2", "/src/assets/menuNiveau2.png");
    this.load.image("menuNiv4", "/src/assets/menuNiv4.png");
    this.load.image("item", "/src/assets/identityDisc.png");
    this.load.image("menuAppuyer", "/src/assets/menuAppuyer.png"); // Chargez l'image menuAppuyer
    this.load.image("Phaser_tuile", "src/assets/tileset.png");
    this.load.image("dude", "src/assets/prisonnier.png");
    this.load.image("bullet", "src/assets/note.png");
    this.load.image("Maison", "src/assets/tilemeubles.png");
    this.load.image("Phaser_tuile2", "src/assets/map2_s.png");
    this.load.image("Maison2", "src/assets/map2_f.png");
    this.load.tilemapTiledJSON("carte", "src/assets/niveau1.json");
    this.load.tilemapTiledJSON("carte2", "src/assets/niveau2.json");
    this.load.image("img_porte1", "src/assets/porte.png");
    this.load.spritesheet("sprite_code", "src/assets/spriteCode.png", {
      frameWidth: 590,
      frameHeight: 482
    });
    this.load.audio("explosion", "src/assets/explo.mp3");
    this.load.image("pnj3", "/src/assets/arbitre.png");
    this.load.image("pnj2", "/src/assets/cuisto.png");
    this.load.image("pnj", "/src/assets/menage.png");
    this.load.image("pnj4", "/src/assets/prisonnier.png");
    this.load.image("Phaser_tuile3", "src/assets/sol.png");
    this.load.image("Meuble", "src/assets/map3_f.png");
    this.load.tilemapTiledJSON("carte3", "src/assets/niveau3.json");
    this.load.image("Phaser_tuile4", "src/assets/sol.png");
    this.load.image("Meuble4", "src/assets/map2_f.png");
    this.load.tilemapTiledJSON("carte4", "src/assets/niveau4.json");
    this.load.audio("musique3", "src/assets/TechTalk.mp3");
    this.load.audio("musique1", "src/assets/Ectoplasm.mp3");
    this.load.audio("musique2", "src/assets/combat.mp3");
    this.load.audio("musiqueM", "src/assets/Cyberpunk.mp3");
    this.load.audio("menu1", "src/assets/around-the-world.mp3");
    this.load.audio("menu3", "src/assets/get-lucky.mp3");
    this.load.audio("menu4", "src/assets/harder-better-faster-stronger.mp3");
    this.load.audio("menu2", "src/assets/robot-rock.mp3");
    this.load.audio("musique4", "src/assets/niveau4.mp3");
  }

  create() {
    const musiqueM = this.sound.add("musiqueM");
    musiqueM.setVolume(0.3);
    musiqueM.play();

    this.events.on("shutdown", () => {
      musiqueM.stop();
    });

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
      this.scene.start("menu1");
    });
  }
}
