/*
Author: Elliot Gong
Purpose: Create functions for client requests and handling server responses.
Date: 10/14/2023
*/

//Helper fields
const tinycolor = require("tinycolor2");
const generateUniqueId = require('generate-unique-id');
const minColors = 2;
const maxColors = 6;

/**
 * This helper function updates the client page based on the response from the server.
 * @param {*} response 
 * @param {*} method = The type of request made to the server
 */
const handleResponse = async (response, method) => {
  const content = document.getElementById('content');
  //Change the header based on the response status
  switch (response.status) {
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
    case 401:
      content.innerHTML = `<b>Unauthorized</b>`;
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
  //Only add content if the user doesn't send a head request.
  if(method != 'head'){
    let obj = await response.json();
    //Print out appropriate data if present.
    if (obj.message) {
      content.innerHTML += `<p>${obj.message}</p>`;
    }
    if (obj.palettes) {
      const paletteKeys = Object.keys(obj.palettes);
      if (paletteKeys.length == 0) {
        content.innerHTML += `<p>No palettes found</p>`;
      }
      else {
        paletteKeys.forEach(key => {
          createPalette(obj.palettes[key]);
        });
      }
    }  
  }
};
/**
 * This response sends a fetch request(GET or HEAD) to the server using the data taken from the input forms.
 */
const sendFetch = async () => {
  const method = document.querySelector("#methodSelect").value;
  const action = document.querySelector("#urlField").value;
  const response = await fetch(action, {
    method,
    headers: {
      'Accept': 'application/json'
    }
  });
  handleResponse(response, method);
};

/**
 * This function adds a palette to the server(POST) using the data taken from the input forms.
 */
const addPalette = async () => {
  //Collect and organize data from the form.
  const name = document.querySelector("#nameField").value;
  const colors = Array.from(document.querySelectorAll("input[type='color']")).map(color => color.value).join();
  const formData = `name=${name}&colors=${colors}`;
  //Send request with fetch.
  let response = await fetch('/addPalette', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json',
    },
    body: formData,
  });
  handleResponse(response, 'POST');
};
/**
 * This function removes a chosen palette(DELETE) from the server.
 * @param {*} event 
 */
const removePalette = async (name) => {
  //Send delete request with fetch using the name of the palette to be deleted.
  let response = await fetch('/removePalette', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json',
    },
    body: `name:${name}`,
  });
  handleResponse(response, 'DELETE');
};
/**
 * This function removes all palettes from the server.
 */
const removePalettes = async () => {
  //Send delete request with fetch.
  let response = await fetch('/removePalettes', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json',
    }
  });
  handleResponse(response, 'DELETE');
};
/**
 * This function adds a color input to the form.
 */
const addColor = () => {
  const content = document.querySelector("#content");
  if (document.querySelector("#top").querySelectorAll(".color").length < maxColors) {
    content.innerHTML = "";
    //Create new color input and label.
    let newColor = document.createElement("div");
    let colorID = generateUniqueId({ length: 6 });
    newColor.classList.add("color");
    //Create input elements for the new color.
    let colorInput = document.createElement("input");
    colorInput.id = colorID;
    colorInput.type = "color";

    let colorLabel = document.createElement("label");
    colorLabel.htmlFor = colorID;
    colorLabel.innerHTML = `Hex: 000000`;

    let removeColorButton = document.createElement("button");
    removeColorButton.classList.add("removeColor");
    removeColorButton.innerHTML = "Remove Color";

    //Add event listeners to new color input and remove color button.
    colorInput.addEventListener("input", (e) => {
      colorLabel.innerHTML = `Hex: ${e.target.value.replace("#","")}`;
    });
    colorInput.addEventListener("change", (e) => {
      colorLabel.innerHTML = `Hex: ${e.target.value.replace("#","")}`;
    });

    removeColorButton.addEventListener("click", (e) => { removeColor(e); });

    //Combine new elements and add the color to the palette.
    newColor.appendChild(colorInput);
    newColor.appendChild(colorLabel);
    newColor.appendChild(removeColorButton);

    document.querySelector("#colors").appendChild(newColor);
  }
  else {
    content.innerHTML = `You can only have ${maxColors} colors`;
    // alert(`You can only have ${maxColors} colors`);
  }
};
/**
 * This function removes a color input from the form, reducing the number of colors in the palette.
 * @param {*} event 
 */
const removeColor = (event) => {
  const content = document.querySelector("#content");
  //Check if minimum number of colors isn't met.
  if (document.querySelector("#top").querySelectorAll(".color").length > minColors) {
    content.innerHTML = "";
    document.querySelector("#colors").removeChild(event.target.parentElement);
  }
  else {
    content.innerHTML = `You must have at least ${minColors} colors`;
  }
};
/**
 * This function creates a palette element and adds it to the page.
 * @param {*} palette The data for the palette to be created.
 */
const createPalette = (palette) => {
  //Create the palette element and its children.
  let paletteElement = document.createElement("div");
  paletteElement.classList.add("palette");
  paletteElement.id = palette.name;
  document.querySelector("#content").appendChild(paletteElement);

  let top = document.createElement("div");
  top.classList.add("top");
  paletteElement.appendChild(top);

  let colors = document.createElement("div");
  colors.classList.add("colors");

  palette.colors.forEach(color => {
    //Check if the contrasting color should be black or white depending on the rgb values.
    let testColor = tinycolor(color);
    let contrastColor;
    if ((testColor._r * 0.299 + testColor._g * 0.587 + testColor._b * 0.114) > 150) { contrastColor = "black"; }
    else {
      contrastColor = "white";
    }
    //Set up the html content.
    let colorElement = `<div class="color" style="background-color: ${color};color:${contrastColor};height:100px;">
    <p>${color.replace("#","")}</p></div>`;
    colors.innerHTML += colorElement;
  });
  top.appendChild(colors);
  
  //Add buttons to support palette removal.
  let removePaletteButton = document.createElement("button");
  removePaletteButton.classList.add("removePalette");
  removePaletteButton.innerHTML = "Remove Palette";
  top.appendChild(removePaletteButton);

  //Add elements to the client page.
  
  paletteElement.innerHTML += `<h3>${palette.name}</h3>`;
  

  //Set width of each color so they all have equal proportions when fitting into their parent.

  let colorElements = document.querySelector("#content").querySelector(`#${palette.name}`).querySelector(".colors");

  colorElements.querySelectorAll(".color").forEach(color => {color.style.width = 
    `${colorElements.getBoundingClientRect().width / colorElements.querySelectorAll(".color").length}%`;});
  //Add button functionality
  document.querySelector("#content").querySelector(`#${palette.name}`).querySelector(".removePalette").addEventListener("click", (e) => {removePalette(palette.name); });
};
//Set up everything.
const init = () => {
  //Add event listeners to all the buttons, form, and color inputs.
  const userForm = document.querySelector("#userForm");

  const addPaletteButton = document.querySelector("#addPalette");
  addPaletteButton.addEventListener("click", (e) => { e.preventDefault(); addPalette(); });

  const removeColorButtons = document.querySelectorAll(".removeColor");
  removeColorButtons.forEach(button => { button.addEventListener("click", (e) => { e.preventDefault(); removeColor(e) }); });

  const removePalettesButton = document.querySelector("#removePalettes");
  removePalettesButton.addEventListener("click", (e) => { e.preventDefault(); removePalettes(); });

  const addColorButton = document.querySelector("#addColor");
  addColorButton.addEventListener("click", (e) => { e.preventDefault(); addColor(); });

  userForm.addEventListener("submit", (e) => {
    e.preventDefault();
    sendFetch();
  });
  const colors = document.querySelectorAll("input[type='color']");
  colors.forEach(color => {
    color.addEventListener("input", (e) => {
      document.querySelector(`label[for=${e.target.id}]`).innerHTML = `Hex: ${e.target.value.replace("#","")}`;
    });
    color.addEventListener("change", (e) => {
      document.querySelector(`label[for=${e.target.id}]`).innerHTML = `Hex: ${e.target.value.replace("#","")}`;
    });
  });
};

window.onload = init;