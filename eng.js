var dict =
  require('fs')
    .readFileSync(process.env.HOME + '/Dropbox/txt/EngJa', 'utf8')
    .split('\n')
    .slice(0, -1)
    .filter(function(l) { return l.indexOf('\t') > 0})
    .map(function(l) { return l.split('\t')[0] })
    .slice(52)
  ;
  
function tuple() {
  var i = Math.random() * dict.length | 0
    , j = Math.random() * dict.length | 0
    ;
  return [dict[i], dict[j]];
}

module.exports = tuple;
