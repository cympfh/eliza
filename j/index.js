module.exports = j;
function j(codefile, cont) {
  var child = require('child_process');
  child.exec('./j/j64-803/bin/jconsole < ' + codefile
           , function(err, ls) {
              if (err) cont(err.toString());
              ls = ls.trim();
              if (ls === '') ls = '(empty line)' + ')';
              cont(ls);
           });
}

