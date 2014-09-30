pp = require './poppush'
noun = require './noun'
append_marks = require './append_marks'
{load, make, model_path} = require './ngram'
{random, round, log, abs, min, max} = Math

load model_path

# 
# reply choose within follows
# 1. pop (30%)
# 1. ngram (30%)
# 1. noun (if possible)
# 1. append_mark (else)

reply = (text, cont) ->

  text = text.replace(/@[\sa-zA-Z0-9_]*/g, '')
  text = do text.trim

  pr = do random

  if pr < 0.3
    pp.pop cont
    return

  pr -= 0.3

  if pr < 0.3
    msg = do make
    cont msg
    return

  noun text, (result) ->
    if result.status is 'successed'
      cont result.msg
    else
      msg = append_marks text
      cont msg

mutter = (cont) ->
  pr = do pp.popp
  if pr > 0.7
    pp.pop cont
  else
    cont (do make)

module.exports =
  push: pp.push
  reply: reply
  mutter: mutter
