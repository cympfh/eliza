{exec} = require 'child_process'
fs = require 'fs'

tmphtml = '/tmp/alist.html'
tmp = '/tmp/alist'
url = 'http://www.posite-c.com/anime/day/'


cache = (cont) ->
  tokyo = (x) ->
    return false if x.indexOf('BS-') isnt -1
    ls = [ "TOKYO MX", "テレビ東京", "TBS", 'tvk', "フジテレビ", "日本テレビ", "テレビ朝日", "ニコニコ"]
    ls.some((l) -> return x.indexOf(l) isnt -1)

  kyoku_alias = (name) ->
    aliases = {
        "TOKYO MX": "MX"
      , "テレビ東京": "テレ東"
      , "日本テレビ": "日テレ"
      , "ニコニコアニメスペシャル": "nico"
    }
    if (aliases.hasOwnProperty(name)) then aliases[name] else name

  parse = (tmphtml) ->
    fs.readFile tmphtml, 'utf8', (err, ls) ->
      ls = ls.split '\n'
      ls = ls.filter (x) -> !!x
      msg = ''
      ls.forEach (l) ->
        l = l.split(';')
        t0 = l[0]
        kyoku = l[2]
        title = l[3]

        at = parseInt(t0, 10)
        if ((5 <= at and at < 19) or not tokyo(kyoku))
          return

        msg +=
          "\nt0 kyoku title"
            .replace("t0", t0)
            .replace("kyoku", kyoku_alias(kyoku))
            .replace("title", title.slice(0,20))

      fs.writeFileSync(tmp, msg)
      cont msg

  split = (ls, name) ->
    ret = []
    idx = false
    idx2 = false
    mark = false
    loop
      idx = ls.indexOf "<#{name}"
      break if idx is -1
      mark = "</#{name}"
      idx2 = ls.indexOf mark, idx
      break if idx2 is -1
      ret.push ls.slice idx, idx2 + mark.length
      ls = ls.slice idx2 + mark.length
    ret

  first = (x) ->
    x = x.slice 0, x.indexOf('</')
    x = x.slice x.lastIndexOf('>') + 1
    x

  command = "curl #{url} |grep \"<table id=\\\"today\\\"\" > /tmp/ls"
  exec command, (err) ->
    throw err if err
    fs.readFile '/tmp/ls', 'utf8', (err, ls) ->

      tables = split(ls, "table")
      infos  = split(tables[4], "tr").map((x) -> split(x,'td').map(first))
      titles = split(tables[5], "tr").map(first)
      hoge = ''

      infos.forEach (info, i) ->
        time = false
        kyoku = false
        title = titles[i]

        title = title.replace(/&lt;/g, '<')
        title = title.replace(/&gt;/g, '>')
        title = title.replace(/&amp;/g, '&')

        if (info.length < 3 or info[0].indexOf(' - ') < 0)
          return

        time = info[0].split(' - ')
        kyoku = info[2]

        if (!time[0] || !time[1] || !title)
          return

        hoge += [time[0], time[1], kyoku, title].join(';') + '\n'

      fs.writeFile tmphtml, hoge, ->
        parse tmphtml

anime_cache_loop = ->
  now = new Date()
  hr = now.getHours()
  if hr < 12
    console.warn "* making new anime cache"
    fs.unlinkSync tmp
    fs.unlinkSync tmphtml
    cache (->)

#setInterval anime_cache_loop, 30*60*1000

anime = (cont) ->
  fs.readFile tmp, (err, buf) ->
    console.warn err if err
    if err
      cache cont
    else
      cont (buf.toString())

module.exports = (cont) -> anime(cont)

if process.argv[2] is 'test'
  anime console.log
