import Phaser from "phaser";
import menu from "/src/js/menu.js";
import menu1 from "/src/js/menu1.js";
import menu2 from "/src/js/menu2.js";
import menu3 from "/src/js/menu3.js";
import menu4 from "/src/js/menu4.js";
import niveau1 from "/src/js/niveau1.js";
import niveau2 from "/src/js/niveau2.js";
import niveau3 from "/src/js/niveau3.js";
import niveau4 from "/src/js/niveau4.js";
import menuu from "/src/js/menuu.js";
import menuuu from "/src/js/menuuu.js";
import menuuuu from "/src/js/menuuuu.js";

var config = {
  type: Phaser.AUTO,
  width: 1200,
  height: 800,
  physics: {
    default: "arcade",
    arcade: {
      debug: false
    }
  },
  scene: [
    menu,
    menu1,
    niveau1,
    menu2,
    menuu,
    niveau2,
    menu3,
    menuuu,
    niveau3,
    menu4,
    menuuuu,
    niveau4
  ],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  }
};

// création et lancement du jeu à partir de la configuration config
var game = new Phaser.Game(config);
game.scene.start("menu"); // lancement de la scene selection
