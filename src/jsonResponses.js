/* There is no new code in this file that is unique to this demo.
   This code is directly taken from the "Status Code" example.
*/
const palettes = {};
const respondJSON = (request, response, status, object) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.write(JSON.stringify(object));
  response.end();
};

const respondJSONMeta = (request, response, status) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.end();
};
const success = (request, response) => {
  const responseJSON = {
    message: 'This is a successful response!',
  };

  respondJSON(request, response, 200, responseJSON);
};

const successMeta = (request, response) => {
  respondJSONMeta(request, response, 200);
};

const badRequest = (request, response, params) => {
  const responseJSON = {
    message: 'This request has the required parameters',
  };

  if (!params.valid || params.valid !== 'true') {
    responseJSON.message = 'Missing valid query parameter set to true';
    responseJSON.id = 'badRequest';
    return respondJSON(request, response, 400, responseJSON);
  }

  return respondJSON(request, response, 200, responseJSON);
};

const badRequestMeta = (request, response) => {
  respondJSONMeta(request, response, 400);
};

const notFound = (request, response) => {
  const responseJSON = {
    message: 'The page you are looking for was not found.',
    id: 'notFound',
  };

  respondJSON(request, response, 404, responseJSON);
};

const notFoundMeta = (request, response) => {
  respondJSONMeta(request, response, 404);
};

const addPalette = (request, response, body) => {
  const responseJSON = {
    message: 'Palette name and colors are required.',
  };

  if (!body.name || !body.colors) {
    responseJSON.id = 'missingParams';
    return respondJSON(request, response, 400, responseJSON);
  }
};

const getPalettes = (request, response, params) => {
  const responseJSON = {};
  if (!params[attribute] || params[attribute] !== paramValue) {

  }
};



module.exports = {
  respondJSON,
  respondJSONMeta,
  success,
  successMeta,
  badRequest,
  badRequestMeta,
  notFound,
  notFoundMeta,
  addPalette,
  getPalettes,
};
