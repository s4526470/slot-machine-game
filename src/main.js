import Phaser from 'phaser';
import GameScene from './scenes/GameScene.js';

document.getElementById('start-btn').addEventListener('click', () => {
  document.getElementById('overlay').style.display = 'none';
  document.getElementById('game').style.display = 'block';

  const config = {
    type: Phaser.AUTO,
    width: 1920,
    height: 1080,
    transparent: true,
    parent: 'game',
    scene: [GameScene],
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH
    },
    dom: {
      createContainer: true
    }

  };

  new Phaser.Game(config);
});
