/* There is no new code in this file that is unique to this demo.
   This code is directly taken from the "Status Code" example.
*/
let palettes = {};
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

const removePalette = (request, response, body) => {
  const responseJSON = {
    message: 'Palette name is required.',
  };
  // Return bad request error if parameters not specified.
  if (!body.name) {
    responseJSON.id = 'missingParams';
    return respondJSON(request, response, 400, responseJSON);
  }
  // Return success message.
  if (palettes[body.name]) {
    delete palettes[body.name];
    responseJSON.message = 'Palette deleted';
    responseJSON.id = 'deletePalette';
    return respondJSON(request, response, 200, responseJSON);
  }
  responseJSON.message = 'Palette not found';
  responseJSON.id = 'paletteNotFound';
  return respondJSON(request, response, 404, responseJSON);
};

const removePalettes = (request, response) => {
  const responseJSON = {};
  if (Object.keys(palettes).length === 0) {
    responseJSON.message = 'No palettes to delete';
    respondJSON.id = 'noPalettesFound';
  } else {
    palettes = {};
    responseJSON.message = 'All palettes deleted';
    responseJSON.id = 'deleteAllPalettes';
  }
  return respondJSON(request, response, 200, responseJSON);
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
  // By default, we're updating an existing palette.
  let responseCode = 204;
  // Create new palette if it doesn't exist.
  if (!palettes[body.name]) {
    responseCode = 201;
    palettes[body.name] = {};
  }
  // Update palette data.
  palettes[body.name].name = body.name;
  palettes[body.name].colors = body.colors.split(',');
  // Return success message.
  if (responseCode === 201) {
    responseJSON.message = 'Created Successfully';
    responseJSON.id = 'createPalette';
    return respondJSON(request, response, responseCode, responseJSON);
  }
  responseJSON.message = 'Updated Successfully';
  respondJSON.id = 'updatePalette';
  return respondJSONMeta(request, response, responseCode);
};

const getPalette = (request, response, name) => {
  const responseJSON = {
    message: 'Palette name is required.',
  };
  // Return bad request error if parameters not specified.
  if (!name) {
    responseJSON.id = 'missingParams';
    return respondJSON(request, response, 400, responseJSON);
  }
  // Return success message.
  if (palettes[name]) {
    responseJSON.message = 'Palette found';
    responseJSON.palette = palettes[name];
    responseJSON.id = 'paletteFound';
    return respondJSON(request, response, 200, responseJSON);
  }
  responseJSON.message = 'Palette not found';
  responseJSON.id = 'paletteNotFound';
  return respondJSON(request, response, 404, responseJSON);
};

const getPalettes = (request, response, params, attribute, paramValue) => {
  let responseJSON = {};
  // Check if query parameters are valid.
  if (!params[attribute] || params[attribute] !== paramValue) {
    responseJSON.message = 'You do not have authorization to view this content.';
    responseJSON.id = 'unauthorized';
    return respondJSON(request, response, 401, responseJSON);
  }
  // If query parameters are valid, return all palettes.
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
  getPalette,
  removePalette,
  removePalettes,
};
