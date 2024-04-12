/* global colors, Phaser */

class Example extends Phaser.Scene {
  constructor() {
    super("example");
  }

  preload() {
    this.load.image("ground_1x1", "assets/tilemaps/tiles/ground_1x1.png");
    this.load.spritesheet("coin", "assets/sprites/coin.png", {
      frameWidth: 32,
      frameHeight: 32
    });
    this.load.tilemapTiledJSON(
      "map",
      "assets/tilemaps/maps/tile-collision-test.json"
    );
    this.load.image("player", "assets/sprites/phaser-dude.png");
    this.load.image("mask", "assets/sprites/mask1.png");
  }

  create() {
    const map = this.make.tilemap({ key: "map" });

    const groundTiles = map.addTilesetImage("ground_1x1");

    const backgroundLayer = map.createLayer(
      "Background Layer",
      groundTiles,
      0,
      0
    );
    const groundLayer = map.createLayer("Ground Layer", groundTiles, 0, 0);

    //  Our fake RenderTexture mask goes here, above the layers, but below the player.
    //  For performance, we want it to be the size of the canvas, _not_ the whole map!
    this.rt = this.add
      .renderTexture(0, 0, this.scale.width, this.scale.height)
      .setOrigin(0, 0)
      //  Make sure it doesn't scroll with the camera
      .setScrollFactor(0, 0);

    groundLayer.setCollisionBetween(1, 25);

    this.player = this.physics.add.sprite(320, 320, "player");

    this.physics.add.collider(this.player, groundLayer);

    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cameras.main.startFollow(this.player);

    this.cursors = this.input.keyboard.createCursorKeys();
  }

  update() {
    const cam = this.cameras.main;

    //  Clear the RenderTexture
    this.rt.clear();

    //  Fill 2 regions in black. Adjust for the camera scroll since the RenderTexture is pinned to the screen.
    this.rt.fill(0, 1, 384 - cam.scrollX, 160 - cam.scrollY, 288, 160);
    this.rt.fill(0, 1, 384 - cam.scrollX, 384 - cam.scrollY, 224, 128);

    //  Erase the 'mask' texture from the RenderTexture based on the player position.
    //  We subtract half the mask's dimensions so it's centered on the player.
    //  Adjust for the camera scroll since the RenderTexture is pinned to the screen.
    const { halfWidth, halfHeight } = this.textures.getFrame("mask");

    this.rt.erase(
      "mask",
      this.player.x - halfWidth - cam.scrollX,
      this.player.y - halfHeight - cam.scrollY
    );

    //  Move the player.

    const { left, right, up, down } = this.cursors;

    this.player.body.setVelocity(0, 0);

    if (this.cursors.left.isDown) {
      this.player.body.setVelocityX(-256);
    } else if (this.cursors.right.isDown) {
      this.player.body.setVelocityX(256);
    }

    if (up.isDown) {
      this.player.body.setVelocityY(-256);
    } else if (down.isDown) {
      this.player.body.setVelocityY(256);
    }
  }
}

const config = {
  width: 800,
  height: 576,
  //  <http://clrs.cc>
  backgroundColor: colors.hexColors.olive,
  loader: {
    baseURL: "https://labs.phaser.io",
    crossOrigin: "anonymous"
  },
  physics: {
    default: "arcade",
    arcade: { gravity: { y: 0 } }
  },
  scene: Example
};

document.getElementById("version").textContent = `Phaser v${Phaser.VERSION}`;

new Phaser.Game(config);