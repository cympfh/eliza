var curl = require('./curl');

exports.tenkei = tenkei;
exports.shindan = shindan;

function tenkei(cont) {
  var num = 241197
  if (Math.random() < .08) {
      var cand = [274009, 232175, 267069, 194821]
      var idx  = Math.floor(Math.random() * cand.length)
      num  = cand[idx]
  }
  var unamegen = "RightHereRightNowFatboy1234567890あいうえお我ギグゲ後多値つてと機械学習パーセプと論帆下飲食禁止"
  var uname = '';
  for (var i=0, len = 6 + Math.floor(Math.random()*12); i < len; ++i)
    uname += unamegen[Math.floor(Math.random()*unamegen.length)];

  console.log('# tenkei', uname);
  shindan(num, uname, uname, function(result) {
    result = result.replace(/http.*?$/, '');
    result = result.replace(/#[^\s]*/g, '');
    cont(result);
  });
}

function shindan(number, name, s_name, cont) {
  s_name = s_name || name;

  var url = "http://shindanmaker.com/" + number;
  console.log("shindan", name, s_name);

  curl(url + "?u=" + s_name, 'POST', function (html) {
      if (html.indexOf("リクエストされたURLに該当するページがあ") > 0) {
        ReplytoTwitter(name, "bad request", status_id)
        return;
      }
      var idx = html.indexOf(">"
                        , html.indexOf("textarea"
                               , html.indexOf("コピペ用診断結果")));
      html = html.slice(idx+1, html.indexOf("</textarea>", idx));
      cont(html);
    });
}
