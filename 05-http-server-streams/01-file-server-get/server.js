const url = require('url');
const http = require('http');
const path = require('path');
const server = new http.Server();
const fs = require('fs');

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);
  const pathRegEx = new RegExp(/[a-zA-Z0-9_]+\.[a-zA-Z0-9]*$/);
  const isTruePath = pathRegEx.test(pathname);
  const filepath = path.join(__dirname, 'files', pathname);

  if (!isTruePath) {
    // check is true path for file
    res.statusCode = 400;
    res.end(`Wrong path for file! Example for path 'files/myTextFile.txt'`);
  }

  if (!fs.existsSync(filepath)) {
    // check file exist
    res.statusCode = 404;
    res.end(`No such file!`);
  }

  switch (req.method) {
    case 'GET':
      // send file
      const fileStream = fs.createReadStream(filepath);

      fileStream.on('error', (e) => {
        res.statusCode = 404;
        res.end(`Error read file, ${e}!`);
      });

      fileStream.pipe(res);
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
