#!/usr/local/bin/node
var version = '0.13.0'

  , child    = require("child_process")
  , fs       = require("fs")

  , twitter  = require('./mytwitter')
  , curl     = require('./curl')
  , chat     = require('./chat')

  , tenki    = require("./tenki")
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
  , ej = require('./ej')
  , bio = require('./bio')
  , cood = require('./cood')
  , google = require('./google')
  , duckduckgo = require('./duckduckgo')

  , esc = String.fromCharCode(27)
  ;

var twit = twitter.twit
  , PosttoTwitter = twitter.PosttoTwitter
  , ReplytoTwitter = twitter.ReplytoTwitter
  , Favorite = twitter.Favorite
  ;

// ----------------------------------------------------

var randFav = 0.004;

function strTime() {
    var t = new Date();
    return [t.getHours(), t.getMinutes(), t.getSeconds()].join(':');
}

function beginWith (text, pre) { return text.indexOf(pre) == 0; }

// -- util for Twitter -------------------------------

function test(name, status_id) {
    console.log("# test");
    ReplytoTwitter(name, "eliza ver." + version + " ("+strTime()+")", status_id)
}

function post_tenki(name, loc, status_id, source) {
  if (!loc && source === 'ツイッターするやつ') loc = '札幌';
  tenki(name, loc, function(result) {
    ReplytoTwitter(name, result, status_id);
  });
}

function tosho(name, status_id) {
    curl("http://www.lib.u-tokyo.ac.jp/sogoto/", 'GET', function (body) {
            body = body.slice(body.indexOf("opening")+8, body.length)
            body = body.slice(0, body.indexOf("<"))
            var msg = body + " (see http://goo.gl/UTNvN)"
            ReplytoTwitter(name, msg, status_id);
        });
}

function suicide() {
  console.log("Good bye, world");
  post_tenki('cympf', undefined, 425590732485709824, 'web');
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

        var raw_text = text;
        text = 
          (function remove_comment(s, k) {
              if (s.indexOf(k) < 0) return s;
              return s.slice(0, s.indexOf(k)).trim();
          })(text, ";");

        colored =
            esc+"[34m@" + name + " / " + nick + esc+"[m" +
            " ; " + esc+"[33mvia " + source + esc+"[m" +
            " ; " + strTime() + "\n" +
            text;

        console.log(colored);

        // ----- processes for command ---------------------

        function isMe(name) {
          return ["ampeloss","cympf", "undvi", "ide1o"].indexOf(name) !== -1;
        }

        function isReplyToEliza (text) {
          return /^@ampeloss/.test(text)
        }

        /*
        if (!isMe(name) && randFav > Math.random()) {
          var t = 9000 + Math.floor(Math.random()*300)*100;
          setTimeout(function() { Favorite(status_id) }, t);
        }
        */
        if ( Math.random() < .1 && (
                 (text.indexOf("つら") !== -1 && text.length < 10)
              || (text.indexOf("ぽよ") !== -1 && text.length < 5)
              || text.indexOf("死") !== -1
            )
          ) {
          var t = 9000 + Math.floor(Math.random()*300)*100;
          setTimeout(function() { Favorite(status_id) }, t);
        }

        // other commands

        /*
        if (name!=="ampeloss" && isReplyToEliza(text)) {
          var body = text.replace(/@[a-zA-Z0-9:]* /g, '')
          var time =
            2000 + (Math.pow(Math.random(), 100) * 30000)|0 ;
          console.log("# catch reply to me", time, body);
          setTimeout(function() {
            chat.reply(body, function(result) {
              ReplytoTwitter(name, result, status_id) });
          }, time);
          return;
        }
        */

        if (beginWith(text, ":kasitime")) {
          kasitime(function(l) {
            ReplytoTwitter(name, l, status_id) });
        }

        else if (beginWith(text, ":j ")) {
          var code = raw_text.slice(3).split('\n')[0]
            , fname = "/tmp/jcode";
          require("fs").writeFileSync(fname, code);
          runJ(fname
              , function(result) {
                  ReplytoTwitter(name, "\n"+result, status_id) });
          return;
        }
        else if (beginWith(text, ":anime")) {
          anime(function(ls) { ReplytoTwitter(name, ls, status_id); });
        }
        else if (beginWith(text, ":memo")) {
          memoProc(text, name, status_id, ReplytoTwitter);
        }

        else if (beginWith(text, ":bio ")) {
          var name = text.split(' ')[1];
          name = name.trim();
          if (!name) return;
          bio(name, function(text) {
            ReplytoTwitter(name, text, status_id);
          });
        }
        else if (beginWith(text, ":name") || text.indexOf('#name') > -1) {
          ReplytoTwitter(name, (tuple()).join(' '), status_id);
        }

        else if (beginWith(text, ":tenkie")) {
          console.log("# : tenki + tenkei")
          tenkei(function(res) {
            ReplytoTwitter(name, res, status_id) });
          post_tenki(name, text.split(" ")[1]
              , status_id, source);
          return ;
        }
        else if (beginWith(text, ":tenki")) {
          return post_tenki(name, text.split(" ")[1],
              status_id, source)
        }
        else if (beginWith(text, ":twitpic")) {
          twitpic(function(url) {
            ReplytoTwitter(name, url, status_id) });
          return;
        }
        else if (text.indexOf("天気教え")>=0 || text.indexOf("洗濯物占")>=0) {
          return post_tenki(name, undefined, status_id, source);
        }
        else if (text.indexOf(':co ') === 0) {
          cood(text.slice(4), function(lat, lng, loc) {
            ReplytoTwitter(name, lat + ', ' + lng + ' #' + loc, status_id);
          });
        }
        else if (beginWith(text, ':duck')) {
          text = text.replace(/　/g, ' ');
          var qs = text.slice(2).trim().split(' ');
          duckduckgo(qs, function(mi, de, url) {
            var body;
            body = "["+mi+"] " + de + "\n(" + url + ")";
            ReplytoTwitter(name, body, status_id);
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
            ReplytoTwitter(name, lines, status_id);
          });
        }
        else if (text.slice(-4) === '[検索]') {
          var w = text.slice(0, -4).trim();
          google(w, function(data) {
            data.split('\n').slice(0, -1)
              .slice(0, 3)
              .forEach(function(line) { ReplytoTwitter(name, line, status_id); });
          });
        }
        else if (beginWith(text, ":tosho")) {
          return tosho(name, status_id)
        }
        else if (/kositu|koshitu|koshitsu|kositsu/.test(text)) {
          var lobby_id = 1000 + parseInt(Math.random()*7000)
          ReplytoTwitter(name, "http://tenhou.net/0/?L" + lobby_id, status_id);
          return;
        }
        else if (/tenkei|TENKEI|тенкей|テンケイ|てんけい|天啓|天恵|添景|点景|天刑|天渓/.test(text)) {
          tenkei(function(res) { ReplytoTwitter(name, res, status_id) });
          return;
        }
        else if (beginWith(text, ":neko") || beginWith(text, ":neco")) {
          var number = 322469
            , s_name = (function(x){return x?x:name})(text.split(" ")[1]);
          shindan(number, name, s_name, function(res) { ReplytoTwitter(name, res, status_id) });
          return;
        }
        else if (beginWith(text, ":tateru")) {
          var number = 196616
            , s_name = (function(x){return x?x:name})(text.split(" ")[1]);
          shindan(number, name, s_name, function(res) { ReplytoTwitter(name, res, status_id) });
          return;
        }
        else if (beginWith(text, ":shindan ")) {
          var number = parseInt(text.split(" ")[1].trim());
          var s_name = (function(x){return x?x:name})(text.split(" ")[2]);
          shindan(number, name, s_name, function(res) { ReplytoTwitter(name, res, status_id) });
          return;
        }
        else if (beginWith(text, ":test")) {
          return test(name);
        }
        else if (beginWith(text, ":hap") || beginWith(text, ":pre")) {
          happiness(function(num, when, tit, epi) {
            var txt =
              "第num話「tit」when epi"
               .replace("num", num)
               .replace("tit", tit)
               .replace("when", when)
               .replace("epi", epi);
            ReplytoTwitter(name, txt, status_id, "cut");
          });
          return;
        }
        else if (beginWith(text, ":lmg ")) {
          var q = text.split(' ').slice(1).join(' ');
          q = q.replace(/[\r\n]/g, '');
          q = q.replace(/[\']/g, '%09');
          lmgtfy(q, function(url) { ReplytoTwitter(name, url, status_id) });
        }
        else if (beginWith(text, ":lgtm")) {
          lgtm(function(url) { ReplytoTwitter(name, url, status_id) });
        }
        else if (beginWith(text, ":ej ")) {
          var q = text.split(' ')[1];
          ej(q, function(result) { ReplytoTwitter(name, result, status_id); });
        }
        else if (text.indexOf("オハヨウゴザイマース") >= 0) {
          console.log("# good morning");
          ReplytoTwitter(name, "┗(⌒)(╬*☻-☻*╬)(⌒)┛＜ゲットアウト！（出ていけ！）", status_id);
        }
        else if (text.indexOf("田端") >= 0) {
          setTimeout(function() { PosttoTwitter("田端でバタバタ"); }, 1500);
        }
        /*
        else if (! data.user.protected ) {
          chat.pop_or_push(text, PosttoTwitter);
        }
        */

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
