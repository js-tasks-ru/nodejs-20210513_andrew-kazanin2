const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);
    this._limit = options.limit;
    this._totalSize = 0;
  }

  _getChunkLengthInBytes(chunk) {
    return Buffer.byteLength(chunk);
  }

  _transform(chunk, encoding, callback) {
    const chunkSize = this._getChunkLengthInBytes(chunk);
    this._totalSize += chunkSize;

    if (this._totalSize <= this._limit) {
      callback(null, chunk);
    } else {
      callback(new LimitExceededError());
    }
  }
}

module.exports = LimitSizeStream;
