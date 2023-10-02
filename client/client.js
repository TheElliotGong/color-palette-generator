/* Here we are using the require() syntax in our client javascript. Usually
   we are not able to do this, because the browser does not have built in
   support for CommonJS (where require() comes from) by default. However,
   webpack allows us to use this syntax. When webpack runs and builds our
   bundle.js (in the hosted folder), it will replace these require statements
   will the contents of the files and packages we are importing so that we have
   a browser-friendly version to send to the client.
*/
const _ = require('underscore');


/* Most of the below code is ripped straight from the "Status Code" demo. The only
   parts unique to this example are at the bottom of the init function. Look there
   for more comments.
*/
const handleResponse = async (response) => {
    const content = document.getElementById('content');

    switch(response.status) {
      case 200:
        content.innerHTML = `<b>Success</b>`;
        break;
      case 201:
        content.innerHTML = `<b>Palette successfully created</b>`;
        break;
      case 204:
        content.innerHTML = `<b>Palette successfully edited</b>`;
        break;
      case 400:
        content.innerHTML = `<b>Bad Request</b>`;
        break;
      case 404:
        content.innerHTML = `<b>Not Found</b>`;
        break;
      case 500:
        content.innerHTML = `<b>Internal Server Error</b>`;
        break;
      default:
        content.innerHTML = `<p>Status Code not Implemented By Client</p>`;
        break;
    }

    const resObj = await response.json();
    content.innerHTML += `<p>${resObj.message}</p>`;
};

const sendFetch = async (url) => {
    const response = await fetch(url);
    handleResponse(response);
};

const init = () => {
    const successButton = document.querySelector("#success");
    const badRequestButton = document.querySelector("#badRequest");
    const notFoundButton = document.querySelector("#notFound");

    const success = () => sendFetch('/success');
    const badRequest = () => sendFetch('/badRequest');
    const notFound = () => sendFetch('/somethingUnhandled');

    successButton.addEventListener('click', success);
    badRequestButton.addEventListener('click', badRequest);
    notFoundButton.addEventListener('click', notFound);


    /* Here, we can make use of the print function that we are pulling in
       from the other.js file. At the top of the file, we pulled that file in
       and stored it's exports in a variable called test. Normally we could
       not do this with browser code. However, webpack allows us to use this syntax.
       When we run 'npm run build', webpack will turn all of our code into something
       browser friendly and store it in './hosted/bundle.js'. The contents of bundle.js
       will be a combination of this code file and all the ones it requires (and in turn
       the ones that they require, etc.)
    */
    /* Similar to pulling in our other code files, we can also make use of entire
       npm packages in our code, thanks to webpack. For example, here we are making
       use of the 'underscore' library's chunk function to break up an array. Usually
       we could not use an npm package in our client code, but webpack adds the code
       from underscore to our bundle.js file as well.

       It's worth noting that we don't want to just frivolously include a ton of npm
       packages in our client code (or our server code for that matter), but webpack
       gives us the flexibility to do so if we need to.
    */
};

window.onload = init;