var exec = require('child_process').exec;

module.exports = lmgtfy;

function lmgtfy(query, cont) {

  var command = "curl -s http://is.gd/create.php -d 'url=$1' | grep load_qrcode | sed 's/^.*load_qrcode..//' | sed 's/..;.*$//'";
  var url = "http://lmgtfy.com/?q=" + query;
  command = command.replace("$1", url);
  console.log(command)
  exec(command, function (err, stdout) {
         stdout = stdout.replace(/\{/g, "({");
         stdout = stdout.replace(/\}/g, "})");
         cont(stdout)
       });

}
