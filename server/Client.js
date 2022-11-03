'use strict';

const logger = require('winston');
const uuid = require('node-uuid');

class Client {
  constructor(socket) {
    this.socket = socket;
    this.id = uuid();
  }

  getId() {
    return this.id;
  }

  emit (event, data) {
    this.socket.emit(event, data);
  }

  on (event, listener) {
    this.socket.on(event, listener);
  }

  send (message) {
    this.socket.send(message);
  }
}

module.exports = Client;