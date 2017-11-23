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

lambda:
	@npm install
	@echo "Creating certificate-monitor-$(shell git log --pretty=format:'%h' -n 1)".zip
	@zip -qr certificate-monitor-$(shell git log --pretty=format:'%h' -n 1).zip node_modules lambda.js

.PHONY: lint test coverage
