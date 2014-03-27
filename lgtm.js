// look good to me

var com = 'curl -X GET -H "Content-type: application/json" -H "Accept: application/json" http://www.lgtm.in/g'
var exec = require('child_process').exec;

function lgtm(cont) {
  exec(com, function(err, data) {
    data = JSON.parse(data);
    cont(data.actualImageUrl);
  });
}
module.exports = lgtm;
