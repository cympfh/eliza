exec = require('child_process').exec;
module.exports = function (cont) {
  exec('sh ./zapping/main.sh', function (er, out) {
    cont(er ? er : out);
  });
}
