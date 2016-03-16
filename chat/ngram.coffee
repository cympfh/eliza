{execSync} = require 'child_process'

gen = ->
  res = execSync("ruby #{__dirname}/ngram/main.rb #{__dirname}/ngram/cympfh #{__dirname}/ngram/yukari")
  res = res.toString()
  res

module.exports =
  gen: gen
