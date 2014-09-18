// command = ":trans en ja あとつづく"
function main(command, cont) {
  var ls = command.split(' ');
  var from_lang = ls[1];
  var to_lang = ls[2];
  var text = ls.slice(3).join(' ');
  text = text.replace(/"/g, '');
  text = encodeURIComponent(text);
  text = text.replace(/'/g, "%27");

  var exec = require('child_process').exec;
  exec('bash ./translate/run.sh ' + from_lang + ' ' + to_lang + ' \'' + text + '\'', function (er, out) {
    cont(out);
  });
}
module.exports = main;
