{exec} = require 'child_process'

toUnicode = (str) ->
  str.split ''
    .map (char) -> ("0000" + char.charCodeAt().toString(16)).slice(-4)
    .map (n) -> "\\u" + n
    .join ''

shindan = (number, s_name, cont) ->
  u_name = toUnicode(s_name)
  url = "http://shindanmaker.com/#{number}"
  console.log "shindan", number, s_name, u_name

  command = "bash ./shindan/send.sh #{number} #{u_name.replace(/\\/g, "\\\\")}"
  exec command, (err, out) ->
    throw err if err
    out = out.replace u_name, s_name
    out = out.replace u_name, s_name
    cont out

tenkei = (cont) ->
  num = 241197
  if Math.random() < 0.2
    cand = [274009, 232175, 267069, 194821]
    idx  = Math.floor(Math.random() * cand.length)
    num  = cand[idx]
  namegen = "1982347２９３８４７せのぽぬめ粉塵火山日本国民は国民の選出するうんたらによってうんたらする義務を負うとともに戦禍を"
  name = ''
  len = 6 + Math.floor(Math.random()*12)
  for i in [0 ... len]
    name += namegen[Math.floor(Math.random()*namegen.length)]
  console.log "# tenkei by #{num} with name:#{name}"
  shindan num, name, (out) ->
    out = out.trim().split('\n')
      .filter (line) -> line[0] isnt '#'
      .filter (line) -> line[0..3] isnt 'http'
      .join '\n'
    cont out

if process.argv[2] is 'test'
  shindan 80808, 'イライザ', console.log
  tenkei console.log

exports.tenkei = tenkei
exports.shindan = shindan
