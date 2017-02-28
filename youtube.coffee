{exec} = require 'child_process'

youtube = (query, cont) ->
    command = "w3m  -dump_source 'https://www.youtube.com/results?search_query=#{query}' |gunzip -d| grep '/watch?'"
    console.warn command
    exec command, (er, out) ->
        throw er if er
        re = /^.*href=\"\/watch\?v=([^\"]*)\".* title=\"([^\"])*\"/
        ls = out.trim()
            .split '\n'
            .map (line) ->
                if re.test line
                    rs = line.match re
                    rs[1]
                else
                    false
            .filter (x) -> not not x
        ac = ''
        ls.forEach (v) ->
            url = " http://y2u.be/#{v}"
            if (ac + url).length > 130
                return
            ac += url
        cont ac.trim()

module.exports = youtube

if process.argv[2] is 'test'
    youtube 'hoge', console.log
