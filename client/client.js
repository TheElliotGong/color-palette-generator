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
const generateUniqueId = require('generate-unique-id');
const minColors = 2;
const maxColors = 6;


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
  if(document.querySelectorAll(".color").length < maxColors)
  {
    //Create new color input and label.
    let newColor = document.createElement("div");
    let colorID = generateUniqueId({length: 6});

    newColor.classList.add("color");
    let colorInput = document.createElement("input");
    colorInput.id = colorID;
    colorInput.type = "color";
    let colorLabel = document.createElement("label");
    colorLabel.for = colorID;
    colorLabel.innerHTML = `Hex: #000000`;
    let removeColorButton = document.createElement("button");
    removeColorButton.classList.add("removeColor");
    removeColorButton.innerHTML = "Remove Color";
    newColor.appendChild(colorInput);
    newColor.appendChild(colorLabel);
    newColor.appendChild(removeColorButton);

    document.querySelector("#colors").appendChild(newColor);
  
    //Add event listeners to new color input and remove color button.
    colorInput.addEventListener("input", (e) => {
      document.querySelector(`label[for=${e.target.id}]`).innerHTML = `Hex: ${e.target.value}`;
    });
    colorInput.addEventListener("change", (e) => {
      document.querySelector(`label[for=${e.target.id}]`).innerHTML = `Hex: ${e.target.value}`;
    });

    removeColorButton.addEventListener("click", (e) => {removeColor(e);});
  }
  else
  {
    content.innerHTML = `You can only have ${maxColors} colors`;
    // alert(`You can only have ${maxColors} colors`);
  } 
};

const removeColor = (event) => {
  if(document.querySelectorAll(".color").length > minColors)
  {
    const colors = document.querySelector("#colors");
    let color = event.target.parentElement;
    colors.removeChild(color);
  }
  else
  {
    // alert(`You must have at least ${minColors} colors`);
    content.innerHTML = `You must have at least ${minColors} colors`;
  }
};
const removePalette = (event) => {
  let palette = event.target.parentElement;

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
    let contrastColor;
    if ((testColor._r*0.299 + testColor._g*0.587 + testColor._b*0.114) > 150) 
    {contrastColor = "black";}
    else
    { contrastColor = "white";
    }
    let colorElement = document.createElement("div");
    colorElement.id = color;
    colorElement.classList.add("color");
    colorElement.innerHTML += `<div class="color" style="background-color: ${color};color:${contrastColor};width:100px;height:100px;border:4px solid ${contrastColor}">
    <p>${color}</p></div>`;
    colors.appendChild(colorElement);
  });
  paletteElement.appendChild(colors);

  let removePaletteButton = document.createElement("button");
  removePaletteButton.classList.add("removePalette");



  document.querySelector("#content").appendChild(paletteElement);

};
const init = () => {
    const userForm = document.querySelector("#userForm");

    const addPaletteButton = document.querySelector("#addPalette");
    addPaletteButton.addEventListener("click", (e) => {e.preventDefault(); addPalette();});

    const removeColorButtons = document.querySelectorAll(".removeColor");
    removeColorButtons.forEach(button => {button.addEventListener("click", (e) => {removeColor(e)});});

    const addColorButton = document.querySelector("#addColor");
    addColorButton.addEventListener("click", (e) => {e.preventDefault(); addColor();});

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