fs = require('fs')


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

  data.forEach(function(a) {
    console.log('[%s](%s)', a[0], a[1]);
  });
}
search();
