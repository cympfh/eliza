fs = require 'fs'
runJ = require './j'
princess = require './princess_precure.coffee' # precure

do ->
  cont = console.log

  princess (err, datum) ->
    if err
      cont err
      return
    title = '#' + datum[0]
    body = datum[1]
    msg = "#{title} / #{body}"
    msg = msg.slice(0, 120)
    cont msg


