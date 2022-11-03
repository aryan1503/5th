'use strict';

const http = require('http');
const express = require('express');
const logger = require('winston');
const socketio = require('socket.io');

const serverConfig = require('./Config');
const Game = require('./Game')

function initializeSocket(server) {
  let io = socketio(server);
  io.on('connection', function(client) {
      client.userid = uuid();

      client.emit('onconnected', { id: client.userid });

      logger.info('Player ' + client.userid + ' connected');

      client.on('disconnect', function () {
          logger.info('Client disconnected ' + client.userid);
      });
  });
}

function run() {
  const app = express();

  app.use(express.static(serverConfig.staticFolder));

  const server = http.createServer(app);

  const game = new Game(server);

  game.start();

  server.listen(serverConfig.port, function() {
    logger.info('listening on *:' + serverConfig.port);
  });
}

run();