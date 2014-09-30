{exec} = require 'child_process'
{random, round, log, abs, min, max} = Math

noun = (text, cont) ->
  text =
    text.replace /"/g, ''
      .replace /'/g, ''

  exec "echo \"#{text}\" | mecab", (er, ls) ->
    nouns =
      ls.split '\n'
        .filter (l) -> (l.indexOf '\t名詞') > 0
        .map (l) -> (l.split '\t')[0]

    if nouns.length is 0
      cont {status: "failed"}

    n = nouns.reduce (x, y) -> if x.length > y.length then x else y

    if n.length < 3
      cont {status: "failed"}

    sufs = [ '？', '...???', 'だね', 'か!!']
    suf = sufs[sufs.length * (do random) | 0]

    cont {status: "successed", msg: n + suf}

module.exports = noun
