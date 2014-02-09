var exec = require('child_process').exec;

module.exports = curl;

/*
 - conType = "GET" | "POST"
 - dataを送る場合はPOSTでもGETと同じようにurlに含めること
 */

function curl(url, conType, cont) {
  var com = "curl " + (conType === 'GET' ? '-G' : '') + " " + url.replace(/[\?&]/g, " -d ") + " | nkf ";
  exec(com, function (err, stdout, stdin) {
    if (err) console.log('[curl.js]' , err);
    if (stdout) cont(stdout);
  });
}
