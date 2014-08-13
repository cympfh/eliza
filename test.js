a = require('./ngram')
//a.load(a.model_path)
a.train(a.train_path, a.model_path)
for (i=0;i<100;++i) console.log(a.make())
