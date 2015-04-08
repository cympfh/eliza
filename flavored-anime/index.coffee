https   = require 'https'
cheerio = require 'cheerio'

day = do ->
  today = new Date()
  h = today.getHours()
  d = today.getDay()
  d = (d + 6) % 7 if h < 6
  [
    'Sun'
    'Mon'
    'Tue'
    'Wed'
    'Thu'
    'Fri'
    'Sat'
  ][d]

textof = (dom) ->
  if dom.type is 'text'
    dom.data.trim()
  else if dom.children?
    (dom.children.map textof) .join ''
  else
    ''

listof = (dom) ->
  dom.children.map textof
    .filter (x) -> not not x

url = 'https://github.com/cympfh/cympfh/wiki/anime::2015::S1'

module.exports = (cont) ->
  https.get url, (res) ->
    data = ''
    res.on 'data', (buf) ->
      data += buf
    res.on 'end', ->
      $ = cheerio.load data
      captions = $('h2')
      lists = $('ul')
      for i in [0 ... captions.length]
        if day is (textof captions[i])
          cont (listof lists[i + 5])
          return
      cont false

module.exports console.log
