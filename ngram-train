#!/bin/bash

coffee -c ngram.coffee

coffee << EOM
a = require './ngram'
a.train a.train_path, a.model_path
console.log (a.make() for i in [1 .. 100]).join '\n'
EOM
