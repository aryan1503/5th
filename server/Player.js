'use strict';

const AbstractPlayer = require('../lib/AbstractPlayer');

class Player extends AbstractPlayer {
  constructor(id, name, x, y, length) {
    super(id, name, x, y, length);
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      position: Object.assign({}, this.position),
      direction: this.direction,
      body: this.body,
      score: this.score,
      isAlive: this.isAlive
    };
  }
}

module.exports = Player;