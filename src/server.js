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

const urlStruct = {
  '/': htmlHandler.getIndex,
  '/style.css': htmlHandler.getCSS,
  '/bundle.js': htmlHandler.getBundle,
  '/addPalette': jsonHandler.addPalette,
  '/getPalettes': jsonHandler.getPalettes,
  '/getPalettes?loggedIn=yes': jsonHandler.getPalettes,
  notFound: jsonHandler.notFound,
};
const parseBody = (request, response, callback) => {
  const body = [];
  //Bad request
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
const onRequest = (request, response) => {
  const parsedUrl = url.parse(request.url);
  const params = query.parse(parsedUrl.query);

  if (urlStruct[parsedUrl.pathname]) {
    if (parsedUrl.pathname === '/getPalettes' || parsedUrl.pathname === '/getPalettes?loggedIn=yes') {
      urlStruct[parsedUrl.pathname](request, response, params, 'loggedIn', 'yes');
    } else if (parsedUrl.pathname === '/addPalette') {
      parseBody(request, response, urlStruct[parsedUrl.pathname]);
    } else {
      urlStruct[parsedUrl.pathname](request, response);
    }
  } else {
    urlStruct.notFound(request, response, params);
  }
};

http.createServer(onRequest).listen(port, () => {
  console.log(`Listening on 127.0.0.1: ${port}`);
});
