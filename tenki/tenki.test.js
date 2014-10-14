var tenki = require('./index.js');
var pprint = require('./pprint.js');

function debug(error, result) {
  if (error) {
    console.warn(error);
  } else {
    console.log(result);
  }
}
tenki('cympfh', 'tokyo', debug);
tenki('cympfh', '神戸', debug);
