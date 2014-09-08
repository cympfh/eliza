{exec} = require 'child_process'

zero = (x) ->
  ('00'.slice x.length) + x

main = (arg, cont) ->
  switch
    when (arg is null) or arg is ''
      exec "calendar -f ./calendar/voice.calendar", (er,ou) ->
        cont ou

    when /^\d+\/\d+$/.test arg
      xs = arg.split '/'
      arg = (zero xs[0]) + (zero xs[1])
      main arg, cont
    when /^\d{4}$/.test arg
      exec "calendar -f ./calendar/voice.calendar -t #{arg}", (er,ou) ->
        cont ou
    else
      exec "grep '#{arg}' ./calendar/voice.calendar", (er, ou) ->
        cont ou

module.exports = main
