#!/usr/bin/env coffee

fs = require 'fs'
text = fs.readFileSync(process.argv[2], 'utf-8').trim().split('\n')

dict = {}

for line in text
  a = [true, true, true, true]
  for c in line.split('')
    if not dict[a]
      dict[a] = {}
    if not dict[a][c]
      dict[a][c] = 1
    else
      dict[a][c] += 1
    a.push c
    a = a[-4 .. ]

  if not dict[a]
    dict[a] = {}
  if not dict[a][false]
    dict[a][false] = 1
  else
    dict[a][false] += 1

console.log JSON.stringify dict

