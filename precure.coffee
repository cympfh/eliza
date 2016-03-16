{execSync} = require 'child_process'

shuf = (str) ->
  chars = str.split ''
  n = chars.length
  for i in [0..n-1]
    j = Math.random() * n | 0
    if Math.random() < .1 and (j < i)
      t = chars[i]
      chars[i] = chars[j]
      chars[j] = t
  chars.join ''

precure = (cont) ->
  com = "curl -s http://www.asahi.co.jp/precure/maho/ | grep -A 10 tit-story | sed 's/<[^>]*>//g' | tr -d ' \t'|sed '/^$/d'"
  res = execSync com, {encoding: 'utf-8'}
  lines = res.split '\n'
  cont "#{lines[0]}\n#{shuf(lines[1])}#{shuf(lines[2])}"

module.exports = precure
