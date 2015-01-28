{exec} = require 'child_process'

between = (a, b, ls) ->
  ret = []
  bl = false
  for line in ls
    if line.indexOf(a) != -1 then bl = true
    else if bl and line.indexOf(b) != -1 then return ret
    else if bl then ret.push(line)
  ret

mytrim = (str) ->
  str = str.replace(/\s/g, '')
  str = str.replace(/<[^>]+>/g, '')
  str

prec = (cont) ->
  url = 'http://asahi.co.jp/precure/princess/story/'
  exec "curl -s #{url}", (err, out) ->
    return cont err if err
    ls = out.trim().split('\n')
    title = mytrim between('class="story-tit">', '/.story-tit', ls).join('')
    body = mytrim between('予告本文', '</p>', ls).join('')
    cont false, [title, body]

module.exports = prec
