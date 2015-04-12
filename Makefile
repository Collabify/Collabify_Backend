all: test doc

test:
	./node_modules/.bin/mocha

doc:
	./node_modules/.bin/jsdoc -c conf.json

.PHONY: test doc