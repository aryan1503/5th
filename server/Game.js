'use strict';

const GameConfig = require('../lib/Config');
const AbstractGame = require('../lib/AbstractGame');
const Timer = require('../lib/Timer');
const Utils = require('../lib/Utils');
const AbstractCell = require('../lib/AbstractCell');

const Config = require('./Config');
const Player = require('./Player');
const Network = require('./Network');

class Game extends AbstractGame {
  constructor(server) {
    super();

    const that = this;

    this.network = new Network(this, server);
    this.gameLoop = new Timer(Config.networkTimestep, function(delta) {
      that.update(delta);
    });

    this.generateFood(50);
  }

  start() {
    this.gameLoop.start();
  }

  update(delta) {
    super.update(delta);

    // Respawn all dead players
    for (const player of this.players.values()) {
      if (!player.isAlive) {
        if (player.getBody().length > GameConfig.player.defaultLength) {
          this.generateFood(player.getBody().length);
        }

        this.network.respawn(player);
      }
    }

    this.network.sendUpdates();
    this.clearEvents();
  }

  generateFood(number) {
    if (typeof number === 'undefined') {
      number = 1;
    }

    for (let i = 0; i < number; i++) {
      const randomPosition = Utils.generateRandomPosition();
      const food = new AbstractCell(randomPosition.x, randomPosition.y);

      this.foods.push(food);
      this.network.sendAll('onFoodAdded', food);
    }
  }

  stop() {
    super.stop();
  }

  addPlayer(player) {
    super.addPlayer(player);
  }
}

module.exports = Game;