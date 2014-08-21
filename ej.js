var exec = require('child_process').exec;
function ej(word, cont) {
  exec('bash ej.sh ' + word, function (er,ou) {
    if (er) return cont(er);
    if (ou.length<3) {
      ou = "\"" + word + "\" not found";
    }
    cont(ou);
  });
}
module.exports = ej;
