{exec} = require 'child_process'

int = (x) ->
  if x is '-' then null else (x|0)

parse = (id, cont) ->
  url = "http://weather.goo.ne.jp/area/#{id}.html"

  result =
    today:
      max: -1
      min: -1
      rain: -1
    tomorrow:
      max: -1
      min: -1
      rain: -1

  exec "curl -s #{url} | grep 'class=red' | grep -o '>[0-9][0-9]*<' | head -2 | sed 's/[<>]//g'", (err, out) ->
    [a, b] = out.split('\n').map(int)
    result.today.max = a
    result.tomorrow.max = b

    exec "curl -s #{url} | grep 'class=blue' | grep -o '>[0-9][0-9]*<' | head -2 | sed 's/[<>]//g'", (err, out) ->
      [a, b] = out.split('\n').map(int)
      result.today.min = a
      result.tomorrow.min = b

      exec "curl -s #{url} | grep -A 12 'class=AreaTablein' | grep '<td>' | grep -v '[0-9]-[0-9]' | grep -o '[0-9-]*'", (err, out) ->
        [a,b,c,d,e,f,g,h] = out.split('\n').map(int)
        result.today.rain = [a,b,c,d]
        result.tomorrow.rain = [e,f,g,h]

        cont false, result

module.exports = parse
