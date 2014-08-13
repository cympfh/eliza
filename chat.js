var ptw = [];

function pop_or_push(text, post) {

  function prob_push() {
    var len = ptw.length;
    return len < 30 ? 0.1 : 3/len
  }
  function pushp() {
    var x = Math.random(),
        y = prob_push();
    return x < y;
  }

  function prob_pop() {
    const prob_pop_gen = 0.04
        , h = (new Date()).getHours()
        , t = Math.abs(h-2)
    return prob_pop_gen * (t <  2 ? 1
                         : t < 12 ? 0.6
                         :          0.3)
  }

  function popp() {
    var x = Math.random(),
        y = prob_pop();
    return x < y;
  }

  function shuffle(t) {
    t = t.slice(0, 19);
    var j = 2 + (Math.random() * 2 | 0)
    for (var i=0; i < j; ++i) {
      if (i % 2) {
        var k1, k2;
        k1 = Math.random() * t.length | 0;
        k2 = Math.random() * t.length | 0;
        if (k1 === k2) continue;
        var j1, j2;
        j1 = Math.min(k1, k2);
        j2 = Math.max(k1, k2);
        t = t.slice(j2, t.length) + t.slice(j1, j2) + t.slice(0, j1);
      } else {
        var k;
        k = Math.random() * t.length | 0
        t = t.slice(k, t.length) + t.slice(0, k);
      }
    }
    return t;
  }

  function pushable(text) {
    return (
              text.indexOf("RT") == -1
           && text.indexOf("@") == -1
           && text.indexOf("#") == -1
           && text.indexOf("ttp") == -1
           )
  }

  if (ptw.length > 30 && popp()) {
    var p = ptw.shift() + ptw.shift();
    p = shuffle(p);
    console.log("# pop: %s", p)
    post(p);
  }
  else if (pushable(text) && pushp()) {
    ptw.push(text)
    console.log("# push [%s]; then length is %d", text, ptw.length);
  }
  else {
    console.log('## cannot pop or push');
    console.log(ptw.length, prob_pop(), prob_push());
    console.log('###')
  }

}

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
