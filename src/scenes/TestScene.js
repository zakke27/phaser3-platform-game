import Phaser from 'phaser'

export default class TestScene extends Phaser.Scene {
  constructor() {
    super('test-scene')
  }

  preload() {
    // 加载背景图片
    this.load.image('background', 'assets/images/background.png')
    //加载tile image 文件
    this.load.image('tiles', 'assets/tilesets/assets.png')
    this.load.tilemapTiledJSON('map', 'assets/tilemaps/level1.json')
    this.load.spritesheet('sadon',
      'assets/sadon.png',
      { frameWidth: 64, frameHeight: 64 }
    )

  }

  create() {
    this.add.image(0, 0, 'background').setOrigin(0, 0).setScale(2, 0.8)
    const map = this.make.tilemap({ key: 'map' })
    const tileset = map.addTilesetImage('assets', 'tiles')

    const ground = map.createStaticLayer('Ground', tileset, 0, 200)
    // @ts-ignore
    ground.setCollisionByExclusion(-1, true);

    this.player = this.physics.add.sprite(50, 300, 'sadon').setBounce(0.1).setCollideWorldBounds(true)

    this.physics.add.collider(this.player, ground);

    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('sadon', { start: 3, end: 5 }),
      frameRate: 10,
      repeat: -1
    })

    this.anims.create({
      key: 'turn',
      frames: [{ key: 'sadon', frame: 2 }],
      frameRate: 20
    })

    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('sadon', { start: 6, end: 8 }),
      frameRate: 10,
      repeat: -1
    })

    // this.cursors = this.input.keyboard.createCursorKeys()
    this.cursors = this.input.keyboard.addKeys(
      {
        up: Phaser.Input.Keyboard.KeyCodes.W,
        down: Phaser.Input.Keyboard.KeyCodes.S,
        left: Phaser.Input.Keyboard.KeyCodes.A,
        right: Phaser.Input.Keyboard.KeyCodes.D
      });
    // this.cursors = this.input.keyboard.createCursorKeys()
  }

  update() {
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-160)

      this.player.anims.play('left', true)
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(160)

      this.player.anims.play('right', true)
    } else if (this.cursors.up.isDown) {
      this.player.setVelocityY(-300)

    } else {
      this.player.setVelocityX(0)

      this.player.anims.play('turn')
    }
    if (this.cursors.up.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(-330)
    }
  }
}