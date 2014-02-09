var DB   = require('./tenki.json')
  , curl = require('./curl')
  ;

module.exports = tenki;

function tenki(name, loc, cont) {
  if (!loc) loc = ref(name, '東京');
  if (!(loc in DB.url)) loc = '佐渡';

  var url = "http://weather.jp.msn.com/local.aspx?wealocations=wc:" + DB.url[loc];
  curl(url, 'GET', function(result) { cont(parse(result, loc)) });

  // where
  function ref(name, dflt) {
    if (name in DB.address) return DB.address[name];
    return dflt;
  }
}

function parse (buf, loc) {
  var today_temp = [],
      today_rain = [],
      tomor_temp = [],
      tomor_rain = [];

  var i = buf.indexOf("発表", 2000),
      j;

  // today_temp
  i = buf.indexOf(">最高", i) - 3
  j = buf.indexOf(">最低", i) + 22
  buf.slice(i,j).match(/^.*最高 (.*)<\/span.*最低 (.*)<\/span/)
  today_temp = [RegExp.$1, RegExp.$2]

  // today_rain
  i = buf.indexOf(">降水確率<",i)
  j = buf.indexOf("/table",i)
  buf.slice(i,j).match(/^.*<td>(.*?)<\/td>.*<td>(.*?)<\/td>.*<td>(.*?)<\/td>.*<td>(.*?)<\/td>.*<td>(.*?)<\/td>.*<td>(.*?)<\/td>.*<td>(.*?)<\/td>.*<td>(.*?)<\/td>/)
  today_rain = [RegExp.$2, RegExp.$4, RegExp.$6, RegExp.$8, ]

  // tomor_temp
  i = buf.indexOf(">最高", i) - 3
  j = buf.indexOf(">最低", i) + 20
  buf.slice(i,j).match(/^.*最高 (.*)<\/span.*最低 (.*)<\/span/)
  tomor_temp = [RegExp.$1, RegExp.$2]

  // tomor_rain
  i = buf.indexOf("降水確率",j)
  j = buf.indexOf("/table",i)
  buf.slice(i,j).match(/^.*<td>(.*?)<\/td>.*<td>(.*?)<\/td>.*<td>(.*?)<\/td>.*<td>(.*?)<\/td>.*<td>(.*?)<\/td>.*<td>(.*?)<\/td>.*<td>(.*?)<\/td>.*<td>(.*?)<\/td>/)
  tomor_rain = [RegExp.$2, RegExp.$4, RegExp.$6, RegExp.$8, ]

  var timestamp = (function() {
    var d = new Date();
    var ret =
      "Y/M/D H:M"
      .replace("Y", d.getYear()+1900)
      .replace('M', d.getMonth()+1)
      .replace('D', d.getDate())
      .replace('H', d.getHours())
      .replace('M', d.getMinutes())
    return ret;
  })();

  var ret =
        "\r\n" +
        "(((" + today_rain.join(" ") + ") (" + today_temp.join(" ") + "))\r\n" +
        " ((" + tomor_rain.join(" ") + ") (" + tomor_temp.join(" ") + "))\r\n" +
        "  (" + loc + " . " + timestamp + "))";
  ret = ret.replace(/&#176;C/g, " deg-C");
  return ret;
}

