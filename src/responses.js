/*
Author: Elliot Gong
Purpose: Create functions for GET, HEAD, and POST requests.
Date 9/30/2023
*/

// Variable to store user data
const users = {};
/**
 * This helper function returns given data in the desired format, used for get responses.
 * @param {*} request
 * @param {*} response
 * @param {*} status The http status code for this response
 * @param {*} content The data to return in the object.
 */
const respondJSON = (request, response, status, content) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.write(JSON.stringify(content));
  response.end();
};
/**
 * This helper function returns meta data in the desired format, used for head responses.
 * @param {*} request
 * @param {*} response
 * @param {*} status
 */
const respondJSONMeta = (request, response, status) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.end();
};
/**
 * This function adds a user to the users object, or updates an existing user.
 * @param {*} request
 * @param {*} response
 * @param {*} body the data needed to add or update a user.
 * @returns
 */
const addUser = (request, response, body) => {
  const responseJSON = {
    message: 'Name and age are both required.',
  };
  // Check if data is valid.
  if (!body.name || !body.age) {
    responseJSON.id = 'missingUserParams';
    return respondJSON(request, response, 400, responseJSON);
  }
  // Default status code for updating existing users
  let responseCode = 204;

  // If the user doesn't exist yet
  if (!users[body.name]) {
    // Set the status code to 201 (created) and create an empty user
    responseCode = 201;
    users[body.name] = {};
  }
  // Update or add fields for this user
  users[body.name].name = body.name;
  users[body.name].age = body.age;
  // Response for when a user is created
  if (responseCode === 201) {
    responseJSON.message = 'Created Successfully';
    return respondJSON(request, response, responseCode, responseJSON);
  }
  // Response for when a user is updated
  return respondJSONMeta(request, response, responseCode);
};
/**
 * This function returns the saved list of users from the server.
 * @param {*} request
 * @param {*} response
 */
const getUsers = (request, response) => {
  const responseJSON = { users };
  respondJSON(request, response, 200, responseJSON);
};
/**
 * This function returns the meta data for the list of users from the server.
 * @param {*} request
 * @param {*} response
 */
const getUsersMeta = (request, response) => {
  respondJSONMeta(request, response, 200);
};
/**
 * This function returns a not found error, complete with a message.
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
 * This function returns the meta data for a not found error.
 * @param {*} request
 * @param {*} response
 */
const notFoundMeta = (request, response) => {
  respondJSONMeta(request, response, 404);
};
// Export functions
module.exports = {
  respondJSON,
  respondJSONMeta,
  addUser,
  getUsers,
  getUsersMeta,
  notFound,
  notFoundMeta,
};
