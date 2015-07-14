fs = require 'fs'
{exec} = require 'child_process'

graph_of = (src) ->
  n = (src.split '--').length
  m = (src.split '->').length
  if n > m
    'graph'
  else
    'digraph'

compile = (src, succ, fail) ->
  console.warn "dot.coffee: compile"
  fn = "/tmp/#{(Math.random()*1000)|0}.dot"
  png = "/tmp/#{(Math.random()*1000)|0}.png"
  console.warn "temporary source file: #{fn}"
  console.warn "temporary image file: #{png}"
  fs.writeFileSync fn, "#{graph_of src} {\n#{src}\n}"
  console.warn "saved."
  exec "dot -Tpng #{fn} > #{png}", (err, out) ->
    if err
      fail err
    else
      succ png

module.exports =
  compile: compile
