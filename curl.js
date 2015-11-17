var exec = require('child_process').exec;

/*
 - conType = "GET" | "POST"
 - dataを送る場合はPOSTでもGETと同じようにurlに含めること
 */

function curl(url, conType, cont) {
  var com = "curl " + (conType === 'GET' ? '-G' : '') + " " + url.replace(/[\?&]/g, " -d ") + " | nkf ";
  console.warn("do " + com + " in curl.js");
  exec(com, function (err, stdout) {
    if (err) {
      console.log('[curl.js]' , err);
    }
    if (stdout) {
      cont(stdout);
    }
  });
}

module.exports = curl;

