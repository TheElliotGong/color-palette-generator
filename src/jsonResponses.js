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
  //Check if name and colors are valid.
  if (!body.name || !body.colors) {
    responseJSON.id = 'missingParams';
    return respondJSON(request, response, 400, responseJSON);
  }
  let responseCode = 204;

  if (!palettes[body.name]) {
    responseCode = 201;
    palettes[body.name] = {};
  }
  palettes[body.name].name = body.name;
  palettes[body.name].colors = body.colors;
  if(responseCode === 201){
    responseJSON.message = 'Created Successfully';
    return respondJSON(request, response, responseCode, responseJSON);
  }
  return respondJSONMeta(request, response, responseCode);

};

const getPalettes = (request, response, params, attribute, paramValue) => {
  let responseJSON = {};
  if (!params[attribute] || params[attribute] !== paramValue) {
    responseJSON.message = 'Unauthorized';
    responseJSON.id = 'unauthorized';
    return respondJSON(request, response, 401, responseJSON);
  }
  responseJSON = {palettes};
  return respondJSON(request, response, 200, responseJSON);
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
