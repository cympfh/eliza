var exec = require('child_process').exec;

function curl(url, cont) {
  console.warn("curl", url);
  exec("curl -s " + url, cont);
}

function parse(id, cont) {

  var url =
    "http://weather.goo.ne.jp/area/#.html"
      .replace('#', id);

  var contain = function (sub) {
    return function (str) {
      return str.indexOf(sub) !== -1;
    };
  };

  var parseInnerInt = function (str) {
    var re = />(\d+|\-)</;
    var result = str.match(re);
    if (result) {
      return result[1];
    }
    return null;
  };

  curl(url, function (err, html) {
    if (err) {
      return cont(err);
    }

    var ln =
      html.split('\n')
        .filter(contain('洗濯指数'))[0]
        .split('<td')
        .map(function (frag) { return '<td' + frag; })
        ;

    var idx = 0;
    while (!parseInnerInt(ln[idx])) { ++idx; }
    --idx;

    var today_max = parseInnerInt(ln[idx+1]);
    var tomorrow_max = parseInnerInt(ln[idx+2]);
    var today_min = parseInnerInt(ln[idx+3]);
    var tomorrow_min = parseInnerInt(ln[idx+4]);

    var today_rain =
      ln.slice(idx+10,idx+ 14).map(parseInnerInt);
    var tomorrow_rain =
      ln.slice(idx+19, idx+23).map(parseInnerInt);

    cont(null, {
      today: {
        max: today_max, min: today_min,
        rain: today_rain
      },
      tomorrow: {
        max: tomorrow_max, min: tomorrow_min,
        rain: tomorrow_rain
      }
    });

  });
}

module.exports = parse;
