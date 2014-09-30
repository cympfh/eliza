all:
	cd chat; make
	make _test

_test:
	for i in test/*.js; do echo $$i; node $$i; done

_run:
	./runthis

git:
	git add --all
	git commit -a -m "`kasitime`"
	git push
