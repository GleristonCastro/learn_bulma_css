const purify = require('purify-css');

const content = ['index.html'];
const css = ['css/main.css'];

const options = {
  output: 'css/main.clean.css',
  minify: true
};

purify(content, css, options);