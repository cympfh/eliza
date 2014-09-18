ptw = []
{random, round, log, abs, min, max} = Math
{exec} = require 'child_process'

pop_or_push = (text, cont, debug = false) ->

  prob_push = ->
    return 0.8 if debug
    len = ptw.length
    if len < 30 then 0.1 else (3 / len)

  pushp = -> (do random) < (do prob_push)

  prob_pop = ->
    return 0.7 if debug and ptw.length > 3

    return 0 if ptw.length < 30

    gen = 0.04
    h = do (new Date).getHours
    t = abs h - 2

    switch
      when t < 2  then gen
      when t < 12 then gen * 0.6
      else             gen * 0.3

  popp = -> (do random) < (do prob_pop)

  shuffle = (t) ->
    t = t[0 .. 19]
    j = 2 + (do random) * 2 | 0
    for i in [0 ... j]
      switch
        when i % 2 is 1
          k1 = (do random) * t.length | 0
          k2 = (do random) * t.length | 0
          continue if k1 is k2

          j1 = min k1, k2
          j2 = max k1, k2

          t = t[j2 ... t.length] + t[j1 ... j2] + t[0 ... j1]

        else
          k = (do random) * t.length | 0
          t = t[k ... t.length] + t[0 ... k]

    return t

  pushable = (text) ->
    contain = (sub) -> (text.indexOf sub) isnt -1
    return false if contain 'RT'
    return false if contain '@'
    return false if contain '#'
    return false if contain 'ttp'
    return true

  switch
    when do popp
      p = (do ptw.shift) + (do ptw.shift)
      #p = shuffle p
      console.warn "# chat.pop #{p}"
      cont p

    when (pushable text) and (do pushp)
      ptw.push text
      console.warn "# ptw length is #{ptw.length}"

###
    else
      console.warn "# do nothing: 参考値: #{ptw.length} #{do prob_pop} #{do prob_push}"
###

chat = (text, cont) ->

  # only !?-mark
  chat1 = (cont) ->
    n = round log (do random) * 100 + 2
    p = 1/4
    a = [round do random]
    for i in [1 .. n]
      last = a[a.length - 1]
      a.push if (do random) < p then (1 - last) else last
    a.map (x) -> if x is 0 then '！' else '？'
     .join ''

  # nouns + ???
  chat3 = (text, cont) ->
    text =
      text.replace /"/g, ''
        .replace /'/g, ''

    exec "echo \"#{text}\" | mecab", (er, ls) ->
      nouns =
        ls.split '\n'
          .filter (l) -> (l.indexOf '\t名詞') > 0
          .map (l) -> (l.split '\t')[0]

      return (cont null) if nouns.length is 0

      n = nouns.reduce (x, y) -> if x.length > y.length then x else y

      sufs = [ '？', '...???', 'ね']
      suf = sufs[sufs.length * (do random) | 0]

      cont n + suf

      return

  if (ptw.length > 5) and ((do random) < 0.7)
    cont (do ptw.shift)
  else
    chat3 text, (r) ->
      r = do chat1 if r is null
      cont r

exports.pop_or_push = pop_or_push
exports.reply = chat
