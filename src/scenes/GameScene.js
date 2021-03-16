import Phaser from 'phaser'

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('game-scene')
    this.isIdle = false
    this.isAttack = false
    this.isJump = false
    this.isSecondJump = false
    this.isGameOver = false
  }

  init() {
    // 禁用鼠标右键默认行为
    document.oncontextmenu = function () {
      return false;
    }
  }

  // 游戏资源预加载
  preload() {
    // 加载背景图片
    this.load.image('background', 'assets/images/background.png')
    // 加载 tiles image 文件
    this.load.image('tiles', 'assets/images/blocks.png')
    // 加载 tiled json 地图文件
    this.load.tilemapTiledJSON('map', 'assets/tilemap/map.json')
    // 加载spritesheet 精灵图
    this.load.spritesheet('hero', 'assets/sprite/hero.png', { frameWidth: 50, frameHeight: 37 })
  }

  // 游戏加载场景,将加载好的资源放进场景中
  create() {

    // create 背景
    this.add.image(0, 0, 'background').setOrigin(0, 0).setScale(1.25, 0.7)

    // create 地图
    this.map = this.make.tilemap({ key: 'map' })
    // console.log(map);
    // create text
    this.add.text(100, -30, 'W 向左移动, D 向右移动      J 攻击, K 跳跃, L 滑行').setColor('black').setFontSize(20).setFontFamily('微软雅黑')

    /*  addTilesetImage第一个参数是我们制作地图的时候选择图块时给图块起的名称，
        第二个参数是我们已经加载的图块图片 */
    const tileset = this.map.addTilesetImage('blocks', 'tiles')

    // create Ground 图层
    this.ground = this.map.createLayer('Ground', tileset, 0, 0)

    this.gem = this.map.createLayer('Gem', tileset, 0, 0)



    // 图层ground设置碰撞属性
    this.ground.setCollisionByExclusion([-1], true)
    this.gem.setCollisionByExclusion([-1], true)
    // this.gem.setCollisionByExclusion([-1], true)

    // create player 设置弹性0.2
    // 添加player与世界碰撞，
    this.player = this.physics.add.sprite(64, 64 * 6, 'hero')
      .setBounce(0).setCollideWorldBounds(true).setScale(2).refreshBody()

    // making the camera follow the player
    this.cameras.main.startFollow(this.player, true, 1, 1, -200, 150);

    // 添加动画
    // player animation
    this.anims.create({ key: 'idle', frames: this.anims.generateFrameNumbers('hero', { start: 0, end: 3 }), frameRate: 7, repeat: -1 })
    this.anims.create({ key: 'idle2', frames: this.anims.generateFrameNumbers('hero', { start: 38, end: 41 }), frameRate: 7, repeat: -1 })
    this.anims.create({ key: 'run', frames: this.anims.generateFrameNumbers('hero', { start: 8, end: 13 }), frameRate: 12, repeat: -1 })
    this.anims.create({ key: 'jump', frames: this.anims.generateFrameNumbers('hero', { start: 14, end: 17 }), frameRate: 10 })
    this.anims.create({ key: 'second_jump', frames: this.anims.generateFrameNumbers('hero', { start: 18, end: 23 }), frameRate: 10 })
    this.anims.create({ key: 'somersault', frames: this.anims.generateFrameNumbers('hero', { start: 18, end: 21 }), frameRate: 10, repeat: 1 })
    this.anims.create({ key: 'fall', frames: this.anims.generateFrameNumbers('hero', { start: 22, end: 23 }), duration: 800 })
    this.anims.create({ key: 'slide', frames: this.anims.generateFrameNumbers('hero', { start: 24, end: 28 }), duration: 800 })
    this.anims.create({ key: 'attack1', frames: this.anims.generateFrameNumbers('hero', { start: 42, end: 46 }), frameRate: 12 })
    this.anims.create({ key: 'attack2', frames: this.anims.generateFrameNumbers('hero', { start: 47, end: 52 }), frameRate: 12 })
    this.anims.create({ key: 'attack3', frames: this.anims.generateFrameNumbers('hero', { start: 43, end: 58 }), frameRate: 12 })
    this.anims.create({ key: 'attack1-air', frames: this.anims.generateFrameNumbers('hero', { start: 96, end: 99 }), frameRate: 12 })
    this.anims.create({ key: 'hero_hurt', frames: this.anims.generateFrameNumbers('hero', { start: 59, end: 61 }), frameRate: 5 })
    this.anims.create({ key: 'hero_die', frames: this.anims.generateFrameNumbers('hero', { start: 62, end: 68 }), frameRate: 8 })

    // 添加碰撞器 ground 和 player碰撞
    this.physics.add.collider(this.player, this.ground)
    this.physics.add.collider(this.player, this.gem, () => {
      this.gem.setCollisionByExclusion([-1], false)
      this.gem.visible = false
      // console.log(this.gem);
      this.isGameOver = !this.isGameOver
    })

    // 键盘控制器
    this.cursors = this.input.keyboard.addKeys('K,L,A,D,J') // 设定按键
    this.isIdle = true
  }

  // 游戏update，以1秒60次预设的频率执行函数的内容
  update() {
    // console.log(this.gem);
    // console.log(this);
    // console.log(this.isIdle);
    // console.log(this.player.body.blocked.down);

    // A键左移动
    if (this.cursors['A'].isDown && this.player.body.blocked.down) {
      this.player.flipX = true
      this.player.body.velocity.x = -150
      this.player.anims.play('run', true)
    }

    // D键右移动
    if (this.cursors['D'].isDown && this.player.body.blocked.down) {
      this.player.flipX = false
      this.player.body.velocity.x = 150
      this.player.anims.play('run', true)
    }

    if (!this.cursors['A'].isDown && this.cursors['D'].isDown && this.player.body.blocked.down) {
      this.isIdle = true
    }

    // idle状态
    if (this.isIdle && this.cursors['A'].isUp && this.cursors['D'].isUp && this.player.body.blocked.down) {
      this.player.body.velocity.x = 0
      this.player.anims.play('idle', true)
    }

    if (this.cursors['L'].isDown && this.player.body.blocked.down) {
      this.isIdle = false
      this.player.body.velocity.x = this.player.flipX ? -140 : 140
      this.player.anims.play('slide', true)
        .once('animationcomplete', () => {
          this.isIdle = true
        })
    }
    // J键攻击
    if (this.cursors['J'].isDown && this.player.body.blocked.down) {
      this.isIdle = false
      this.player.body.velocity.x = 0
      this.player.anims.play('attack1', true)
        .once('animationcomplete', () => {
          this.isIdle = true
        })
    }
    // K键跳跃
    if (this.cursors['K'].isDown && this.player.body.blocked.down) {
      this.isIdle = false
      this.isSecondJump = true
      this.player.body.velocity.y = -200
      this.player.anims.play('jump', true)
        .once('animationcomplete', () => {
          this.isIdle = true
        })
    }

    if (this.isSecondJump && this.cursors['K'].isDown && Math.abs(this.player.body.velocity.y) < 120) {
      this.player.body.velocity.y = -100
      this.player.anims.play('second_jump', true)
        .once('animationcomplete', () => {
          this.isSecondJump = false
        })
    }
    // 跳跃时位移
    if (!this.player.body.blocked.down) {
      if (this.cursors['A'].isDown) {
        this.player.flipX = true
        this.player.body.velocity.x = -150
      } else if (this.cursors['D'].isDown) {
        this.player.flipX = false
        this.player.body.velocity.x = 150
      }
    }

    // 游戏结束重新开始
    if (this.isGameOver) {
      this.isGameOver = !this.isGameOver
      this.scene.restart()
    }
  }

}