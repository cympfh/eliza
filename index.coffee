version = '0.14.0'

child    = require "child_process"
fs       = require "fs"

util     = require './lib/util'
curl     = require './curl'
chat     = require './chat'
mail     = require './mail'
mail_alias = require './mail-alias'
translate = require './translate'
zapping  = require './zapping'
tenki    = require './tenki'
zoi      = require './zoi'
calendar = require  './calendar'
misdo    = require './misdo'
anime    = require "./anime"
runJ     = require './j'
twitpic  = require './twitpic'
kasitime = require './kasitime'
{shindan, tenkei} = require './shindan'
memoProc = require './memo'
happiness = require './happiness'
lmgtfy   = require './lmgtfy' # let me Google
lgtm     = require './lgtm' # look good to me
ej       = require './ej'
bio      = require './bio'
cood     = require './cood'
google   = require './google'
{twit, post_twitter, reply_to, fav_twitter} = require './mytwitter'

esc = String.fromCharCode 27

# --------

rand_fav = 0.0004


str_time = ->
  t = new Date()
  [t.getHours(), t.getMinutes(), t.getSeconds()].join(':')

begin_with = (text, pre) ->
  text.indexOf(pre) is 0

end_with = (text, tail) ->
  text.slice(- tail.length) is tail

min = (n) -> n * 60000

# ------ util for Twitter

test = (cont) ->
  console.log "# test"
  cont "eliza ver.#{version} (#{str_time()})"

suicide = ->
  console.log "Good bye, world"
  process.exit()

is_me = (name) ->
  name in ["ampeloss", "cympfh", "unddich"]

# -------- stream living?

last_time = (new Date()).getTime()
setInterval(->
  now = (new Date()).getTime()
  tmin = (now - last_time) / 1000 / 60

  if (tmin > 10)
    console.log 'ji-ketsu'
    do suicide
, (min 1))

# --------

colon = (text, name, status_id, cont) ->

  if begin_with text, ":kasitime"
    kasitime cont
    return

  if begin_with text, ":j "
    code = text.slice(3).split('\n')[0]
    fname = "/tmp/jcode"
    fs.writeFile fname, code, (err) ->
      if err
        console.warn err
      else
        runJ fname, (result) ->
          cont "\n#{result}"
    return

  if begin_with text, ":anime"
    anime (result) ->
      util.split result, (140 - 2 - name.length), (frag) ->
        cont frag
    return

  if begin_with text, ":misdo"
    misdo (msg) -> reply_to name, msg, status_id
    return

  if begin_with text, ":memo"
    memoProc text, name, status_id, reply_to
    return

  ###
  if (begin_with(text, ":bio ")) {
    name = text.split(' ')[1]
    name = name.trim()
    if (!name) {
      return
    }
    bio(name, cont)
    return
  }
  ###

  if begin_with text, ":tenkie"
    t = Math.pow(40 + (Math.random() * 1000), 2)
    setTimeout(->
      fav_twitter status_id
    , t)
    console.log "# : tenki + tenkei"
    tenkei cont
    tenki name, text.split(" ")[1], cont
    return

  if begin_with text, ":tenkei"
    tenkei cont
    return

  if begin_with text, ":tenki"
    tenki name, text.split(' ')[1], cont
    return

  if begin_with text, ":twitpic"
    twitpic cont
    return

  if begin_with text, ':?'
    `text = text.replace(/　/g, ' ')`
    w = text.slice(2).trim().replace(/\s/g, '+')
    console.warn "? google with #{w}"
    google w, (data) ->
      lines = data.split('\n').slice(0, -1)
                  .slice(0, 3)
                  .join('\n')

      console.warn "? results:\n#{lines}"
      cont lines
    return

  if begin_with text, ":kositu"
    lobby_id = 1000 + Math.floor(Math.random() * 7000)
    cont "http://tenhou.net/0/?L#{lobby_id}"
    return

  if begin_with text, ":zoi"
    zoi (url) ->
      msg = url + " #NEWGAME! " + (new Date())
      cont msg
    return

  if begin_with(text, ":neko") or begin_with(text, ":neco")
    number = 322469
    s_name = text.split(' ')[1] or name
    shindan number, name, s_name, cont
    return

  if begin_with(text, ":tateru")
    number = 196616
    s_name = text.split(' ')[1] or name
    shindan number, name, s_name, cont
    return

  if begin_with text, ":trans"
    translate text, (result) ->
      reply_to name, result, status_id
    return

  if begin_with(text, ":shindan ")
    number = parseInt text.split(" ")[1].trim(), 10
    s_name = text.split(' ')[1] or name
    shindan number, name, s_name, cont
    return

  if begin_with(text, ":test")
    return test cont

  if begin_with(text, ":hap") or begin_with(text, ":pre")
    happiness (num, time, tit, epi) ->
      cont "第#{num}話「#{tit}」#{time} #{epi}"
    return

  if begin_with(text, ":lmg ")
    q = text.split(' ').slice(1).join(' ')
    q = q.replace(/[\r\n]/g, '')
    q = q.replace(/[\']/g, '%09')
    lmgtfy q, cont

  if begin_with(text, ":lgtm")
    lgtm cont

  if begin_with(text, ":ej ")
    q = text.split(' ')[1]
    ej q, cont

  if begin_with(text, ":co ")
    cood text.slice(4), (lat, lng, loc) ->
      cont "#{lat}, #{lng} ##{loc}"
    return

  if begin_with(text, ":echo ")
    cont text.slice(6)
    return

  if begin_with(text, ":mail ")
    qs = text.split(' ')
    command = qs.slice(1).join(' ')
    if command[0] isnt ':'
      command = ':' + command
    colon command, name, status_id, (result) ->
      to = mail_alias name, "#{name}@gmail.com"
      mail to, command, result
      console.warn "# mail", command, to, result
      cont "mail \"#{result}\""

  if begin_with(text, ":cal")
    q = text.split(' ').slice(1).join('')
    q = q.replace /\&/g, ''
    q = q.replace /\;/g, ''
    q = q.replace /\|/g, ''
    calendar q, cont
    return

## setup
do ->
  twit.stream 'user', (stream) ->

    ###
    stream.on 'delete', (data) ->
      data.status.id_str
    ###

    stream.on 'disconnect', (data) ->
      console.log data.reason
      do suicide

    stream.on 'data', (data) ->

      if (not data) or (not data.user) or (not data.text)
        return

      last_time = (new Date()).getTime()

      user = data.user
      name = user.screen_name
      nick = user.name
      text = data.text
                .replace(/&lt;/g, "<")
                .replace(/&gt;/g, ">")
                .replace(/&amp;/g, "&")
                .replace(`/　/g`, ' ')
                .replace(/\s{2}/g, ' ')
                .trim()
      status_id = data.id_str
      source = data.source.slice(data.source.indexOf(">") + 1, data.source.length - 4)

      colored = """
#{esc}[34m@#{name} / #{nick}#{esc}[m ; #{esc}[33mvia #{source}#{esc}[m ; #{str_time()}
#{text}
"""

      console.log colored

      if (not is_me(name)) and (rand_fav > Math.random())
        m = 40 + (Math.random() * 1000)
        t = m * m
        setTimeout (-> fav_twitter status_id), t

      if text[0] is ':'
        colon text, name, status_id, (result) ->
          reply_to name, result, status_id
        return

      if end_with text, "[検索]"
          w = text.slice(0, -4).trim()
          google w, (data) ->
            lines = data.split('\n').slice(0, -1)
                        .slice(0, 3)
                        .join('\n')

            console.warn "# google-search's results:\n#{lines}"
            reply_to name, lines, status_id
          return

      if text.indexOf('#memo') isnt -1
        text = text.replace(/#memo/g, '')
        text = text.trim()
        text = ':memo add ' + text
        console.warn "transfer to #{text}"
        return colon text, name, status_id, (result) ->
          reply_to name, result, status_id

      if begin_with text, ":zoi"
        zoi (url) ->
          msg = url + " #NEWGAME! " + (new Date())
          reply_to name, msg, status_id
          return

      if (text.indexOf("天気教え") isnt -1) or (text.indexOf("洗濯物占") isnt -1)
        m = 40 + (Math.random() * 1000)
        t = m * m
        setTimeout (-> fav_twitter status_id), t
        tenki name, undefined, (result) ->
          reply_to name, result, status_id
        return

      if /tenkei|TENKEI|тенкей|テンケイ|てんけい|天啓|天恵|添景|点景|天刑|天渓/.test(text)
        m = 40 + (Math.random() * 1000)
        t = m * m
        setTimeout (-> fav_twitter status_id), t
        tenkei (res) -> reply_to name, res, status_id
        return

      if text.indexOf("オハヨウゴザイマース") isnt -1
        m = 40 + (Math.random() * 1000)
        t = m * m
        setTimeout (-> fav_twitter status_id), t
        reply_to(name, "┗(⌒)(╬*☻-☻*╬)(⌒)┛＜ゲットアウト！（出ていけ！）", status_id)
        return

      if text.indexOf("田端") isnt -1
        m = 40 + (Math.random() * 1000)
        t = m * m
        setTimeout (-> fav_twitter status_id), t
        setTimeout (-> post_twitter "田端でバタバタ"), 1500
        return

      if (data.user.protected is false) and (Math.random() < 0.03)
        chat.push text, name

      if Math.random() < 0.006
        chat.mutter post_twitter

      if (name isnt "ampeloss") and util.is_reply(text)
        console.warn "# this is a reply to me:", text
        setTimeout ->
          chat.reply text, (msg) ->
            reply_to name, msg, status_id
        , 1000 + Math.random() * 10000 | 0

    stream.on 'end', ->
      console.log "### stream end"
      do suicide

    stream.on 'destroy', ->
      console.log "### stream destroy"
      do suicide

    stream.on "close", ->
      console.log "### stream close"
      do suicide

    stream.on "error", ->
      console.log "### emitted an error", e
      do suicide

  console.log("### stream start")


unddich_life = ->

  console.warn "fuck your LIFE"

  anime (result) ->
    util.split result, 130, (f) ->
      post_twitter "@unddich #{f}"

  tenki "cympfh", "tokyo", (result) ->
    post_twitter "@unddich #{result} #{str_time()}"

  setTimeout unddich_life, (min 8*60)

do unddich_life
