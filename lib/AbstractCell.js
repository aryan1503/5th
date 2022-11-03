'use strict';

const GameConfig = require('./Config');

// Cell class
class AbstractCell {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = (typeof width !== 'undefined') ? width : GameConfig.world.cellSize;
    this.height = (typeof height !== 'undefined') ? height : GameConfig.world.cellSize;
  }
}

module.exports = AbstractCell;