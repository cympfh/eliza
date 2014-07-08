exec = require('child_process').exec;

module.exports = function(word, cont, fail) {
  if (!fail) fail = function(){};
  exec('./test.sh "' + word + '"', function(err, out) {
    if (err) return;
    if (out === 'failed'){
      fail();
      return;
    }
    cont(out);
  });
};
