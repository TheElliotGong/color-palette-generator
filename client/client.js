/* Here we are using the require() syntax in our client javascript. Usually
   we are not able to do this, because the browser does not have built in
   support for CommonJS (where require() comes from) by default. However,
   webpack allows us to use this syntax. When webpack runs and builds our
   bundle.js (in the hosted folder), it will replace these require statements
   will the contents of the files and packages we are importing so that we have
   a browser-friendly version to send to the client.
*/

const test = require('./other.js');
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
    const method = document.querySelector("#methodSelect").value;
    const action = document.querySelector("#urlField").value;

    const response = await fetch(action, {
      method,
      headers:  {
        'Accept': 'application/json'}
      });
    handleResponse(response);
};


const addPalette = async () => {
  const paletteForm = document.querySelector("#paletteForm");
  const action = paletteForm.getAttribute("action");
  const method = paletteForm.getAttribute("method");
  //Get palette name and colors from html forms.
  const name = document.querySelector("#nameField").value;
  let colorString = "";
  const colors = Array.from(document.querySelectorAll("input[type='color']")).map(color => color.value).join();
  
  console.log(colors)
  const formData = `name=${name}&colors=${colors}`;
  let response = await fetch('/addPalette', {
    method: method,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json',
    },
    body: formData,
  });
  handleResponse(response);

};


const addColor = () => {

};

const removeColor = (event) => {
  let color = event.target;
};
const init = () => {
    const paletteGenerator = document.querySelector("#paletteForm");

    paletteGenerator.addEventListener("submit", (e) => {
      e.preventDefault();
      addPalette();
    });

    const colors = document.querySelectorAll("input[type='color']");


    colors.forEach(color => {
      color.addEventListener("input", (e) => {
        document.querySelector(`label[for=${e.target.id}]`).innerHTML = `Hex: ${e.target.value}`;
        // e.target.label.innerHTML = `Hex: ${e.target.value}`;
      });
      color.addEventListener("change", (e) => {
        document.querySelector(`label[for=${e.target.id}]`).innerHTML = `Hex: ${e.target.value}`;
        // e.target.label.innerHTML = `Hex: ${e.target.value}`;
      });
    });
    
};

window.onload = init;