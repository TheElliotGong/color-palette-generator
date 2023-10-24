/*
Author: Elliot Gong
Purpose: Create functions for handling palettes stored in the server.
Date: 10/14/2023
*/

let palettes = {};

/**
 * Helper function to return json data to the client in response to a non-HEAD request.
 * @param {*} request
 * @param {*} response
 * @param {*} status the http status code associated with the response.
 * @param {*} object the content to be returned.
 */
const respondJSON = (request, response, status, object) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.write(JSON.stringify(object));
  response.end();
};
/**
 * Helper function to return meta data to the client in response to a HEAD request.
 * @param {*} request
 * @param {*} response
 * @param {*} status the http status code associated with the response.
 */
const respondJSONMeta = (request, response, status) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.end();
};
/**
 * Deals with GET requests for content that does not exist.
 * @param {*} request
 * @param {*} response
 */
const notFound = (request, response) => {
  const responseJSON = {
    message: 'The page you are looking for was not found.',
    id: 'notFound',
  };
  respondJSON(request, response, 404, responseJSON);
};
/**
 * Deals with HEAD requests for content that does not exist.
 * @param {*} request
 * @param {*} response
 */
const notFoundMeta = (request, response) => {
  respondJSONMeta(request, response, 404);
};
/**
 * Removes a palette from the server
 * @param {*} request
 * @param {*} response
 * @param {*} body the data sent from the client.
 * @returns
 */
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
  // Return error message if palette not found.
  responseJSON.message = 'Palette not found';
  responseJSON.id = 'paletteNotFound';
  return respondJSON(request, response, 404, responseJSON);
};
/**
 * Removes all the palettes from the server.
 * @param {*} request
 * @param {*} response
 * @returns
 */
const removePalettes = (request, response) => {
  const responseJSON = {};
  // Send different response if no palettes exist.
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
/**
 * This function adds a palette to the server
 * @param {*} request
 * @param {*} response
 * @param {*} body = the palette data sent from the client.
 * @returns
 */
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
  // Update or insert palette data.
  palettes[body.name].name = body.name;
  palettes[body.name].colors = body.colors.split(',');
  // Return success message upon palette creation or deletion.
  if (responseCode === 201) {
    responseJSON.message = 'Created Successfully';
    responseJSON.id = 'createPalette';
    return respondJSON(request, response, responseCode, responseJSON);
  }
  responseJSON.message = 'Updated Successfully';
  respondJSON.id = 'updatePalette';
  return respondJSONMeta(request, response, responseCode);
};

/**
 * Get all the palettes, but only if the user is 'logged in'.
 * @param {*} request
 * @param {*} response
 * @param {*} params = the query params associated with the requested url.
 * @param {*} attribute = the attribute to check for.
 * @param {*} paramValue = the attribute value to check for
 * @returns
 */
const getPalettes = (request, response, params) => {
  let responseJSON = {};
  // Check if user wants to get a palette by name
  if (params.name) {
    if (!palettes[params.name]) {
      responseJSON.message = 'Palette not found';
      responseJSON.id = 'paletteNotFound';
      return respondJSON(request, response, 400, responseJSON);
    }

    responseJSON.message = 'Palette found';
    responseJSON.palette = palettes[params.name];
    responseJSON.id = 'paletteFound';
    return respondJSON(request, response, 200, responseJSON);
  }
  // If query parameters are valid, return all palettes.
  responseJSON = { palettes };
  return respondJSON(request, response, 200, responseJSON);
};

// Export the functions.
module.exports = {
  respondJSON,
  respondJSONMeta,
  notFound,
  notFoundMeta,
  addPalette,
  getPalettes,
  removePalette,
  removePalettes,
};
