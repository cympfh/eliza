{exec} = require 'child_process'

anime = (cont) ->
    command = 'animetick'
    exec command, (err, out) ->
        if err
            cont err
        else
            cont out

module.exports = (cont) -> anime(cont)

if process.argv[2] is 'test'
  anime console.log
