ptw = []

# () -> bool
popp = ->

  prob_pop = ->
    return 0 if ptw.length < 30

    gen = 0.001
    h = (new Date).getHours()
    t = Math.abs h - 2

    switch
      when t < 2  then gen
      when t < 12 then gen * 0.6
      else             gen * 0.3

  Math.random() < prob_pop()

pop = (cont) ->
  cont ptw.shift() if popp()

is_number = (c) ->
  n = parseInt(c)
  not (isNaN n)

# this works probability
push = (text, name) ->

  prob_push = ->
    len = ptw.length
    if len < 30 then 0.2 else (3 / len)

  pushp = -> Math.random() < prob_push()

  pushable = (text, name) ->
    contain = (sub) -> (text.indexOf sub) isnt -1
    return false if contain 'RT'
    return false if contain '@'
    return false if contain '#'
    return false if contain 'ttp'
    return false if (is_number name[name.length - 1])
    return true

  if (pushable text, name) and pushp()
    ptw.push text

module.exports =
  pop: pop
  push: push
  popp: popp
