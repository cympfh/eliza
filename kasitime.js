module.exports = function(cont) {
  randomItem(function(item) {
    randomLine(item, cont);
  });
};

var exec = require('child_process').exec
  , fs = require('fs')
var url = 'http://www.kasi-time.com/'
 
function randomItem(cont) {
  exec('wget -O /tmp/kasihtml ' + url + 'ranking.php?cat=month'
    , function(err, stdout, stderr) {
        var doc = fs.readFileSync('/tmp/kasihtml', 'utf8');
        var items = collect(doc, /item-[0-9]*.html/);
        cont(items[Math.random() * items.length | 0]);
    });
}
 
function collect(txt, pat) {
  if (!pat.test(txt)) {
    return [];
  } else {
    var result = txt.match(pat);
    return collect(txt.slice(result.index + result[0].length), pat)
                  .concat(result[0])
  }
}
 
function randomLine(item, cont) {
  console.log(item);
  var id = item.match(/item-(\d*).html/)[1];
  exec('wget -O /tmp/kasihtml ' + url + '/item_js.php?no=' + id
        , function(err, stdout, stderr) {
            var doc = fs.readFileSync('/tmp/kasihtml', 'utf8');
            var idx = doc.indexOf("'")
              , idy = doc.lastIndexOf("'");
            var ls =
              doc.slice(idx+1, idy)
                 .replace(/&nbsp;/g, ' ')
                 .replace(/&gt;/g, '>')
                 .replace(/&lt;/g, '<')
                 .split('<br>')
                 .filter(function(l) { return l.length > 7 });
   
           cont(ls[Math.random()*ls.length | 0]);
  });
}
