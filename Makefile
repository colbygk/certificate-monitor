ESLINT=./node_modules/.bin/eslint
TAP=./node_modules/.bin/tap

# ------------------------------------------------------------------------------

lint:
	$(ESLINT) ./*.js
	$(ESLINT) ./lib/*.js
	$(ESLINT) ./test/**/*.js

test:
	@make lint
	$(TAP) ./test/unit/*.js

coverage:
	$(TAP) ./test/unit/*.js --coverage --coverage-report=lcov


.PHONY: lint test coverage
