var exec = require('child_process').exec
  , fs   = require('fs')
  , home = process.env.HOME
  , logf = home + '/Dropbox/soturon/wc.txt'
  , ID
  ;

  var interval = 1;

function wc(cont, flg) {

  exec('detex ' + home + '/Dropbox/soturon/thesis.tex | wc'
      , function(err, out) {
          var xs = out.split(/ +/)
            , x = +xs[2]
            , x0 = +fs.readFileSync(logf, 'utf8')

          var msg = "wds=% d-wds=% rest=% norma=%<words/day>";
          msg=msg.replace("%", x);
          msg=msg.replace("%", x-x0);
          msg=msg.replace("%", 5000-x);
          msg=msg.replace("%", f(x));
          cont(msg);

          if (flg) update(x);
        });

  function f(x) {
    var t0 = (new Date()).getTime()
      , t1 = (new Date('2014/2/4 15:00:00')).getTime()
      ;
    var ret = (5000 - x) / (t1 - t0) * 1000 * 60 * 60 * 24;
    ret = Math.floor(ret*100)/100;
    return ret;
  }

  function update(x) { fs.writeFileSync(logf, x) }

}

wc(console.log)

//-------

exports.wc = wc;
