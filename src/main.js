import Phaser from 'phaser'

import TestScene from './scenes/TestScene'
import GameScene from './scenes/GameScene'
import HelloWorldScene from './scenes/HelloWorldScene'

const config = {
	type: Phaser.AUTO,
	width: 800,
	height: 640,
	// scale: {
	// 	mode: Phaser.Scale.RESIZE,
	// 	autoCenter: Phaser.Scale.CENTER_BOTH
	// },
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 500 },
			debug: false,
		},
	},
	scene: [TestScene, GameScene, HelloWorldScene]
}

export default new Phaser.Game(config)
