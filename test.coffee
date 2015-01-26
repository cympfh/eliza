fs = require 'fs'
runJ = require './j'

fname = "/tmp/jcode"

code = 'i. 10'

fs.writeFile fname, code, (err) ->
  if err
    console.warn err
  else
    runJ fname, (result) ->
      console.log "#{result}"
