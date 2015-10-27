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
  n = 0
  for c of model[a]
    n += smooth model[a][c], c
  return false if n is 0
  m = (Math.random() * n) | 0
  for c of model[a]
    if m <= 0
      return c
    m -= model[a][c]
  return c

make = ->
  sen = []
  a = [true, true, true, true]
  c = true
  loop
    c = choose_next_char a
    break if is_false c
    a.push c
    a = a[-4 ..]
    sen.push c
    if sen.length > 100
      return make()
  sen.join ''

if process.argv[2] == 'test'
  console.log make()

module.exports =
  make: make
