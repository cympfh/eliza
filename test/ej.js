ej = require('../ej');

function aset() {
  var ls = [];
  for (var i = 0; i < arguments.length; ++i) {
    ls.push(arguments[i]);
  }
  return function (result) {
    if (ls.some(function (w) { return result.indexOf(w) === -1 })) {
      throw new Error('expect: ' + ls + '\nresult: ' + result);
    }
  }
}
ej('cat', aset('猫', '晴天乱流'));
ej('odg', aset('odg', 'not found'));
ej('dog', aset('イタチ', 'オオカミ', 'カワウソ'))
