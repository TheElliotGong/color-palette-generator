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
/**
 * This function handles get requests for palette and other data.
 * @param {*} request 
 * @param {*} response 
 * @param {*} parsedUrl the requested url to check for.
 * @param {*} params the query parameters associated with the requested url
 */
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
/**
 * This function handles the deletion requests for palettes stored in the server.
 * @param {*} request 
 * @param {*} response 
 * @param {*} parsedUrl the requested url to check for.
 */
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
/**
 * This function handles the head requests for palettes and other data.
 * @param {*} request 
 * @param {*} response 
 * @param {*} parsedUrl 
 * @param {*} params 
 */
const handleHead = (request, response, parsedUrl, params) => {
  switch (parsedUrl.pathname) {
    case '/getPalettes':
      if (params.loggedIn === 'yes') {
        jsonHandler.respondJSONMeta(request, response, 200);
        break;
      } else {
        jsonHandler.respondJSONMeta(request, response, 401);
        break;
      }
    case '/getPalette':
      jsonHandler.respondJSONMeta(request, response, 400);
      break;
    default:
      jsonHandler.notFoundMeta(request, response);
      break;
  }
};
/**
 * This function handles all types of requests and is called when the server is up.
 * @param {*} request 
 * @param {*} response 
 */
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
    handleHead(request, response, parsedUrl, params);
  }
};

http.createServer(onRequest).listen(port, () => {
  console.log(`Listening on 127.0.0.1: ${port}`);
});
