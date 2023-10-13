/* Nothing in this file is new for this demo, other than
   that we are routing requests for /bundle.js to the
   htmlHandler's getBundle function using the url struct.
*/

const http = require('http');
const url = require('url');
const query = require('querystring');

const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const parseBody = (request, response, callback) => {
  const body = [];
  // Bad request
  request.on('error', (err) => {
    console.dir(err);
    response.statusCode = 400;
    response.end();
  });

  request.on('data', (chunk) => {
    body.push(chunk);
  });
  request.on('end', () => {
    const bodyString = Buffer.concat(body).toString();
    const bodyParams = query.parse(bodyString);

    // Once we have the bodyParams object, we will call the handler function. We then
    // proceed much like we would with a GET request.
    callback(request, response, bodyParams);
  });
};

const handlePost = (request, response, parsedUrl) => {
  switch (parsedUrl.pathname) {
    case '/addPalette':
      parseBody(request, response, jsonHandler.addPalette);
      break;
    default:

      jsonHandler.notFound(request, response);
  }
};

const handleGet = (request, response, parsedUrl, params) => {
  switch (parsedUrl.pathname) {
    case '/':
      htmlHandler.getIndex(request, response);
      break;
    case '/style.css':
      htmlHandler.getCSS(request, response);
      break;
    case '/bundle.js':
      htmlHandler.getBundle(request, response);
      break;
    case '/getPalette':
      jsonHandler.getPalette(request, response, params.name);
      break;
    case '/getPalettes':
      jsonHandler.getPalettes(request, response, params, 'loggedIn', 'yes');
      break;
    default:
      jsonHandler.notFound(request, response);
  }
};
const handleDelete = (request, response, parsedUrl) => {
  switch (parsedUrl.pathname) {
    case '/removePalette':
      parseBody(request, response, jsonHandler.removePalette);
      break;
    case '/removePalettes':
      jsonHandler.removePalettes(request, response);
      break;
    default:
      jsonHandler.notFound(request, response);
  }
};

const handleHead = (request, response, parsedUrl) => {
  switch (parsedUrl.pathname) {
    case '/getPalettes':
      jsonHandler.getPalettesMeta(request, response);
      break;
    case '/getPalette':
      jsonHandler.getPaletteMeta(request, response);
      break;
    default:
      jsonHandler.notFoundMeta(request, response);
      break;
  }
};
const onRequest = (request, response) => {
  const parsedUrl = url.parse(request.url);
  const params = query.parse(parsedUrl.query);
  if (request.method === 'POST') {
    handlePost(request, response, parsedUrl);
  } else if (request.method === 'GET') {
    handleGet(request, response, parsedUrl, params);
  } else if (request.method === 'DELETE') {
    handleDelete(request, response, parsedUrl, params);
  } else if (request.method === 'HEAD') {
    handleHead(request, response, parsedUrl);
  }
};

http.createServer(onRequest).listen(port, () => {
  console.log(`Listening on 127.0.0.1: ${port}`);
});
