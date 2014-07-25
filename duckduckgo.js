var exec = require('child_process').exec;

module.exports = duckduckgo;

function duckduckgo(qs, cont) {

  url = "https://duckduckgo.com/lite/?q=" + qs.join('+');
  exec("w3m -dump " + url, function(er, data) {
    var ls = data.split('\n');
    var ret = '';
    top:
      for (var i=0; i<ls.length; ++i) {
      if (ls[i].indexOf("1. ") == 0) {
        var j=i+1;
        for (;j<ls.length; ++j) {
          if (ls[j].trim() === '') {
            break top;
          }
        }
      }
    }
    var midasi, desc, url;
    midasi = ls[i].slice(2).trim();
    desc = ls.slice(i+1, j-1)
             .map(function(l){return l.trim()}).join('');
    url = ls[j-1].trim();
    cont(midasi, desc, url);
  });
}

// test
//duckduckgo(['スイス', '公用語'], function(m, d, u) {
//  console.log("[%s]\n%s\n(http://%s)", m, d, u);
//});
