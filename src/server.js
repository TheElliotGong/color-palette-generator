/*
Author: Elliot Gong
Purpose: Handle server responses.
Date: 10/14/2023
*/

// helper fields
const http = require('http');
const url = require('url');
const query = require('querystring');
const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;
/**
 * Helper function that deals with data that'll be used for POSTS and DELETE requests
 * @param {*} request
 * @param {*} response
 * @param {*} callback = the function that'll use the parsed data.
 */
const parseBody = (request, response, callback) => {
  const body = [];
  // Handle errors with a bad request status code and message.
  request.on('error', (err) => {
    console.dir(err);
    response.statusCode = 400;
    response.end();
  });
  // Add each new chunk of data to the body array.
  request.on('data', (chunk) => {
    body.push(chunk);
  });
  // When all data has been received, parse the body array and send back a response.
  request.on('end', () => {
    const bodyString = Buffer.concat(body).toString();
    const bodyParams = query.parse(bodyString);
    // Use body data to call the callback function.
    callback(request, response, bodyParams);
  });
};
/**
 * This function handles post requests for adding palettes to the server.
 * @param {*} request
 * @param {*} response
 * @param {*} parsedUrl = the requested url to check for.
 */
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
 * @param {*} parsedUrl = the requested url to check for.
 * @param {*} params = the query parameters associated with the requested url
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
    case '/getPalettes':
      jsonHandler.getPalettes(request, response, params);
      break;
    default:
      jsonHandler.notFound(request, response);
  }
};
/**
 * This function handles the deletion requests for palettes stored in the server.
 * @param {*} request
 * @param {*} response
 * @param {*} parsedUrl = the requested url to check for.
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
 * @param {*} parsedUrl = the requested url to check for.
 * @param {*} params = the query parameters associated with the requested url.
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
