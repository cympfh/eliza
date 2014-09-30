a = require './ngram'
a.train a.train_path, a.model_path
console.log a.make() for i in [1 .. 100]
