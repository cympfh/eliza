var exec = require('child_process').exec;
var path = "j";

function j(codefile, cont) {
  exec(path + ' < ' + codefile, function(err, ls) {
    if (err) {
      cont(err.toString());
      return;
    }
    ls = ls.trim();
    if (ls === '') {
      ls = '(empty line)';
    }
    cont(ls);
  });
}

module.exports = j;
