{exec} = require 'child_process'

zero = (x) ->
  ('00'.slice x.length) + x

main = (arg, cont) ->
  console.warn 'voice: ', arg
  switch
    when (arg is 'help') or (arg is '-h') or (arg is '--help')
      cont 'Usage\n  :voice\n  :voice 1210 # 10th December\n  :voice <name>'
    when (arg is null) or arg is ''
      exec "calendar -f ./voice/voice.calendar", (er,ou) ->
        cont ou
    when /^\d+\/\d+$/.test arg
      xs = arg.split '/'
      arg = (zero xs[0]) + (zero xs[1])
      main arg, cont
    when /^\d{4}$/.test arg
      exec "calendar -f ./voice/voice.calendar -t #{arg}", (er,ou) ->
        cont ou
    else
      exec "grep '#{arg}' ./voice/voice.calendar", (er, ou) ->
        cont ou

module.exports = main
