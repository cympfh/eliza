do:
	cat yukari*.txt | grep -v '^#' | grep -v '^$$' > /tmp/mutter.txt
	coffee ./train_model.coffee /tmp/mutter.txt > model.json
