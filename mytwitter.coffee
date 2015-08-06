fs = require 'fs'
{exec} = require 'child_process'
Twitter  = require "ntwitter"
me = require('../setting.json').users.ampeloss
twit = new Twitter(me)

barrier = do ->
  stack = []

  clear = ->
    d = (new Date()).getTime()
    for i in [0 ... stack.length]
      if d - stack[i] < 60 * 60 * 1000
        break
    stack = stack.slice(i)

  # return true if over 50 tw/hour
  # otherwise push and return false
  return ->
    return false if stack.length < 50
    do clear
    return true if stack.length > 50

    stack.push d.getTime()
    false

post_twitter = (msg) ->
  return if (msg is undefined) or (msg is "") or (msg is " ") or (msg is "\n")
  return if (barrier())

  msg = msg.slice 0, 140
  twit.post "https://api.twitter.com/1.1/statuses/update.json", {status: msg}, (err, data) ->
    console.log('PostTwitter', err) if err
    console.log("# post_twitter ", msg)

reply_to = (name, msg, id, option) ->
  return if msg is ""
  return if barrier()
  if (name is undefined) or (name is "")
    post_twitter msg
    return

  console.log "# reply_to", name, msg, id

  msg = "@#{name} #{msg}"
  msg0 = false
  msg1 = false

  if msg.length <= 140
    msg0 = msg
    msg1 = null
  else if option is "cut"
    msg0 = msg.slice(0, 140)
    msg1 = null
  else
    idx = msg.slice(0,140).lastIndexOf("\n")
    idx = 140 if idx < 0
    msg0 = msg.slice(0, idx)
    msg1 = msg.slice(idx+1)

  url = "https://api.twitter.com/1.1/statuses/update.json"
  twit.post url, {status : msg0, in_reply_to_status_id : id} , (_, data) ->
    reply_to(name, msg1, id) if msg1

fav_twitter = (id) ->
  url = "https://api.twitter.com/1.1/favorites/create.json"
  twit.post url, {"id": id}, (->)

twit_with_media = (fn, status, status_id) ->
  url = 'https://upload.twitter.com/1.1/media/upload.json'
  media_data = false
  exec "base64 #{fn} | tr -d '\n'", (err, out) ->
    throw err if err
    media_data = out
    console.log "twit with media #{status} with #{fn}"
    twit.post url, {media_data: media_data}, (err, data) ->
      throw err if err
      console.warn '%j', data
      datum =
        status: status
        media_ids: data.media_id_string
      if status_id
        datum.in_reply_to_status_id = status_id
      twit.post 'https://api.twitter.com/1.1/statuses/update.json', datum, (->)

destroy_twit = (id, cont) ->
  url = "https://api.twitter.com/1.1/statuses/destroy/#{id}.json"
  if (not cont)
    cont = (->)
  twit.post url, {id: id}, cont

module.exports =
  twit: twit
  post_twitter: post_twitter
  reply_to: reply_to
  fav_twitter: fav_twitter
  twit_with_media: twit_with_media
  destroy_twit: destroy_twit
