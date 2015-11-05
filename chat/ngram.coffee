model = require './model/model.json'

is_false = (s) -> (s is false) or (s is 'false')

smooth = (n, c) ->
  if is_false c
    return n
  n = 1 + Math.pow(n, 1/10)
  n |= 0
  n

choose_next_char = (a) ->
  console.assert a.length is 4
  nexts = []
  n = 0
  for c of model[a]
    _n = smooth model[a][c], c
    nexts .push [c, _n]
    n += _n
  return false if n is 0

  m = (Math.random() * n) | 0
  for i in [0 ... nexts.length]
    if m <= 0
      return [nexts[i][0], nexts[i][1]/n]
    m -= nexts[i][1]

  [nexts[0][0], nexts[0][1]/n]

make = ->
  sen = []
  a = [true, true, true, true]
  p = 1
  loop
    [c, q] = choose_next_char a
    p *= q
    break if is_false c
    a.push c
    a = a[-4 ..]
    sen.push c
    if sen.length > 100
      return make()
  [(sen.join ''), p]

make_sentence = (debug=false) ->
  return ->
    loop
      [s, p] = make()
      console.log "#{p} #{s}" if debug
      if p > 1e-6
        return s

if process.argv[2] == 'test'
  console.log make_sentence(true)()

module.exports =
  make: make_sentence()
