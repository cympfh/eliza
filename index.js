#!/usr/local/bin/node
var version = '0.14.0'

  , child    = require("child_process")
  , fs       = require("fs")

  , util     = require('./util')
  , twitter  = require('./mytwitter')
  , curl     = require('./curl')
  , chat     = require('./chat')
  , mail     = require('./mail')
  , mail_alias = require('./mail-alias')
  , safe     = require('./safe')
  , ngram = require('./ngram')

  , tenki    = require('./tenki')
  , zoi = require('./zoi')
  , anime    = require("./anime")
  , runJ     = require('./j')
  , twitpic  = require('./twitpic')
  , kasitime = require('./kasitime')
  , shindan  = require('./shindan').shindan
  , tenkei   = require('./shindan').tenkei
  , memoProc = require('./memo')
  , happiness= require('./happiness')
  , lmgtfy   = require('./lmgtfy') // let me Google
  , lgtm     = require('./lgtm') // look good to me
  , ej       = require('./ej')
  , bio = require('./bio')
  , cood = require('./cood')
  , google = require('./google')
  , duckduckgo = require('./duckduckgo')

  , esc = String.fromCharCode(27)
  ;

var twit = twitter.twit
  , post_twitter = twitter.post_twitter
  , reply_to = twitter.reply_to
  , Favorite = twitter.Favorite
  ;

// ----------------------------------------------------

var randFav = 0.004;

function strTime() {
    var t = new Date();
    return [t.getHours(), t.getMinutes(), t.getSeconds()].join(':');
}

function beginWith (text, pre) { return text.indexOf(pre) === 0; }

// -- util for Twitter -------------------------------

function test(cont) {
    console.log("# test");
    cont("eliza ver." + version + " ("+strTime()+")");
}

function suicide() {
  console.log("Good bye, world");
  process.exit();
}

//-----------------------------------------------
// stream living?

var last_time = (new Date()).getTime();
setInterval(function() {
  var now = (new Date()).getTime();
  var tmin = (now - last_time) / 1000 / 60;

  if (tmin > 10) {
    console.log('ji-ketsu');
    suicide();
  }
}, 60*1000);


//-----------------------------------------------


//-----------------------------------------------

(function setup() {

  twit.stream('user', function(stream) {

    stream.on('delete', function(data) {
      // data.status.id_str
    });

    stream.on('disconnect', function(data) {
      console.log(data.reason);
      suicide();
    });

    stream.on('data', function(data) {

      if (!data || !data.user || !data.text) { return }

        last_time = (new Date()).getTime();

        var user = data.user
          , name = user.screen_name
          , nick = user.name
          , text = data.text
                       .replace(/&lt;/g, "<")
                       .replace(/&gt;/g, ">")
                       .replace(/&amp;/g, "&")
                       .replace(/　/g, " ")
          , status_id = data.id_str
          , source = data.source.slice(data.source.indexOf(">")+1
                                     , data.source.length-4)
          ;

        text = text.replace(/　/g, ' ');
        text = text.replace(/  /g, ' ');
        text = text.trim();

        colored =
            esc+"[34m@" + name + " / " + nick + esc+"[m" +
            " ; " + esc+"[33mvia " + source + esc+"[m" +
            " ; " + strTime() + "\n" +
            text;

        console.log(colored);

        // ----- processes for command ---------------------

        function isMe(name) {
          return ["ampeloss","cympfh", "unddich"].indexOf(name) !== -1;
        }

        if (!isMe(name) && randFav > Math.random()) {
          var t = 9000 + Math.floor(Math.random()*300)*100;
          setTimeout(function() { Favorite(status_id) }, t);
        }

        // other commands

        if (text[0] === ":") {
          return colon(text, name, status_id,
                      function(result) {
                        reply_to(name, result, status_id)
                      });
        }
        else if (text.slice(-4) === '[検索]') {
          var w = text.slice(0, -4).trim();
          console.warn('? google with ' + w);
          google(w, function(data) {
            var lines = 
              data.split('\n').slice(0, -1)
            .slice(0, 3)
            .join('\n');

            console.warn('? results:\n' + lines);
            reply_to(name, lines, status_id);
          });
        }
        else if (text.indexOf("天気教え")>=0 || text.indexOf("洗濯物占")>=0) {
          return tenki(name, undefined, function(result) {
            reply_to(name, result, status_id);
          });
        }
        else if (/tenkei|TENKEI|тенкей|テンケイ|てんけい|天啓|天恵|添景|点景|天刑|天渓/.test(text)) {
          tenkei(function(res) { reply_to(name, res, status_id) });
          return;
        }
        else if (text.indexOf("オハヨウゴザイマース") >= 0) {
          reply_to(name,
                         "┗(⌒)(╬*☻-☻*╬)(⌒)┛＜ゲットアウト！（出ていけ！）",
                         status_id);
        }
        else if (text.indexOf("田端") >= 0) {
          setTimeout(function() { post_twitter("田端でバタバタ"); }, 1500);
        }
        else if (Math.random() < .004) {
          // chat.pop_or_push(text, post_twitter);
          // ngram.train(ngram.train_path, ngram.model_path)
          ngram.load(ngram.model_path)
          post_twitter(ngram.make())
        }
        else if (name !== 'ampeloss' && util.is_reply(text)) {
          ngram.load(ngram.model_path)
          msg = ngram.make();
          reply_to(name, msg, status_id);
        }

    });

    stream.on('end', function() {
      console.log("### stream end")
      suicide();
    });

    stream.on('destroy', function() {
      console.log("### stream destroy")
      suicide();
    });

    stream.on("close", function() {
      console.log("### stream close")
      suicide();
    });

    stream.on("error", function (e) {
      console.log("### emitted an error", e);
      suicide();
    });

  });

  console.log("### stream start");

})();

function colon(text, name, status_id, cont) {
  if (beginWith(text, ":kasitime")) {
    kasitime(cont);
    return;
  }
  else if (beginWith(text, ":j ")) {
    var code = text.slice(3).split('\n')[0]
      , fname = "/tmp/jcode";
    require("fs").writeFileSync(fname, code);
    runJ(fname
        , function(result) { cont("\n" + result) });
    return;
  }
  else if (beginWith(text, ":anime")) {
    anime(cont);
  }
  else if (beginWith(text, ":memo")) {
    memoProc(text, name, status_id, reply_to);
  }

  else if (beginWith(text, ":bio ")) {
    var name = text.split(' ')[1];
    name = name.trim();
    if (!name) return;
    bio(name, cont);
  }
  else if (beginWith(text, ":tenkie")) {
    console.log("# : tenki + tenkei")
    tenkei(cont);
    tenki(name, text.split(" ")[1], cont);
    return ;
  }
  else if (beginWith(text, ":tenki")) {
    return tenki(name, text.split(" ")[1], cont);
  }
  else if (beginWith(text, ":twitpic")) {
    twitpic(cont);
    return;
  }
  else if (beginWith(text, ':duck')) {
    text = text.replace(/　/g, ' ');
    var qs = text.slice(2).trim().split(' ');
    duckduckgo(qs, function(mi, de, url) {
      var body;
      body = "["+mi+"] " + de + "\n(" + url + ")";
      cont(body);
    });
  }
  else if (beginWith(text, ':?')) {
    text = text.replace(/　/g, ' ');
    var w = text.slice(2).trim().replace(/ /g, '+');
    console.warn('? google with ' + w);
    google(w, function(data) {
      var lines = 
        data.split('\n').slice(0, -1)
          .slice(0, 3)
          .join('\n');

      console.warn('? results:\n' + lines);
      cont(lines);
    });
  }
  else if (beginWith(text, ":kositu")) {
    var lobby_id = 1000 + parseInt(Math.random()*7000)
    cont("http://tenhou.net/0/?L" + lobby_id);
    return;
  }
  else if (beginWith(text, ":zoi")) {
    zoi(function(url) {
      var msg = url + " #NEWGAME! " + (new Date());
      cont(msg);
    });
    return;
  }
  else if (beginWith(text, ":neko") || beginWith(text, ":neco")) {
    var number = 322469
      , s_name = (function(x){return x?x:name})(text.split(" ")[1]);
    shindan(number, name, s_name, cont);
    return;
  }
  else if (beginWith(text, ":tateru")) {
    var number = 196616
      , s_name = (function(x){return x?x:name})(text.split(" ")[1]);
    shindan(number, name, s_name, cont);
    return;
  }
  else if (beginWith(text, ":shindan ")) {
    var number = parseInt(text.split(" ")[1].trim());
    var s_name = (function(x){return x?x:name})(text.split(" ")[2]);
    shindan(number, name, s_name, cont);
    return;
  }
  else if (beginWith(text, ":test")) {
    return test(cont);
  }
  else if (beginWith(text, ":hap") || beginWith(text, ":pre")) {
    happiness(function(num, when, tit, epi) {
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
  else if (beginWith(text, ":lmg ")) {
    var q = text.split(' ').slice(1).join(' ');
    q = q.replace(/[\r\n]/g, '');
    q = q.replace(/[\']/g, '%09');
    lmgtfy(q, cont);
  }
  else if (beginWith(text, ":lgtm")) {
    lgtm(cont);
  }
  else if (beginWith(text, ":ej ")) {
    var q = text.split(' ')[1];
    ej(q, cont);
  }
  else if (beginWith(text, ":co ")) {
    cood(text.slice(4), function(lat, lng, loc) {
      cont(lat + ', ' + lng + ' #' + loc);
    });
  }
  else if (beginWith(text, ":echo ")) {
    cont(text.slice(6));
  }
  else if (beginWith(text, ":mail ")) {
    var qs = text.split(' ');
    // var to = qs[1];
    var command = qs.slice(1).join(' ');
    colon(command, name, status_id, function(result) {
      var to = mail_alias(name, name + "@gmail.com");
      mail(to, command, result);
      console.warn("mail", command, to, result);
      cont("mail \"" + result + "\"");
    });
  }
}
