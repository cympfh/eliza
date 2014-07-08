var exec = require('child_process').exec;
function ej(word, cont) {
  exec('bash ej.sh ' + word, function (er,ou) {
    if (er) return cont(er);
    cont(ou);
  });
}
module.exports = ej;
