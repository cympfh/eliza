database = require './database.json'
parse    = require './parse'
gu       = require '../lib/gu.js'
address  = require './address.json'
aliases  = require './aliases.json'
pprint   = require './pprint.js'

tenki = (name, loc, cont) ->
  i = false
  loc_name = false

  loc = address[name] if address[name] and not loc
  loc = '東京' if not loc
  loc = aliases[loc] if aliases[loc]

  ok = false
  for i in [0 ... database.length]
    loc_name = database[i].name
    if loc_name.indexOf(loc) isnt -1
      ok = true
      parse database[i].id, (err, result) ->
        if err
          cont err
        else
          result = pprint result
          cont "#{loc}\n#{result}"

    break if ok

  if not ok
    cont 'Not found the location'

if process.argv[2] is 'test'
  tenki 'cympfh', 'tokyo', console.warn
  tenki 'cympfh', '神戸', console.warn

module.exports = tenki
