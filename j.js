module.exports = j;
function j(codefile, cont) {
  var child = require('child_process');
  child.exec(process.env.HOME + '/Tools/j64-802/bin/jconsole < ' + codefile
           , function(err, ls) {
              if (err) cont(err.toString());
              ls = ls.trim();
              if (ls === '') ls = '(empty line)' + ')';
              cont(ls);
           });
}

