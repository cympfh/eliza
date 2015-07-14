tw = require './mytwitter'
dot = require './dot'
console.log dot

->
  succ = (fn) ->
    console.log "@@@@ #{fn}"
    tw.twit_with_media '@cympfh test', fn
  dot.compile "久美子 -> 麗奈 [label=❤️]", succ, (console.warn)

tw.twit_with_media '@cympfh test', "/tmp/421.png"
