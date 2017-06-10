{exec} = require 'child_process'

anime = (cont) ->
    command = 'animetick| sed "s,^[0-9]*/,,g"| ruby -ne "puts \\$_[0..31]"'
    exec command, (err, out) ->
        if err
            cont err
        else
            cont out

module.exports = (cont) -> anime(cont)

if process.argv[2] is 'test'
  anime console.log
