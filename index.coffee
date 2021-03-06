version = '0.15.0 (updated 2016.03.16)'

child    = require "child_process"
fs       = require "fs"

util      = require './lib/util'
curl      = require './curl'
chat      = require './chat'
translate = require './translate'
zapping   = require './zapping'
tenki     = require './tenki'
zoi       = require './zoi'
voice     = require  './voice'
calendar  = require  './calendar'
misdo     = require './misdo'
anime     = require './anime'
twitpic   = require './twitpic'
kasitime  = require './kasitime'
lmgtfy    = require './lmgtfy' # let me Google
lgtm      = require './lgtm' # look good to me
bio       = require './bio'
cood      = require './cood'
dice      = require './dice'
youtube   = require './youtube'
dot       = require './dot'
metro     = require './metro'
precure   = require './precure'
{shindan, tenkei} = require './shindan'
{twit, post_twitter, reply_to, twit_with_media, destroy_twit, fav_twitter} = require './mytwitter'

esc = String.fromCharCode 27

# --------

str_time = ->
    t = new Date()
    [t.getHours(), t.getMinutes(), t.getSeconds()].join(':')

begin_with = (text, pre) ->
    text.indexOf(pre) is 0

end_with = (text, tail) ->
    text.slice(- tail.length) is tail

min = (n) -> n * 60000
hour = (n) -> 60 * min n

# ------ util for Twitter

test = (cont) ->
    console.log "# test"
    cont "eliza ver.#{version} (#{str_time()})"

suicide = ->
    console.log "Good bye, world"
    process.exit()

is_me = (name) ->
    name in ['ampeloss', 'cympfh', 'unddich', 'acympfh']

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

    if begin_with text, ":dot"
        code = text.slice(4)
        succ = (fn) ->
            twit_with_media fn, "@#{name}", status_id
        fail = (err) ->
            reply_to name, err.toString(), status_id
        dot.compile code, succ, fail

    if begin_with text, ":anime"
        anime (result) ->
            util.split result, (140 - 10 - name.length), (frag) ->
                cont frag
        return

    if begin_with text, ":misdo"
        misdo (msg) -> reply_to name, msg, status_id
        return

    if begin_with text, ':eval'
        if is_me(name)
            try
                result = eval(text.slice(6))
                cont result
            catch e
                cont e.toString().slice(0, 100)
        return

    if begin_with text, ":tenkie"
        t = Math.pow(40 + (Math.random() * 1000), 2)
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

    if begin_with text, ":kositu"
        lobby_id = 1000 + Math.floor(Math.random() * 7000)
        cont "http://tenhou.net/0/?L#{lobby_id}"
        return

    if begin_with text, ":zoi"
        zoi (url) ->
            msg = url + " #NEWGAME! " + (new Date())
            cont msg
        return

    if begin_with text, ":trans"
        translate text, (result) ->
            reply_to name, result, status_id
        return

    if begin_with text, ":ej "
        translate (text.replace('ej', 'trans en ja')), (result) ->
            reply_to name, result, status_id
        return

    if begin_with(text, ":shindan ")
        number = parseInt text.split(" ")[1].trim(), 10
        s_name = text.split(' ')[2] or name
        shindan number, s_name, cont
        return

    if begin_with(text, ":test")
        return test cont

    if begin_with(text, ':prec')
        precure (result) ->
            msg = "http://www.asahi.co.jp/precure/maho/story/\n#{result}"
            msg = msg.slice(0, 127)
            cont msg

    if begin_with(text, ':y2u ')
        q = text.split(' ').slice(1).join('%20')
        youtube q, cont

    if begin_with(text, ":lmg ")
        q = text.split(' ').slice(1).join(' ')
        q = q.replace(/[\r\n]/g, '')
        q = q.replace(/[\']/g, '%09')
        lmgtfy q, cont

    if begin_with(text, ":lgtm")
        lgtm cont

    if begin_with(text, ":co ")
        cood text.slice(4), (lat, lng, loc) ->
            cont "#{lat}, #{lng} ##{loc}"
        return

    if begin_with(text, ':dice')
        xs = text.split ' '
        n = 1
        if xs[1]
            n = parseInt(xs[1], 10)
            n = 1 if isNaN n
        me = (dice n).join ' '
        cont "#{me} (#{(new Date()).toString()})"
        return

    if begin_with(text, ":echo ")
        cont text.slice(6)
        return

    if begin_with text, ":voice"
        # bash injection!
        text = text.replace /\&/g, ''
        text = text.replace /\;/g, ''
        text = text.replace /\|/g, ''
        q = text.split(' ').slice(1).join('')
        voice q, cont
        return

    if begin_with text, ':cal'
        # bash injection!
        text = text.replace /\&/g, ''
        text = text.replace /\;/g, ''
        text = text.replace /\|/g, ''
        args = text.split(' ').slice(1)
        calendar args, cont
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

            return if name is 'ampeloss'

            if text[0] is ':'
                colon text, name, status_id, (result) ->
                    reply_to name, result, status_id
                return

            if (text.indexOf("おっけー") is 0) and (text.indexOf("天気") > 0)
                tenki name, undefined, (result) ->
                      reply_to name, result, status_id
                return

            if (text.indexOf('洗濯') >= 0) and (text.indexOf('占い') >= 0)
                tenki name, undefined, (result) ->
                    reply_to name, result, status_id
                return

            if (text.indexOf("おっけー") is 0) and (text.indexOf("アニメ") > 0)
                anime (result) ->
                    util.split result, (140 - 10 - name.length), (frag) ->
                    reply_to name, frag, status_id
                return

            if (text.indexOf('人間') isnt -1) and (text.length <= 4) and (name isnt 'himono_i')
                if Math.random() < 0.8
                    post_twitter text.replace(/人間/g, 'ゆゆ式')
                else
                    post_twitter text.replace(/人間/g, 'あいうら')

            if text.length <= 10
                last_char = text[text.length - 1]
                if last_char == '線' or last_char == '駅'
                    metro text, (line) ->
                        reply_to name, line, status_id

            if (/tenkei/.test text) or (/天啓/.test text)
                m = 40 + (Math.random() * 1000)
                t = m * m
                tenkei (res) -> reply_to name, res, status_id
                return

            if (data.user.protected is false) and (Math.random() < 0.03)
                chat.push text, name

            if Math.random() < 0.006
                chat.mutter post_twitter

            if Math.random() < 0.006
                setTimeout ->
                    fav_twitter status_id
                , 1000 + Math.random() * 10000 | 0

            if util.is_reply(text)
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

        stream.on "error", (e) ->
            console.log "### emitted an error", e
            do suicide

      console.log("### stream start")
