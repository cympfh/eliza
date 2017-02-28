{exec} = require 'child_process'

anime = (cont) ->
    command = 'annict calendar | head -n 8 | cut -f 2-5'
    exec command, (err, out) ->
        if err
            cont err
        else
            cont out

module.exports = (cont) -> anime(cont)

if process.argv[2] is 'test'
  anime console.log
