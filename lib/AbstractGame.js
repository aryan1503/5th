'use strict';

const Config = require('./Config');
const Timer = require('./Timer');
const Utils = require('./Utils');
const AbstractCell = require('./AbstractCell');

class AbstractGame {
  constructor() {
    this.players = new Map();
    this.timer = new Timer(Config.timerFrequency);
    this.eventsFired = [];
    this.foods = [];
    this.time = 0;
  }

  update(delta) {
    this.time += (delta / 1000);

    for (let player of this.players.values()) {
        this.checkFoodCollision(player);
        this.checkPlayersCollision(player);

        player.update(delta);

        if (player.checkBodyCollision()) {
          player.die();
        }
    }
  }

  getPlayerById(playerId) {
    return this.players.get(playerId);
  }

  getPlayers() {
    return this.players.values();
  }

  getTime() {
    return this.time;
  }

  setTime(value) {
    this.time.setTime(value);
  }

  addPlayer (player) {
    this.players.set(player.getId(), player);

    console.log('Players #' + this.players.size);
    for (let player of this.players.values()) {
      console.log(player.getName());
    }
  }

  removePlayer (playerId) {
    const player = this.players.get(playerId);

    this.players.delete(playerId);

    console.log('Players #' + this.players.size);
    for (let player of this.players.values()) {
      console.log(player.getName());
    }
  }

  clearPlayers () {
    this.players.clear();
  }

  getGameState(player) {
    return {
      serverTime: this.getTime(),
      foods: this.foods,
      ownPlayer: player.toJSON(),
      players: Array.from(this.players.values()).filter(otherPlayer => {
          return otherPlayer !== player;
      }).map(player => player.toJSON()),
      events: this.eventsFired.filter((event) => {
          return event.getFiredBy() !== player;
      }).map((event) => event.toJSON())
    };
  }

  clearEvents() {
    this.eventsFired = [];
  }

  checkFoodCollision(player) {
    for (let i = 0; i < this.foods.length; i++) {
      if (player.position.x === this.foods[i].x && player.position.y === this.foods[i].y) {
        this.foods.splice(i, 1);

        player.ateFood = true;

        return true;
      }
    }

    return false;
  }

  checkPlayersCollision(player) {
    for (let p of this.players.values()) {
      if (p.getId() == player.getId())
        continue;

      for (let cell of p.getBody()) {
        if (player.position.x === cell.x && player.position.y === cell.y) {
          player.die();
          return true;
        }
      }
    }

    return false;
  }
}

module.exports = AbstractGame;