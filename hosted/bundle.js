/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./client/client.js":
/*!**************************!*\
  !*** ./client/client.js ***!
  \**************************/
/***/ (() => {

eval("/* Here we are using the require() syntax in our client javascript. Usually\n   we are not able to do this, because the browser does not have built in\n   support for CommonJS (where require() comes from) by default. However,\n   webpack allows us to use this syntax. When webpack runs and builds our\n   bundle.js (in the hosted folder), it will replace these require statements\n   will the contents of the files and packages we are importing so that we have\n   a browser-friendly version to send to the client.\n*/\n\n\n/* Most of the below code is ripped straight from the \"Status Code\" demo. The only\n   parts unique to this example are at the bottom of the init function. Look there\n   for more comments.\n*/\nconst handleResponse = async (response) => {\n    const content = document.getElementById('content');\n\n    switch(response.status) {\n      case 200:\n        content.innerHTML = `<b>Success</b>`;\n        break;\n      case 201:\n        content.innerHTML = `<b>Palette successfully created</b>`;\n        break;\n      case 204:\n        content.innerHTML = `<b>Palette successfully edited</b>`;\n        break;\n      case 400:\n        content.innerHTML = `<b>Bad Request</b>`;\n        break;\n      case 404:\n        content.innerHTML = `<b>Not Found</b>`;\n        break;\n      case 500:\n        content.innerHTML = `<b>Internal Server Error</b>`;\n        break;\n      default:\n        content.innerHTML = `<p>Status Code not Implemented By Client</p>`;\n        break;\n    }\n\n    const obj = await response.json();\n    if(obj.message){\n      content.innerHTML += `<p>${obj.message}</p>`;\n    }\n    if(obj.palettes)\n    {\n      \n    }\n};\n\nconst sendFetch = async (url) => {\n    const method = document.querySelector(\"#methodSelect\").value;\n    const action = document.querySelector(\"#urlField\").value;\n    const response = await fetch(action, {\n      method,\n      headers:  {\n        'Accept': 'application/json'}\n      });\n    handleResponse(response);\n};\n\n\nconst addPalette = async () => {\n  const paletteForm = document.querySelector(\"#paletteForm\");\n  const action = paletteForm.getAttribute(\"action\");\n  const method = paletteForm.getAttribute(\"method\");\n  //Get palette name and colors from html forms.\n  const name = document.querySelector(\"#nameField\").value;\n  let colorString = \"\";\n  const colors = Array.from(document.querySelectorAll(\"input[type='color']\")).map(color => color.value).join();\n  \n  console.log(colors)\n  const formData = `name=${name}&colors=${colors}`;\n  let response = await fetch('/addPalette', {\n    method: method,\n    headers: {\n      'Content-Type': 'application/x-www-form-urlencoded',\n      'Accept': 'application/json',\n    },\n    body: formData,\n  });\n  handleResponse(response);\n\n};\n\n\nconst addColor = () => {\n\n};\n\nconst removeColor = (event) => {\n  let color = event.target;\n};\nconst init = () => {\n    const paletteGenerator = document.querySelector(\"#paletteForm\");\n    const userForm = document.querySelector(\"#userForm\");\n\n    paletteGenerator.addEventListener(\"submit\", (e) => {\n      e.preventDefault();\n      addPalette();\n    });\n\n    userForm.addEventListener(\"submit\", (e) => {\n      e.preventDefault();\n      sendFetch();\n    });\n    const colors = document.querySelectorAll(\"input[type='color']\");\n    colors.forEach(color => {\n      color.addEventListener(\"input\", (e) => {\n        document.querySelector(`label[for=${e.target.id}]`).innerHTML = `Hex: ${e.target.value}`;\n        // e.target.label.innerHTML = `Hex: ${e.target.value}`;\n      });\n      color.addEventListener(\"change\", (e) => {\n        document.querySelector(`label[for=${e.target.id}]`).innerHTML = `Hex: ${e.target.value}`;\n        // e.target.label.innerHTML = `Hex: ${e.target.value}`;\n      });\n    });\n    \n};\n\nwindow.onload = init;\n\n//# sourceURL=webpack://color-palette-generator/./client/client.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./client/client.js"]();
/******/ 	
/******/ })()
;