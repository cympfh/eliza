fs = require('fs')
isgd = require('../isgd');

// <h3 class="r"><a href="/url?q=http://d.hatena.ne.jp/keyword/hoge&amp;sa=U&amp;ei=nrK7U5r3Eonj8AXlvYLQDw&amp;ved=0CBQQFjAA&amp;usg=AFQjCNFccBXMhikxTo4d5evPmM1fH1pcBw"><b>hoge</b>とは - はてなキーワード - はてなダ イアリー</a></h3>

var re_url = /url\?q=(http[\:\/a-zA-Z0-9\.\-\_\%]*)\&amp/
  , re_tag = /\<.*?\>/g
  , re_href= /<a[^>]*>(.*)<\/a><\/h3>/
;

function after (line) {

  var r1 = line.match(re_url)
    , r2 = line.match(re_href);

  if (r1 === null || r2 === null) {
    console.warn('#Warn google: regexp failed: ', line);
    return false;
  }

  var url = r1[1]
    , title = r2[1];

  title = title.replace(re_tag, '');

  return [url, title];
}

Array.prototype.shuffle = function() {
  var that = this;
  return that;
  for (var i=0; i<that.length; ++i) {
    var j = Math.random() * that.length | 0;
    var tmp = that[j];
    that[j] = that[i];
    that[i] = tmp;
  }
  return tmp;
};

function search() {
  var re = /<h3 class="r".*?\/h3>/g

  var data =
    fs.readFileSync('./output', 'utf8')
      .match(re)
      .map(after)
      .filter(function(x){return x})
      ;

  if (data.length === 0) {
    console.log('failed');
    return;
  }

  data.shuffle()
    .forEach(function(a) {
      var title = a[1].slice(0,20);
      isgd(a[0], function(url) {
        console.log('[%s](%s)', title, url);
      });
  });
}
search();
