const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const LimitStream = require('./LimitSizeStream');
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

  // check exist folder, if not exist, create folder 'files'
  // const pathWithoutFile = filepath.split('/').slice(1, -1).join('/');
  // try {
  //   fs.accessSync(pathWithoutFile, fs.constants.R_OK);
  // } catch (err) {
  //   fs.mkdirSync('files');
  // }

  if (fs.existsSync(filepath)) {
    // check file exist
    res.statusCode = 409;
    res.end(`Such file already exist!`);
    return;
  }


  switch (req.method) {
    case 'POST':
      // to accept file
      const fileStream = fs.createWriteStream(filepath);
      const limitStream = new LimitStream({limit: 1048576});

      req.pipe(limitStream).pipe(fileStream);

      limitStream.on('error', (error) => {
        if (error.code == 'LIMIT_EXCEEDED') {
          res.statusCode = 413;
        } else {
          res.statusCode = 500;
        }
        res.end(error.code);
        // if limit exceeded, remove file write
        fs.unlinkSync(filepath);
      });

      fileStream.on('error', (error) => {
        res.statusCode = 500;
        res.end('Error write', error);
      });

      req.on('aborted', () => {
        // if request abort, delete file
        fs.unlinkSync(filepath);
        res.statusCode = 500;
        res.end('Abort request');
      });

      fileStream.on('finish', () => {
        res.statusCode = 201;
        res.end(`File accepted ${filepath}`);
      });


      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
