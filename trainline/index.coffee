{exec} = require 'child_process'

bing = (q, cont) ->
  exec "w3m -dump http://www.bing.com/search?q=#{q}wikipedia | grep -o #{q} | wc -l", (err, n) ->
    cont (n |0)

lines = ['都営', 'メトロ']
queries = ['都営地下鉄', '東京メトロ']

test = (q, cont, debug=false) ->
  n = lines.length
  res = []
  lines.forEach (line, i) ->
    res[i] = -1
    bing (queries[i] + q), (m) ->
      res[i] = m
      if res.every((x) -> x > -1)
        mx = res[0]
        idx = 0
        for j in [0 ... n]
          if (mx < res[j])
            mx = res[j]
            idx = j
        if debug
          console.warn q, res
        cont lines[idx]

if process.argv[2] is 'test'
  test "三田線", console.log, true
  test "大江戸線", console.log, true
  test "南北線", console.log, true
  test "東西線", console.log, true
  test "浅草線", console.log, true
  test "銀座線", console.log, true

exports.test = test
