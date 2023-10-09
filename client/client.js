/* Here we are using the require() syntax in our client javascript. Usually
   we are not able to do this, because the browser does not have built in
   support for CommonJS (where require() comes from) by default. However,
   webpack allows us to use this syntax. When webpack runs and builds our
   bundle.js (in the hosted folder), it will replace these require statements
   will the contents of the files and packages we are importing so that we have
   a browser-friendly version to send to the client.
*/


/* Most of the below code is ripped straight from the "Status Code" demo. The only
   parts unique to this example are at the bottom of the init function. Look there
   for more comments.
*/
const tinycolor = require("tinycolor2");

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

    const obj = await response.json();
    console.log(obj);
    if(obj.message){
      content.innerHTML += `<p>${obj.message}</p>`;
    }
    if(obj.palettes)
    {
      const paletteKeys = Object.keys(obj.palettes);
      console.log(paletteKeys);
      if(paletteKeys.length == 0)
      {
        content.innerHTML += `<p>No palettes found</p>`;
      }
      else
      {
        paletteKeys.forEach(key => {
          console.log(JSON.stringify(obj.palettes[key]));
          createPalette(obj.palettes[key]);
        });
        
      }
    }
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
  const colors = Array.from(document.querySelectorAll("input[type='color']")).map(color => color.value).join();
  
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

const createPalette = (palette) => {
  
  let paletteElement = document.createElement("div");
  paletteElement.classList.add("palette");
  paletteElement.id = palette.name;
  paletteElement.innerHTML += `<h3>${palette.name}</h3>`;


  let colors = document.createElement("div");
  colors.classList.add("colors");
  palette.colors.forEach(color => {
    let testColor = tinycolor(color);
    console.log(testColor);
    let colorElement = document.createElement("div");
    colorElement.id = color;
    colorElement.classList.add("color");
    colorElement.innerHTML += `<div class="color" style="background-color: ${color};width:100px;height:100px;border:4px solid  "></div>`;
    colorElement.innerHTML += `<p>${color}</p>`;
    colors.appendChild(colorElement);
  });
  paletteElement.appendChild(colors);


  document.querySelector("#content").appendChild(paletteElement);

};
const init = () => {
    const paletteGenerator = document.querySelector("#paletteForm");
    const userForm = document.querySelector("#userForm");

    paletteGenerator.addEventListener("submit", (e) => {
      e.preventDefault();
      addPalette();
    });

    userForm.addEventListener("submit", (e) => {
      e.preventDefault();
      sendFetch();
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