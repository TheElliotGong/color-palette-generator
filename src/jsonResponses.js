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
  // Return bad request error if parameters not specified.
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
  palettes[body.name].colors = body.colors.split(',');
  if (responseCode === 201) {
    responseJSON.message = 'Created Successfully';
    return respondJSON(request, response, responseCode, responseJSON);
  }
  return respondJSONMeta(request, response, responseCode);
};

const getPalettes = (request, response, params, attribute, paramValue) => {
  let responseJSON = {};
  //Check if query parameters are valid.
  if (!params[attribute] || params[attribute] !== paramValue) {
    responseJSON.message = 'Unauthorized';
    responseJSON.id = 'unauthorized';
    return respondJSON(request, response, 401, responseJSON);
  }
  //If query parameters are valid, return all palettes.
  responseJSON = { palettes };
  return respondJSON(request, response, 200, responseJSON);
};

module.exports = {
  respondJSON,
  respondJSONMeta,
  notFound,
  notFoundMeta,
  addPalette,
  getPalettes,
};
