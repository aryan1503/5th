'use strict';

const MainLoop = require('mainloop.js');
const $ = require('jquery');

// CSS
require('!style!css!../css/main.css');

// index.html
require('file?name=[name].[ext]!../index.html');

const Game = require('./Game');

let game = null;

function updateHandler(delta) {
  if (game) {
    game.update(delta);
  }
}

function drawHandler(delta) {
  if (game) {
    game.draw(delta);
  }
}

function inputHandler(event) {
  if (game) {
    game.handleInput(event);
  }
}

$(document).ready(function() {
  game = new Game();
  game.initialize();

  // Initialize inputs
  $(document).keydown(inputHandler);

  MainLoop.setUpdate(updateHandler);
  MainLoop.setDraw(drawHandler);

  MainLoop.start();
});
