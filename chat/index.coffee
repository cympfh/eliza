pp = require './poppush'
noun = require './noun'
append_marks = require './append_marks'
{load, make, model_path} = require './ngram'
{random, round, log, abs, min, max} = Math
{warn} = console

load model_path

# 
# reply choose within follows
# 1. pop (30% and possible)
# 1. ngram (30%)
# 1. noun (if possible)
# 1. append_mark (else)

reply = (text, cont) ->

  text = text.replace(/@[\sa-zA-Z0-9_]*/g, '')
  text = do text.trim

  pr = do random

  if pr < 0.3 and (do pp.popp)
    warn "## reply with pop"
    pp.pop cont
    return

  pr -= 0.3

  if pr < 0.3
    warn "## reply with ngram"
    msg = do make
    cont msg
    return

  noun text, (result) ->
    warn "## reply with noun"
    if result.status is 'successed'
      cont result.msg
    else
      warn "### No. that failed. we using append_marks"
      msg = append_marks text
      cont msg

mutter = (cont) ->
  warn "## Eliza muttering"
  pr = do pp.popp
  if pr > 0.7
    warn "### with pop"
    pp.pop cont
  else
    warn "### with ngram"
    cont (do make)

module.exports =
  push: pp.push
  reply: reply
  mutter: mutter
