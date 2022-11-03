'use strict';

const DIRECTION = require('./Direction');

const Config = {
  world: {
  	width: 1910,
  	height: 950,
  	cellSize: 25
  },
  player: {
  	defaultSpeed: 10, // Number of cell per second
  	defaultLength: 5,
    defaultDirection: DIRECTION.RIGHT
  },
  timerFrequency: 1000 / 250
};

module.exports = Config;