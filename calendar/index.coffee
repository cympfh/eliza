{exec} = require 'child_process'

main = (args, cont) ->
  switch
    when (args[0] is 'help') or (args[0] is '-h') or (args[0] is '--help')
      cont 'Usage\n  :cal args -> calendar -f main.calendar args\n  :cal grep q -> grep q main.calendar'
    when (args[0] is 'grep')
      exec "grep '#{args[1]}' ./calendar/main.calendar", (er, ou) ->
        cont ou
    else
      exec "calendar -A 0 -f ./calendar/main.calendar #{args.join ' '}", (er,ou) ->
        cont ou

if process.argv[2] is 'test'
  main [''], console.log

module.exports = main
