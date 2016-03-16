{exec} = require 'child_process'

lines = ['都営', 'メトロ']

add = (p, body) ->
  ls = body.split '\n'
  for i in [ 0 ... ls.length ]
    for k in [ 0 ... lines.length ]
      if ls[i] == lines[k]
        p[k] += 1

bing_test = (q, cont) ->
  p = lines.map(-> 0)
  exec "w3m -dump http://www.bing.com/search?q=#{q} | grep -o '都営\\|メトロ'", (err, body) ->
    add p, body
    mk = 0
    mp = p[0]
    console.log [lines, p]
    for k in [ 0 ... lines.length ]
      if mp < p[k]
        mp = p[k]
        mk = k
    ans = if mp == 0
      '知らない'
    else
      lines[mk]

    cont ans

if process.argv[2] is 'test'
  assert = (q, ans) ->
    check = (result) ->
      if ans isnt result
        console.warn "[NG] #{q} ans=#{ans} result=#{result} [!!]"
      else
        console.warn "[ok] #{q} (#{ans})"
    bing_test q, check, true

  assert '三田線', '都営'
  assert "大江戸線", '都営'
  assert "浅草線", '都営'
  assert "新宿線", '都営'
  
  assert "南北線", 'メトロ'
  assert "東西線", 'メトロ'
  assert "銀座線", 'メトロ'
  assert '副都心線', 'メトロ'
  assert '丸の内線', 'メトロ'
  assert '日比谷線', 'メトロ'
  assert '千代田線', 'メトロ'
  assert '有楽町線', 'メトロ'

exports.test = bing_test
