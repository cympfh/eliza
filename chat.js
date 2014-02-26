var ptw = [];

function pop_or_push(text, post) {

  function prob_push() {
    var len = ptw.length;
    return len < 30 ? 0.1 : 3/len
  }

  function prob_pop() {
    const prob_pop_gen = 0.003
        , h = (new Date()).getHours()
        , t = Math.abs(h-2)
    return prob_pop_gen * (t <  2 ? 1
                         : t < 12 ? 0.6
                         :          0.3)
  }

  function pushable(text) {
    return (text.length < 40
           && text.indexOf("RT") == -1
           && text.indexOf("@") == -1
           && text.indexOf("ttp") == -1
           )
  }

  if (ptw.length > 30 && Math.random() < prob_pop()) {
    console.log("# pop")
    post(ptw.shift())
  }
  else if (pushable(text) && Math.random() < prob_push() ) {
    console.log("# push", text);
    ptw.push(text)
    console.log("ptw.length = ", ptw.length);
  }

}

/*
(function test() {
  for (var i=0;i<100;++i) {
    pop_or_push(''+i, function(){});
  }
})();
*/

var imgs = [
  "http://t.co/tN4bSvNrA1"
];

function chat(tw, cont) {

  if (ptw.length>5 && Math.random() < .7) {
    cont(ptw.shift());
  } else {
    chat3(tw, function(r) {
      if (r === null)
        r = Math.random()<.5 ? chat1(tw) : chat2(tw);
      cont(r);
      });
  }

  function chat1() {
    var n = Math.round(Math.log(Math.random()*100 + 2));
    var p = 1/4;
    var a = [Math.round(Math.random())];
    for (;n--;) {
      a.push(Math.random()<p ? (1-a[a.length-1]) : a[a.length-1]);
    }
    return a.map(function(x){return x===0 ? "！" : "？"}).join("");
  }

  function chat2() {
    var a = [
      "マジか", "ヤバイな"
      , "マジかー", "ヤバイなー"
      , "マジ？？", "ヤバイじゃん！"
      , "それな"
      ];
    return a[Math.floor(Math.random()*a.length)];
  }

  function chat3(t, cont) {
    child.exec("echo \""+t+"\" | mecab", function(_,ls) {
      var nouns =
        ls.split("\n").filter(function(l){return l.indexOf("\t名詞,")>0})
          .map(function(l){return l.split("\t")[0]});
      if (nouns.length === 0) return cont(null);

      var n = nouns.reduce(function(x,y){return x.length>y.length?x:y});
      if (n.length < 4) return cont(null);

      var suf = ["？", "…？？？", "って……？"];
      cont(n + suf[Math.floor(Math.random()*suf.length)]);
      return;
    });
  }
}

// -------

exports.pop_or_push = pop_or_push;
exports.reply = chat;
