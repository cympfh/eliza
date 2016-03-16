{exec} = require 'child_process'

int = (x) ->
  if x is '-' then null else (x|0)

parse = (id, cont) ->
  url = "http://weather.goo.ne.jp/area/#{id}.html"
  console.warn url

  result =
    today:
      max: -1
      min: -1
      rain: -1
    tomorrow:
      max: -1
      min: -1
      rain: -1

  # 気温
  exec "curl -s #{url} | grep ℃ | head -2 | grep -o '>[0-9]*℃' | grep -o '[0-9]*'", (err, out) ->
    [a,b,c,d] = out.split('\n').map(int)
    result.today.max    = a
    result.today.min    = b
    result.tomorrow.max = c
    result.tomorrow.min = d

    # 降水確率
    exec "curl -s #{url} | grep -A 4 'td>降水' | grep -o '[-0-9]*' | sed '/--/d'", (err, out) ->
      [a,b,c,d,e,f,g,h] = out.split('\n').map(int)
      result.today.rain = [a,b,c,d]
      result.tomorrow.rain = [e,f,g,h]

      cont false, result

module.exports = parse
