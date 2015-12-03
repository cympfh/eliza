{exec} = require 'child_process'

google = (q, cont) ->
  exec "w3m -dump www.google.co.jp/search?q=#{q} | grep 約 | grep 件 | sed 's/,//g' | grep -o '[0-9]*'", (err, out) ->
    throw err if err
    cont out.trim()

bing = (q, cont) ->
  exec "w3m -dump http://www.bing.com/search?q=#{q}wikipedia | grep 件の検索結果 | sed 's/,//g' | grep -o '[0-9]*' | head -1", (err, out) ->
    throw err if err
    cont out.trim()

lines = ['都営', 'メトロ']

test = (q, cont) ->
  n = lines.length
  res = []
  lines.forEach (line, i) ->
    res[i] = -1
    bing (line+q), (m) ->
      res[i] = m | 0
      if res.every((x) -> x > -1)
        mx = res[0]
        idx = 0
        for j in [0 ... n]
          if (mx < res[j])
            mx = res[j]
            idx = j
        cont lines[idx]

# predict "三田線", console.log
# predict "大江戸線", console.log
# predict "南北線", console.log
# predict "東西線", console.log
# predict "浅草線", console.log
# predict "銀座線", console.log

exports.test = test
