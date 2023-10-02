/* This file is an example of one that we might write to
   be imported into our client's bundle.js. Without a tool
   like webpack, we cannot use the CommonJS require/export
   pattern. However, webpack allows us to do just that. Here
   we create a simple function called print(), and export it
   from other.js. Then, client.js requires the file and uses
   the function.

   When we run 'npm run build', webpack will combine the files
   together and minify them into a browser-friendly version
   that uses pure, browser-compatible javascript instead of
   CommonJS.
*/

const print = () => {
    console.log('testing');
};

module.exports = {
    print,
}