var exec = require('child_process').exec;
module.exports = function (word, cont) {
  exec('sh ej/ej.sh ' + word, function (er,ou) {
    if (er) return cont(er);
    if (ou.length < 3) {
      ou = "\"" + word + "\" not found";
    }
    cont(ou);
  });
}
