var Twitter  = require("ntwitter"),
    me = require('../setting.json').users.ampeloss,
    twit = new Twitter(me);

var barrier = (function() {
  var stack = [];

  // return true if over 50 tw/hour
  // otherwise push and return false
  return function () {
    if (stack.length < 50) return false;
    clear();
    if (stack.length > 50) return true;

    stack.push(d.getTime());
    return false;
  };

  function clear() {
    var d = (new Date()).getTime();
    for (var i=0; i<stack.length; ++i) {
      if (d - stack[i] < 60 * 60 * 1000) break;
    }
    stack = stack.slice(i);
  }
})();

function post_twitter(msg) {
    if (msg == undefined || msg == "" || msg == " " || msg == "\n") return;
    if (barrier()) return;

    msg = msg.slice(0, 140);
    twit.post("https://api.twitter.com/1.1/statuses/update.json"
             , {status : msg}
             , function(err,data){
                if (err) console.log('PostTwitter', err);
                console.log("# post_twitter ", msg); });
}

function reply_to(name, msg, id, option) {
  if (msg == "") return;
  if (barrier()) return;
  if (name == undefined || name == "") return post_twitter(msg);

  console.log("# reply_to", name, msg, id)

  msg = "@" + name + " " + msg;
  var msg0, msg1;

  if (msg.length <= 140) {
    msg0 = msg;
    msg1 = null;
  }
  else if (option === "cut") {
    msg0 = msg.slice(0, 140);
    msg1 = null;
  }
  else {
    var idx = msg.slice(0,140).lastIndexOf("\n");
    if (idx < 0) idx = 140;
    msg0 = msg.slice(0, idx);
    msg1 = msg.slice(idx+1);
  }
  twit.post("https://api.twitter.com/1.1/statuses/update.json"
          , {status : msg0, in_reply_to_status_id : id}
          , function(_, data) {
              if (msg1) reply_to(name, msg1, id);
            });
}

function Favorite(id) {
  var url = "https://api.twitter.com/1.1/favorites/create.json";
  twit.post(url, { "id" : id }, function(er, data) {});
}

//-------------

exports.twit = twit;
exports.post_twitter = post_twitter;
exports.reply_to = reply_to;
exports.Favorite = Favorite;

