fs = require 'fs'
youtube = require './youtube'

begin_with = (text, pre) ->
  text.indexOf(pre) is 0

do ->
  text = ':y2u ささみさん'
  cont = console.log
  if begin_with(text, ':y2u ')
    q = text.split(' ').slice(1).join('%20')
    youtube q, cont

