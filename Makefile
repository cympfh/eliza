lint:
	jslint --indent=2 --stupid=true index.js

git:
	git add --all
	git commit -a -m "`kasitime`"
	git push
