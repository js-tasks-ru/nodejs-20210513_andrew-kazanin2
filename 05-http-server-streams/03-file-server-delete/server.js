const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);
  const filepath = path.join(__dirname, 'files', pathname);
  const pathRegEx = new RegExp(/[a-zA-Z0-9_]+\.[a-zA-Z0-9]*$/);
  const isTruePath = pathRegEx.test(pathname);

  if (!isTruePath) {
    // check is true path for file
    res.statusCode = 400;
    res.end(`Wrong path for file! Example for path 'files/myTextFile.txt'`);
  }

  if (!fs.existsSync(filepath)) {
    // check file exist
    res.statusCode = 404;
    res.end(`such file is not exist!`);
    return;
  }

  switch (req.method) {
    case 'DELETE':
      // delete file
      fs.unlinkSync(filepath, (error) => {
        if (error) {
          res.statusCode = 500;
          res.end('Error delete file');
        }
      });
      res.end(`File ${pathname} deleted`);
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
