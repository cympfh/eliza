curl = require './curl'

shindan = (number, name, s_name, cont) ->
  s_name = s_name || name

  url = "http://shindanmaker.com/#{number}"
  console.log "shindan", name, s_name

  curl "#{url}?u=#{s_name}", 'POST', (html) ->
      if html.indexOf("リクエストされたURLに該当するページがあ") > 0
        ReplytoTwitter name, "bad request", status_id
        return
      idx = html.indexOf(">"
                        , html.indexOf("textarea"
                               , html.indexOf("コピペ用診断結果")))
      html = html[idx+1 ... html.indexOf("</textarea>", idx)]
      html = html.replace url, ''
      html = html.replace /#[^\s]*/g, ''
      html = html.split '\n'
        .filter (l) -> not not l
        .join '\n'
      cont html

tenkei = (cont) ->
  num = 241197
  if Math.random() < 0.08
    cand = [274009, 232175, 267069, 194821]
    idx  = Math.floor(Math.random() * cand.length)
    num  = cand[idx]
  unamegen = "1982347２９３８４７せのぽぬめ粉塵火山日本国民は国民の選出するうんたらによってうんたらする義務を負うとともに戦禍を"
  uname = ''
  len = 6 + Math.floor(Math.random()*12)
  for i in [0 ... len]
    uname += unamegen[Math.floor(Math.random()*unamegen.length)]

  console.log "# tenkei with #{uname}"
  shindan num, uname, uname, cont

exports.tenkei = tenkei
exports.shindan = shindan
