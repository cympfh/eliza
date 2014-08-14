fs = require('fs');

alias = (function() {

  var dict = {};
  var dict_path = process.env.HOME + "/datum/mail";

  fs.readFileSync(dict_path, 'utf8')
    .split('\n')
    .slice(0, -1)
    .forEach(function(l, idx) {
      var xs = l.split(' ')
      if (xs.length !== 2) {
        throw new Error("read error at " + idx + " : " + dict_path);
      }
      dict[xs[0]] = xs[1];
    });

  return function(name, def) {
    if (name in dict) {
      return dict[name];
    }
    return def;
  }
}());

module.exports = alias;
