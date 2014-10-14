var database = require('./database.json');
var parse = require('./parse.js');
var gu = require('../lib/gu.js');
var address = require('./address.json');
var aliases = require('./aliases.json');
var pprint = require('./pprint.js');

module.exports = function (name, loc, cont) {
  var i, loc_name;

  if (address[name] && !loc) {
    loc = address[name];
  }

  if (!loc) {
    loc = '東京';
  }

  if (aliases[loc]) {
    loc = aliases[loc];
  }

  for (i=0; i<database.length; ++i) {
    loc_name = database[i].name;
    if (loc_name.indexOf(loc) !== -1) {
      break;
    }
  }

  if (i < database.length) {
    parse(database[i].id, function (err, result) {
      if (err) {
        return cont(err);
      }
      result = pprint(result);
      return cont(loc + "\n" + result);
    });
  } else {
    cont('Not found the location');
  }

};
