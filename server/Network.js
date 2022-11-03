'use strict';

const logger = require('winston');
const socketio = require('socket.io');

const Client = require('./Client');
const Player = require('./Player');
const GameConfig = require('../lib/Config');
const Utils = require('../lib/Utils');

class Network {
  constructor(game, server) {
    this.nameCounter = 0;
    this.game = game;
    this.socket = socketio(server);
    this.clients = new Map();
    this.playerClients = new Map();
    this.clientPlayers = new Map();

    this.initializeSocketListeners();
  }

  initializeSocketListeners() {
    const that = this;

    this.socket.on('connection', function(socket) {
      let client = new Client(socket);

      that.addClient(client);
    });
  }

  sendAll(message, data) {
    this.socket.sockets.emit(message, data);
  }

  listenToClient(client) {
    const that = this;

    client.on('error', (err) => {
      logger.info('Client error', err);
    });

    client.on('disconnect', function () {
      that.removeClient(client)
    });

    client.on('message', (message) => {
      that.handleClientMessage(client, message);
    });

    client.on('clientPing', (data) => {
      client.emit('serverPing', data);
    });
  }

  handleClientMessage(client, message) {
    console.log('New client message: ' + message);

    const parts = message.split('.');

    const input = parseInt(parts[0], 10);
    const inputTime = parts[1].replace('-', '.');
    const inputSeq = parseInt(parts[2], 10);

    const player = this.getPlayerByClient(client);

    player.pushInput({
        key: input,
        time: inputTime,
        seq: inputSeq
    });
  }

  addClient(client) {
    this.listenToClient(client);

    // Set random position
    const randomPosition = Utils.generateRandomPosition();
    this.nameCounter++;
    const player = new Player(client.getId(), 'Noob#' + this.nameCounter, randomPosition.x, randomPosition.y, GameConfig.player.defaultLength);

    logger.info('Current client: ' + client.getId());

    // Send to the client the player data
    client.emit('onConnected', player.toJSON());
    logger.info('Player ' + player.getName() + ' connected');

    // Send to other clients the new player data
    for (const otherClient of this.clients.values()) {
      otherClient.emit('onPlayerJoined', player.toJSON());
    }

    // Send to current client the data of other players
    for (const otherPlayer of this.game.players.values()) {
      client.emit('onPlayerJoined', otherPlayer.toJSON())
    }

    this.clients.set(client.getId(), client);
    this.game.addPlayer(player);
    this.addClientPlayer(client, player);
  }

  removeClient (client) {
    const clientId = client.getId();
    logger.info('Client disconnected ' + clientId);
    this.clients.delete(clientId);

    const player = this.getPlayerByClient(client);

    this.game.removePlayer(player.getId());
    this.removeClientPlayer(client);
  }

  addClientPlayer(client, player) {
    this.playerClients.set(player, client);
    this.clientPlayers.set(client, player);
  }

  removeClientPlayer(client) {
    console.log('Remove client: ' + client.getId());
    const player = this.clientPlayers.get(client);

    this.clientPlayers.delete(client);
    this.playerClients.delete(player);
  }

  sendUpdates() {
    for (const player of this.clientPlayers.values()) {
      const client = this.playerClients.get(player);

      // console.log('Player: ', player.position);

      client.emit('onServerUpdate', this.game.getGameState(player));
    }
  }

  respawn(player) {
    const randomPosition = Utils.generateRandomPosition();
    player.reset(randomPosition.x, randomPosition.y);
    player.generateBody(GameConfig.player.defaultLength);

    const client = this.playerClients.get(player);
    client.emit('onPlayerRespawn', player.toJSON());
  }

  getPlayerByClient(client) {
    return this.clientPlayers.get(client);
  }

  getClientByPlayer(player) {
    return this.playerClients.get(player);
  }
}

module.exports = Network;