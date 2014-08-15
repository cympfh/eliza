## N-gram model
# use previous N-1 words (chars) as key for the next 1 word (char)
#

fs = require 'fs'
ngram = (require 'nltk').ngram
{warn} = console

train_path = './ngram/train.txt'
model_path = './ngram/model.json'

__BOS__ = true
__EOS__ = false

N = 4
gram = new ngram N

table = {}

train = (path, model) ->

  add_table = (datum) ->
    datum.forEach (d) ->
      key = d.slice 0, -1
        .join ''
      val = d[d.length - 1]
      if table[key]
        if table[key][val]
          ++table[key][val]
        else
          table[key][val] = 1
      else
        table[key] = {}
        table[key][val] = 1

  datum =
    fs.readFileSync path, 'utf8'
      .split '\n'
      .slice 0, -1
      .map ((l) -> (__BOS__ for i in [2 .. N]) .concat (l.split '') .concat [__EOS__])

  datum
    .forEach (d) -> add_table gram.enum d

  fs.writeFile model, (JSON.stringify table), (() -> warn "DONE TRAIN")

load = (path) ->
  table = require path
  warn "DONE LOAD"

make = () ->
  sen = []
  u = (true for i in [2 .. N])
  prod = 1
  threshold = 0.0000032
  threshold = 0.00000000032

  while true
    [v, pr] = choose table[u.join '']
    prod *= pr
    u = u .concat [v]
    u = u.slice (- N + 1)
    if not v or v is __EOS__.toString()
      break
    sen .push v

  sen = sen.join ''

  if prod < threshold
    do make
  else
    return sen

choose = (subt) ->
  total = 0
  for tar, count of subt
    total += count
  r = Math.random() * total
  for tar, count of subt
    r -= count
    if r < 0
      return [tar, count / total]

module.exports =
  make: make
  load: load
  train: train
  model_path: model_path
  train_path: train_path
