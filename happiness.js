var curl = require('./curl')
  , url  = "http://asahi.co.jp/precure/happiness/story/"
  ;

module.exports = happiness;

function happiness(cont) {

  curl(url, "GET", function(html) {
    var ls = html.split('\n');

    var num, tit, when, epi = '';

    for (var i=0, flg = 0; i<ls.length; ++i) {
      var l = ls[i];
      if (flg == 0 && l === '<div class="story-tit">') {
        flg = 1;
      }
      else if (flg == 1 && l.indexOf('<dt>') === 0) {
        flg = 2;
        num = removeTag(l);
      }
      else if (flg == 2 && l.indexOf('<dd>') === 0) {
        flg = 3;
        when = removeTag(l);
      }
      else if (flg == 3 && l.indexOf('<h2') === 0) {
        flg = 4;
        tit = removeTag(l.slice(l.indexOf('</span>')));
      }
      else if (flg == 4 && l === '<div id="storyCont" class="clearfix">') {
        flg = 5;
      }
      else if (flg === 5 && l === '') {
        break;
      }
      else if (flg === 5) {
        var x = removeTag(l);
        if (!x) continue;
        epi += x;
      }
      
    }
    epi = epi.replace(/\&quot;/g, '``');
    epi = shuffle(epi);
    cont(num,when, tit, epi);
  });

}

function removeTag(x) {
  return x.replace(/<.*?>/g, '');
}

function shuffle(str) {
  var I = Math.random() * 7 + 5;
  for (var i=0;i < I; ++i) {
    str = cut(str);
  }
  function cut(str) {
    var i = Math.floor(Math.random() * str.length/2)
      , j = Math.floor(Math.random() * str.length/3)
      , idx0 = i   // Math.min(i, j)
      , idx1 = i+j // Math.max(i, j)

    var ret =
      str.slice(idx1) +
      str.slice(idx0, idx1) +
      str.slice(0, idx0)

    return ret;
  }
  return str;
}
