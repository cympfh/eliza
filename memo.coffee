fs   = require 'fs'
fn   = process.env.PWD + '/memo.json';
memo = require fn

String::begin_with = (prefix) -> (this.indexOf prefix) is 0

addm = ':memo add '
addn = ':memoa '
addl = ':memo list'
addr = ':memo rm '
addc = ':memo clear'
adds = ':memo restore'
help_message = 'usage;\n:memo add [memo]\n:memo list\n:memo rm [id]\nmore detail: http://is.gd/y980Vv'


update = ->
  fs.writeFile fn, JSON.stringify(memo), (err) ->
    if err
      console.warn err

module.exports = (text, name, status_id, reply) ->

  text = text.split(/[\r\n]/)[0]

  memo_clear = ->
    bkname = 'bk+' + name
    memo[bkname] = memo[name]
    memo[name] = []
    reply name, 'cleard (hint; :memo restore)'
    do update

  memo_restore = ->
    bkname = 'bk+' + name
    if memo[bkname]?
      memo[name] = memo[bkname]
    do memo_list
    do update

  memo_add = (t) ->
    if not memo[name]?
      memo[name] = []
    memo[name] .push t
    do memo_list
    do update

  memo_list = ->
    hash =
      parseInt ("#{Math.random()}".slice 5), 10
        .toString 16
    hash = "\n(#{hash})"
    if not memo[name]?
      reply name, "Nothing#{hash}", status_id
      return

    len = memo[name].length
    msg = for i in [0 ... len]
      item = memo[name][i]
      continue if not item
      "[#{i}] #{item}"

    if msg.length is 0
      reply name, "Nothing#{hash}", status_id
      return

    reply name, "\n#{msg.join '\n'}#{hash}", status_id

  memo_remove = (idxs) ->
    if not memo[name]?
      reply name, 'not found your item', status_id
      return

    idxs =
      idxs.map (x) -> parseInt x, 10
        .filter (x) -> not isNaN x

    msg = 'deleted '
    for idx in idxs
      memo[name][idx] = false

    do memo_list
    do update

  switch
    when text.begin_with addm
      memo_add text.slice addm.length
    when text.begin_with addn
      memo_add text.slice addn.length
    when text.begin_with addl
      do memo_list
    when text.begin_with addr
      memo_remove text.split(/[\s,]/g).slice(2)
    when text.begin_with addc
      do memo_clear
    when text.begin_with adds
      do memo_restore
    else
      reply name, help_message, status_id

