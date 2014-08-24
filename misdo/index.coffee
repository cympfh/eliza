{exec} = require 'child_process'

misdo = (cont) ->

  findNow = (ls) ->
    sub = (i) -> if ls[i].now is 'true' then i else sub i + 1
    sub 0

  url = 'http://sp.i-misdo.com/music/find.cgi?callback=displayCurrentlyMusic_Comments&mode=nowplaying'

  exec "curl '#{url}' |nkf", (er, ou) ->
    idx = ou.indexOf '{'
    jdx = ou.lastIndexOf '}'
    str = ou.slice idx, jdx + 1
    ls = (JSON.parse str).list
    i = findNow ls
    the = ls[i]
    cont "#{the.artist}: #{the.title} from #{the.time}"

module.exports = misdo
