'use strict';

const $ = require('jquery');

const Network = require('./Network');
const DIRECTION = require('../../lib/Direction');
const ClientConfig = require('./Config');
const GameConfig = require('../../lib/Config');
const AbstractGame = require('../../lib/AbstractGame');
const Utils = require('../../lib/Utils');

class Game extends AbstractGame {
  constructor() {
    super();

    this.network = null;
    this.localPlayer = null;
    this.inputSeq = 0;
    this.canvas = {
      canvas: null,
      context: null,
      width: 0,
      height: 0
    };

    this.clientTime = 0;
    this.serverTime = 0;
  }

  initialize() {
    this.initializeCanvas();
    this.initializeNetwork();
  }

  initializeCanvas() {
    const c = $('#canvas')[0];

    c.width = window.innerWidth;
    c.height = window.innerHeight;

    this.canvas.canvas = c;
    this.canvas.context = c.getContext('2d');
    this.canvas.width = $('#canvas').width();
    this.canvas.height = $('#canvas').height();
  }

  initializeNetwork() {
    this.network = new Network(this);
    this.network.initialize();
  }

  getLocalPlayer(player) {
    return this.localPlayer;
  }

  setLocalPlayer(player) {
    this.localPlayer = player;
  }

  handleInput(event) {
    if (!this.localPlayer)
      return;

    const key = event.which;

    if (ClientConfig.allowedKeys.indexOf(key) == -1)
      return;

    this.inputSeq += 1;

    this.localPlayer.pushInput({
      key: key,
      time: this.getTime(),
      seq: this.inputSeq
    });

    if (this.network) {
      let data = '';

      data += key + '.';
      data += this.getTime().toString().replace('.', '-') + '.';
      data += this.inputSeq;

      this.network.send(data);
    }
  }

  update(delta) {
    super.update(delta);

    if (this.localPlayer)
    {
      // console.log('Player: ', this.localPlayer.position);
      this.localPlayer.update(delta);
    }
  }

  draw() {
    this.canvas.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw foods
    for (let i = 0; i < this.foods.length; i++) {
      this.foods[i].draw(this.canvas.context);
    }

    // Draw other players
    for (let player of this.players.values()) {
      player.draw(this.canvas.context);
    }

    // Draw the local player
    if (this.localPlayer)
      this.localPlayer.draw(this.canvas.context);

    // Draw bounds
    const origin = { x: 5, y: 5 };
    this.canvas.context.strokeStyle = 'red';
    this.canvas.context.lineWidth = 5;
    this.canvas.context.beginPath();
    this.canvas.context.moveTo(origin.x, origin.y);
    this.canvas.context.lineTo(GameConfig.world.width, origin.y);
    this.canvas.context.lineTo(GameConfig.world.width, GameConfig.world.height);
    this.canvas.context.lineTo(origin.x, GameConfig.world.height);
    this.canvas.context.lineTo(origin.x, origin.y);
    this.canvas.context.stroke();

    // Draw UI
    if (this.localPlayer) {
      const scoreText = 'Score: ' + this.localPlayer.getScore();

      $('#score').html(scoreText);
    }

    if (this.network) {
      $('#debug').html('Ping: ' + this.network.getPing());
    }
  }
}

module.exports = Game;