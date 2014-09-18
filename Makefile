all: _test
	cat Makefile

_run:
	./runthis

_test:
	for i in test/*.js; do echo $$i; node $$i; done

git:
	git add --all
	git commit -a -m "`kasitime`"
	git push
