var exec = require("child_process").exec
  , fs   = require("fs")
  ;

function getAnimeList(cont) {

  function split(ls, name) {
    var ret = [];
    var idx, idx2
      , mark;
    for (;;) {
      idx = ls.indexOf("<"+name);
      if (idx === -1) { break; }
      mark = "</"+name+">";
      idx2 = ls.indexOf(mark, idx);
      if (idx2 === -1) { break; }
      ret.push(ls.slice(idx, idx2+mark.length));
      ls = ls.slice(idx2+mark.length);
    }
    return ret;
  }

  function first(x) {
    x = x.slice(0, x.indexOf('</'));
    x = x.slice(x.lastIndexOf('>')+1);
    return x;
  }

  var fname = '/tmp/animeList'
    , url = "http://www.posite-c.com/anime/day/";

  exec( "curl "+url+"|grep \"<table id=\\\"today\\\"\" > /tmp/ls"
      , function () {
          fs.readFile('/tmp/ls', 'utf8', function(err, ls) {

            var tables = split(ls, "table")
              , infos  = split(tables[4], "tr")
                           .map(function(x){return split(x, 'td').map(first);})
              , titles = split(tables[5], "tr").map(first)
              ;

            var hoge = '';

            infos.forEach(function (info, i) {
              var time, kyoku
                , title = titles[i];

              if (info.length < 3 || info[0].indexOf(' - ') < 0) {
                return;
              }

              time = info[0].split(' - ');
              kyoku = info[2];

              if (!time[0] || !time[1] || !title) {
                return;
              }

              hoge += [time[0], time[1], kyoku, title].join(';') + '\n';
            });

            fs.writeFile(fname, hoge, function () {
              cont(fname);
            });
          });

      });

}

function getAnime(cont) {

  function tokyo(x) {
    if (x.indexOf('BS-') !== -1) { return false; }
    var ls =
      [ "TOKYO MX", "テレビ東京", "TBS"
      , "フジテレビ", "日本テレビ", "テレビ朝日" ];
    return ls.some(function (l) { return x.indexOf(l) !== -1; });
  }

  function kyoku_alias(name) {
    var aliases = {
        "TOKYO MX" : "MX"
      , "テレビ東京" : "テレ東"
      , "日本テレビ" : "日テレ"
    };
    if (aliases.hasOwnProperty(name)) {
      return aliases[name];
    }
    return name;
  }

  function parse(fname) {
    fs.readFile(fname, 'utf8', function(err, ls) {
      ls = ls.split('\n');
      ls = ls.filter(function(x){return !!x;});

      var msg = '';
      ls.forEach(function(l) {
        l = l.split(';');
        var t0 = l[0]
          // , t1 = l[1]
          , kyoku = l[2]
          , title = l[3]
          ;

        var at = parseInt(t0, 10);
        if ((5 <= at && at <= 18) || !tokyo(kyoku)) {
          return;
        }

        msg +=
          "\nt0; kyoku; title"
            .replace("t0", t0)
            //.replace("t1", t1)
            .replace("kyoku", kyoku_alias(kyoku))
            .replace("title", title.slice(0,10))
        ;

      });

      cont(msg);

    });
  }

  getAnimeList(parse);
}

// ---------------------------------------

// getAnime(console.log);
module.exports = getAnime;
