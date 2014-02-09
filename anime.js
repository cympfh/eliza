var exec = require("child_process").exec
  , fs   = require("fs")
  ;

module.exports = getAnime;

// getAnime(console.log);

function getAnime(cont) {
  var ct = (new Date()).getHours();
  getAnimeList(parse);

  function parse(fname) {
    var ls = fs.readFileSync(fname, 'utf8').split('\n');
    ls = ls.filter(function(x){return !!x});

    var msg = '';
    ls.forEach(function(l) {
      l = l.split(';');
      var t0 = l[0]
        , t1 = l[1]
        , kyoku = l[2]
        , title = l[3]
        ;

      var at = parseInt(t0);
      if (5 <= at && at <= 21) return;

      if (!tokyo(kyoku)) return;
      msg +=
        "\nt0; kyoku; title"
          .replace("t0", t0)
          //.replace("t1", t1)
          .replace("kyoku", kyoku_alias(kyoku))
          .replace("title", title.slice(0,10))

    });
    cont(msg);
  }
}

function tokyo(x) {
  if (x.indexOf('BS-') !== -1) return false;
  var ls = [
       "TOKYO MX", "テレビ東京", "TBS"
     , "フジテレビ", "日本テレビ"
     , "テレビ朝日"
  ];
  for (var i=0; i<ls.length; ++i)
    if (x.indexOf(ls[i]) !== -1) return true;
  return false;
}

function getAnimeList(cont) {
  var d = new Date()
    , hour  = d.getHours() 
    ;
  if (hour < 5) {
    d.setDate(-1);
  }
  var fname = "/tmp/anime" + (d.getDate());
  fs.exists(fname, function(exists) {
    if (exists) {
      cont(fname);
    } else {
      var url = "http://www.posite-c.com/anime/day/";
      exec( "curl "+url+"|grep \"<table id=\\\"today\\\"\" > /tmp/ls"
          , function() {
            var ls = fs.readFileSync("/tmp/ls", "utf8")
              , tables = split(ls, "table");
            var infos  = split(tables[4], "tr")
                           .map(function(x){return split(x, 'td').map(first)})
              , titles = split(tables[5], "tr").map(first)
              ;

              var hoge = '';
              for (var i=0; i<infos.length; ++i) {

                if (infos[i].length < 3) continue;
                if (infos[i][0].indexOf(' - ') < 0) continue

                var time = infos[i][0].split(' - ')
                  , kyoku = infos[i][2]
                  , title = titles[i]

                if (!time[0] || !time[1]) continue;
                if (!title) continue;

                hoge += [time[0], time[1], kyoku, title].join(';') + '\n';
              }

              fs.writeFileSync(fname, hoge);
              cont(fname);

          });
    }
  });

  function split(ls, name) {
    var ret = [];
    var idx, idx2;
    for (;;) {
      idx = ls.indexOf("<"+name);
      if (idx === -1) break;
      var mark = "</"+name+">";
      idx2 = ls.indexOf(mark, idx);
      if (idx2 === -1) break;
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

}

function kyoku_alias(name) {
  var aliases = {
      "TOKYO MX" : "MX"
    , "テレビ東京" : "テレ東"
  };
  if (name in aliases) return aliases[name];
  else return name;
}
