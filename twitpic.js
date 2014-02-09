var curl = require('./curl');

module.exports = twitpic;

function twitpic(cont) {
  var url = "http://twitpic.com/";
  var chars = "0123456789abcdefghijklmnopqrstuvwxyz";
  url += chars[rnd(12)];
  for (var i=0; i<5; ++i) url += chars[rnd(36)];

  exists(url, function(){ cont(url) }
            , function(){ twitpic(cont) });
  
  // where
  function rnd(n){return Math.floor(Math.random()*n);}
}

function exists(url, tcont, fcont) {
  curl(url, 'GET', function(html) {
    if (html.indexOf("The photo you were looking for no longer exists") === -1)
      tcont();
    else
      fcont();
  });
}
