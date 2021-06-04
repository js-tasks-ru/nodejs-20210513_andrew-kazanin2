const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.accumulator = '';
  }

  _convertChunkToString(chunk) {
    return Buffer.from(chunk).toString();
  }

  _transform(chunk, encoding, callback) {
    this.accumulator += this._convertChunkToString(chunk);
    const isHaveDivider = this.accumulator.indexOf(os.EOL);

    if (isHaveDivider !== -1) {
      const line = this.accumulator.split(os.EOL);
      this.accumulator = line.pop();
      line.forEach((item) => this.push(item));
    }

    callback();
  }

  _flush(callback) {
    this.push(this.accumulator);
    callback();
  }
}

module.exports = LineSplitStream;
