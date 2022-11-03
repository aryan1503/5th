'use strict';

const AbstractCell = require('../../lib/AbstractCell');

class Cell extends AbstractCell {
  draw(context) {
    context.lineWidth = 1;
    context.fillStyle = 'blue';
    context.strokeStyle = 'white';

    context.fillRect(this.x * this.width, this.y * this.height, this.width, this.height);
    context.strokeRect(this.x * this.width, this.y * this.height, this.width, this.height);
  }
}

module.exports = Cell;