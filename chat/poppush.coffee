{random, round, log, abs, min, max} = Math

ptw = []

popp = ->

  prob_pop = ->
    return 0 if ptw.length < 30

    gen = 0.004
    h = do (new Date).getHours
    t = abs h - 2

    switch
      when t < 2  then gen
      when t < 12 then gen * 0.6
      else             gen * 0.3

  (do random) < (do prob_pop)

pop = (cont) ->
  if (do popp)
    p = do ptw.shift
    console.warn "# chat.pop #{p}"
    cont p

is_number = (c) ->
  n = parseInt(c)
  not (isNaN n)

# this works probability
push = (text, name) ->

  prob_push = ->
    len = ptw.length
    if len < 30 then 0.2 else (3 / len)

  pushp = -> (do random) < (do prob_push)

  pushable = (text, name) ->
    contain = (sub) -> (text.indexOf sub) isnt -1
    return false if contain 'RT'
    return false if contain '@'
    return false if contain '#'
    return false if contain 'ttp'
    return false if (is_number name[name.length - 1])
    return true

  if (pushable text, name) and (do pushp)
    ptw.push text
    console.warn "# chat.push; ptw length is #{ptw.length}"

module.exports =
  pop: pop
  push: push
  popp: popp
