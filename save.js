var version = '0.11.5'

  , child    = require("child_process")
  , fs       = require("fs")

  , twitter  = require('./mytwitter')
  , curl     = require('./curl')
  , chat     = require('./chat')

  , tenki    = require("./tenki")
  , getAnime = require("./anime")
  , runJ     = require('./j')
  , twitpic  = require('./twitpic')
  , kasitime = require('./kasitime')
  , shindan  = require('./shindan').shindan
  , tenkei   = require('./shindan').tenkei
  , memoProc = require('./memo')
  , happiness= require('./happiness')
  , lmgtfy   = require('./lmgtfy')

  , esc = String.fromCharCode(27)
  ;

var twit = twitter.twit
  , PosttoTwitter = twitter.PosttoTwitter
  , ReplytoTwitter = twitter.ReplytoTwitter
  , Favorite = twitter.Favorite
  ;

// ----------------------------------------------------

(function setup() {

  twit.stream('user', function(stream) {

    stream.on('data', function(data) {

      console.log("%j", data);

    });

  });

  console.log("### stream start");

})();
