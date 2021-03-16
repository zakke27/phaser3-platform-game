import Phaser from 'phaser'

import GameScene from './scenes/GameScene'

const config = {
	type: Phaser.AUTO,
	width: 1280,
	height: 640,
	backgroundColor: 'rgb(183,231,250)',
	scale: {
		autoCenter: Phaser.Scale.CENTER_BOTH
	},
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 300 },
			debug: false,
		}
	},
	pixelArt: true,
	scene: [GameScene]
}

export default new Phaser.Game(config)
