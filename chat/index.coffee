pp = require './poppush'
{make} = require './ngram'

reply = (text, cont) ->

  text = text.replace(/@[\sa-zA-Z0-9_]*/g, '')
  text = text.trim()

  if (Math.random() < 0.8) and (pp.popp())
    pp.pop cont
  else
    cont make()

mutter = (cont) ->
  if (Math.random() < 0.1) and (pp.popp())
    pp.pop cont
  else
    cont make()

module.exports =
  push: pp.push
  reply: reply
  mutter: mutter
