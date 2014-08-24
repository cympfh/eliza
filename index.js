#!/usr/local/bin/node
var version = '0.14.0';

var child    = require("child_process");
var fs       = require("fs");

var util     = require('./lib/util');
var twitter  = require('./mytwitter');
var curl     = require('./curl');
var chat     = require('./chat');
var mail     = require('./mail');
var mail_alias = require('./mail-alias');
var safe     = require('./safe');
var ngram = require('./ngram');

var tenki    = require('./tenki');
var zoi = require('./zoi');
var misdo = require('./misdo');
var anime    = require("./anime");
var runJ     = require('./j');
var twitpic  = require('./twitpic');
var kasitime = require('./kasitime');
var shindan  = require('./shindan').shindan;
var tenkei   = require('./shindan').tenkei;
var memoProc = require('./memo');
var happiness = require('./happiness');
var lmgtfy   = require('./lmgtfy'); // let me Google
var lgtm     = require('./lgtm'); // look good to me
var ej       = require('./ej');
var bio = require('./bio');
var cood = require('./cood');
var google = require('./google');
var duckduckgo = require('./duckduckgo');

var esc = String.fromCharCode(27);

var twit = twitter.twit;
var post_twitter = twitter.post_twitter;
var reply_to = twitter.reply_to;
var fav_twitter = twitter.fav_twitter;

// ----------------------------------------------------

var rand_fav = 0.004;

function strTime() {
  'use strict';
  var t = new Date();
  return [t.getHours(), t.getMinutes(), t.getSeconds()].join(':');
}

function beginWith(text, pre) {
  'use strict';
  return text.indexOf(pre) === 0;
}

// -- util for Twitter -------------------------------

function test(cont) {
  'use strict';
  console.log("# test");
  cont("eliza ver." + version + " (" + strTime() + ")");
}

function suicide() {
  'use strict';
  console.log("Good bye, world");
  process.exit();
}

//-----------------------------------------------
// stream living?

var last_time = (new Date()).getTime();
setInterval(function () {
  'use strict';
  var now, tmin;
  now = (new Date()).getTime();
  tmin = (now - last_time) / 1000 / 60;

  if (tmin > 10) {
    console.log('ji-ketsu');
    suicide();
  }
}, 60 * 1000);


//-----------------------------------------------

function colon(text, name, status_id, cont) {
  'use strict';
  var code, fname, q, qs, w, lobby_id, number, s_name;
  if (beginWith(text, ":kasitime")) {
    kasitime(cont);
    return;
  }
  if (beginWith(text, ":j ")) {
    code = text.slice(3).split('\n')[0];
    fname = "/tmp/jcode";
    require("fs").writeFileSync(fname, code);
    runJ(fname,
         function (result) { cont("\n" + result); });
    return;
  }
  if (beginWith(text, ":anime")) {
    anime(cont);
    return;
  }
  if (beginWith(text, ":misdo")) {
    misdo(function (msg) { reply_to(name, msg, status_id); });
    return;
  }
  if (beginWith(text, ":memo")) {
    memoProc(text, name, status_id, reply_to);
    return;
  }
  if (beginWith(text, ":bio ")) {
    name = text.split(' ')[1];
    name = name.trim();
    if (!name) {
      return;
    }
    bio(name, cont);
    return;
  }
  if (beginWith(text, ":tenkie")) {
    console.log("# : tenki + tenkei");
    tenkei(cont);
    tenki(name, text.split(" ")[1], cont);
    return;
  }
  if (beginWith(text, ":tenki")) {
    return tenki(name, text.split(" ")[1], cont);
  }
  if (beginWith(text, ":twitpic")) {
    twitpic(cont);
    return;
  }
  if (beginWith(text, ':duck')) {
    text = text.replace(/　/g, ' ');
    qs = text.slice(2).trim().split(' ');
    duckduckgo(qs, function (mi, de, url) {
      var body;
      body = "[" + mi + "] " + de + "\n(" + url + ")";
      cont(body);
    });
    return;
  }
  if (beginWith(text, ':?')) {
    text = text.replace(/　/g, ' ');
    w = text.slice(2).trim().replace(/ /g, '+');
    console.warn('? google with ' + w);
    google(w, function (data) {
      var lines = data.split('\n').slice(0, -1)
                      .slice(0, 3)
                      .join('\n');

      console.warn('? results:\n' + lines);
      cont(lines);
    });
    return;
  }
  if (beginWith(text, ":kositu")) {
    lobby_id = 1000 + Math.floor(Math.random() * 7000);
    cont("http://tenhou.net/0/?L" + lobby_id);
    return;
  }
  if (beginWith(text, ":zoi")) {
    zoi(function (url) {
      var msg = url + " #NEWGAME! " + (new Date());
      cont(msg);
    });
    return;
  }
  if (beginWith(text, ":neko") || beginWith(text, ":neco")) {
    number = 322469;
    s_name = (function (x) { return x || name; }(text.split(" ")[1]));
    shindan(number, name, s_name, cont);
    return;
  }
  if (beginWith(text, ":tateru")) {
    number = 196616;
    s_name = (function (x) { return x || name; }(text.split(" ")[1]));
    shindan(number, name, s_name, cont);
    return;
  }
  if (beginWith(text, ":shindan ")) {
    number = parseInt(text.split(" ")[1].trim(), 10);
    s_name = (function (x) { return x || name; }(text.split(" ")[2]));
    shindan(number, name, s_name, cont);
    return;
  }
  if (beginWith(text, ":test")) {
    return test(cont);
  }
  if (beginWith(text, ":hap") || beginWith(text, ":pre")) {
    happiness(function (num, when, tit, epi) {
      var txt =
        "第num話「tit」when epi"
        .replace("num", num)
        .replace("tit", tit)
        .replace("when", when)
        .replace("epi", epi);
      cont(txt);
    });
    return;
  }
  if (beginWith(text, ":lmg ")) {
    q = text.split(' ').slice(1).join(' ');
    q = q.replace(/[\r\n]/g, '');
    q = q.replace(/[\']/g, '%09');
    lmgtfy(q, cont);
  }
  if (beginWith(text, ":lgtm")) {
    lgtm(cont);
  }
  if (beginWith(text, ":ej ")) {
    q = text.split(' ')[1];
    ej(q, cont);
  }
  if (beginWith(text, ":co ")) {
    cood(text.slice(4), function (lat, lng, loc) {
      cont(lat + ', ' + lng + ' #' + loc);
    });
    return;
  }
  if (beginWith(text, ":echo ")) {
    cont(text.slice(6));
    return;
  }
  if (beginWith(text, ":mail ")) {
    qs = text.split(' ');
    // var to = qs[1];
    (function () {
      var command = qs.slice(1).join(' ');
      colon(command, name, status_id, function (result) {
        var to = mail_alias(name, name + "@gmail.com");
        mail(to, command, result);
        console.warn("mail", command, to, result);
        cont("mail \"" + result + "\"");
      });
    }());
  }
}

//

(function setup() {
  'use strict';

  twit.stream('user', function (stream) {

    /*
    stream.on('delete', function (data) {
      data.status.id_str
    });
    */

    stream.on('disconnect', function (data) {
      console.log(data.reason);
      suicide();
    });

    stream.on('data', function (data) {
      var t, user, name, nick, text, status_id, source, colored;

      if (!data || !data.user || !data.text) {
        return;
      }

      last_time = (new Date()).getTime();

      user = data.user;
      name = user.screen_name;
      nick = user.name;
      text = data.text
                .replace(/&lt;/g, "<")
                .replace(/&gt;/g, ">")
                .replace(/&amp;/g, "&")
                .replace(/　/g, ' ')
                .replace(/ {2}/g, ' ')
                .trim();
      status_id = data.id_str;
      source = data.source.slice(data.source.indexOf(">") + 1, data.source.length - 4);

      colored =
        esc + "[34m@" + name + " / " + nick + esc + "[m" +
        " ; " + esc + "[33mvia " + source + esc + "[m" +
        " ; " + strTime() + "\n" +
        text;

      console.log(colored);

      // ----- processes for command ---------------------

      function isMe(name) {
        return ["ampeloss", "cympfh", "unddich"].indexOf(name) !== -1;
      }

      if (!isMe(name) && rand_fav > Math.random()) {
        t = 9000 + Math.floor(Math.random() * 300) * 100;
        setTimeout(function () { fav_twitter(status_id); }, t);
      }

      // other commands
      (function () {
        var w, msg;

        if (text[0] === ":") {
          return colon(text, name, status_id, function (result) { reply_to(name, result, status_id); });
        }
        if (text.slice(-4) === '[検索]') {
          w = text.slice(0, -4).trim();
          google(w, function (data) {
            var lines = data.split('\n').slice(0, -1)
                            .slice(0, 3)
                            .join('\n');

            console.warn('? results:\n' + lines);
            reply_to(name, lines, status_id);
          });
          return;
        }
        if (text.indexOf('#memo') >= 0) {
          text = text.replace(/#memo/g, '');
          text = text.trim();
          text = ':memo add ' + text;
          console.warn('transfer to ', text);
          return colon(text, name, status_id, function (result) { reply_to(name, result, status_id); });
        }
        if (text.indexOf("天気教え") >= 0 || text.indexOf("洗濯物占") >= 0) {
          return tenki(name, undefined, function (result) {
            reply_to(name, result, status_id);
          });
        }
        if (/tenkei|TENKEI|тенкей|テンケイ|てんけい|天啓|天恵|添景|点景|天刑|天渓/.test(text)) {
          tenkei(function (res) { reply_to(name, res, status_id); });
          return;
        }
        if (text.indexOf("オハヨウゴザイマース") >= 0) {
          reply_to(name, "┗(⌒)(╬*☻-☻*╬)(⌒)┛＜ゲットアウト！（出ていけ！）", status_id);
          return;
        }
        if (text.indexOf("田端") >= 0) {
          setTimeout(function () { post_twitter("田端でバタバタ"); }, 1500);
          return;
        }
        if (Math.random() < 0.004) {
          // chat.pop_or_push(text, post_twitter);
          // ngram.train(ngram.train_path, ngram.model_path);
          ngram.load(ngram.model_path);
          post_twitter(ngram.make());
          return;
        }
        if (name !== 'ampeloss' && name !== '2Dbot' && util.is_reply(text)) {
          ngram.load(ngram.model_path);
          msg = ngram.make();
          reply_to(name, msg, status_id);
          return;
        }
      }());

    });

    stream.on('end', function () {
      console.log("### stream end");
      suicide();
    });

    stream.on('destroy', function () {
      console.log("### stream destroy");
      suicide();
    });

    stream.on("close", function () {
      console.log("### stream close");
      suicide();
    });

    stream.on("error", function (e) {
      console.log("### emitted an error", e);
      suicide();
    });

  });

  console.log("### stream start");

}());
