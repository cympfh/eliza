var exec = require('child_process').exec;
function wk(title, name, cont) {
  if (cont == undefined) {
    cont = name;
    name = undefined;
  }
  var command = 'bash ./wiki/test.sh ' + title;
  if (name !== undefined) command += ' ' + name;
  console.warn(command);
  exec(command, function(er, ou) {
    if (er) throw er;
    cont(ou);
  });
}
module.exports = wk;
//animeinfo('さばげぶ', console.log);
//animeinfo('さばげぶ', 'かないみか',console.log);
//animeinfo('さばげぶ', '堀江由衣',console.log);
