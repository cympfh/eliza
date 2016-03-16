{exec} = require 'child_process'

bing_test = (line, cont) ->
  q = encodeURIComponent "都営 メトロ #{line}"
  com = "w3m -dump http://www.bing.com/search?q=#{q} | grep -o -P '[\\x{3005}\\x{3007}\\x{303B}\\x{3400}-\\x{4DBF}\\x{4E00}-\\x{9FFF}\\x{F900}-\\x{FAFF}\\x{20000}-\\x{2FFFF}]+#{line}' | sort | uniq -c | sort -nr | grep -v 案内 | grep -v 東京都 | grep -v 号線 | grep -v 運行情報 | grep -v 現在 | grep -v 概要 | awk '$0=$2'"
  exec com, (err, body) ->
    body = body.trim()
    body = '知らん' if body is ''
    cont body

if process.argv[2] is 'test'
  # bing_test '三田線', console.log # '都営'
  # bing_test "大江戸線", console.log # '都営'
  # bing_test "浅草線", console.log # '都営'
  # bing_test "新宿線", console.log # '都営'
  # bing_test "南北線", console.log # 'メトロ'
  # bing_test "東西線", console.log # 'メトロ'
  # bing_test "銀座線", console.log # 'メトロ'
  # bing_test '副都心線', console.log # 'メトロ'
  # bing_test '丸の内線', console.log # 'メトロ'
  # bing_test '日比谷線', console.log # 'メトロ'
  # bing_test '千代田線', console.log # 'メトロ'
  # bing_test '有楽町線', console.log # 'メトロ'
  bing_test '環状線', console.log
  # bing_test '福知山線', console.log

exports.test = bing_test
