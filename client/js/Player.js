'use strict';

const GameConfig = require('../../lib/Config');
const AbstractPlayer = require('../../lib/AbstractPlayer');
const DIRECTION = require('../../lib/Direction');

const Cell = require('./Cell');

class Player extends AbstractPlayer {
  constructor(id, name, x, y, length) {
    super(id, name, x, y, length);
  }

  createNewCell(x, y, width, height) {
    return new Cell(x, y, width, height);
  }

  // Should be use only with data retrieved from the server
  setDirection(value) {
    this.direction = value;
    this.nextDirection = value;
  }

  setBody(body) {
    this.body = [];

    for (let cell of body) {
      this.body.push(this.createNewCell(cell.x, cell.y, cell.width, cell.height));
    }
  }

  setScore(value) {
    this.score = value;
  }

  draw(context) {
    if (!this.isAlive)
      return;

    for (let i = 0; i < this.body.length; i++) {
      const cell = this.body[i];

      cell.draw(context);
    }

    context.fillStyle = 'white';
    context.fillText(
      this.name,
      this.position.x * GameConfig.world.cellSize,
      this.position.y * GameConfig.world.cellSize - 10
    );
  }
}

module.exports = Player;