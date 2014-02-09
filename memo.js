var fs = require('fs');

module.exports = memoProc;

String.prototype.toString = function() {
  return '"' + this + '"';
};
Object.prototype.toString = function() {
  var ret = [];
  for (var i in this) {
    if (this.hasOwnProperty(i)) {
      ret.push('\'' + i + '\' :' + this[i].toString() + '');
    }
  }
  return '({' + ret.join(", ") + '})';
};
Array.prototype.toString = function() {
  return '[' + this.map(function(x){return x.toString()}).join(", ") + ']';
};
function beginWith (text, pre) { return text.indexOf(pre) == 0; }

function memoProc(text, name, status_id, reply) {
  text = text.split(/[\r\n]/)[0];
  var memo =
    eval(fs.readFileSync(process.env.HOME+"/Dropbox/node/eliza/memo.txt","utf8"));
  const addm = ":memo add "
      , addn = ":memoa "
      , addl = ":memo list"
      , addr = ":memo rm "
      , addc = ":memo clear"
      , adds = ":memo restore";

  if (beginWith(text, addm))
    memoAdd(text.slice(addm.length));
  else if (beginWith(text, addn))
    memoAdd(text.slice(addn.length));
  else if (beginWith(text, addl))
    memoList();
  else if (beginWith(text, addr))
    memoRemove(text.split(' ').slice(2).join(' '));
  else if (beginWith(text, addc))
    memoClear();
  else if (beginWith(text, adds))
    memoRestore();
  else
    reply(name, 'usage;\n:memo add [memo]\n:memo list\n:memo rm [id]', status_id);
  return;

  function memoClear() {
    var bkname = 'bk+' + name;
    memo[bkname] = memo[name];
    memo[name] = [];
    reply(name, 'cleard (hint; :memo restore)');
    update();
  }

  function memoRestore() {
    var bkname = 'bk+' + name;
    if (bkname in memo) memo[name] = memo[bkname];
    memoList();
    update();
  }

  function memoAdd(t) {
    t = t.replace(/"/g, "''");
    if (!(name in memo)) memo[name] = [];
    memo[name].push(t);
    memoList();
    update();
  }

  function memoList() {
    var footer = '\n\t(' + (Math.random()+'').slice(15) + ')';
    if (!(name in memo)) {
      reply(name, 'Nothing'+footer, status_id);
      return;
    }
    var msg = [];
    for (var i=0; i<memo[name].length; i++) {
      if (memo[name][i])
        msg.push('['+i+']'+memo[name][i]);
    }

    if (msg.length === 0) {
      reply(name, 'Nothing'+footer, status_id);
      return;
    }

    msg = '\n' + msg.join('\n');
    reply(name, msg+footer, status_id);
  }

  function memoRemove(idxs) {
    console.log(memo[name], i, memo[name][i]);
    if (!(name in memo)) {
      reply(name, "無い", status_id);
      return;
    }
    idxs =
      idxs.split(',')
        .map(function(x){return parseInt(x) })
        .filter(function(x) { return !isNaN(x) })
        ;
    var msg = 'deleted ';
    for (var j=0; j<idxs.length; j++) {
      var i = idxs[j];
      var m = memo[name][i];
      if (m && delete memo[name][i])
        msg += '\n' + m;
    }
    update();
    reply(name, msg, status_id);
  }

  function update() {
    fs.writeFileSync(process.env.HOME + "/Dropbox/node/eliza/memo.txt"
        , memo.toString());
  }
}

// memoProc(':memo add "hoge"', 'cympf', 0, console.log)
memoProc(':memo list', 'rugxe', 0, console.log)
