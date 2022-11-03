'use strict';

const Config = require('./Config');

const Utils = {
  generateRandomPosition: function() {
    const position = {
      x: Math.round(Math.random() * ((Config.world.width - Config.world.cellSize) / Config.world.cellSize)),
      y: Math.round(Math.random() * ((Config.world.height - Config.world.cellSize) / Config.world.cellSize))
    };

    return position;
  }
};

module.exports = Utils;