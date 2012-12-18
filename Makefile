test:
	@echo "Launching tests. Setting environment to test"
	@ NODE_ENV="test" ./node_modules/.bin/mocha --reporter spec
	@echo "Tests finished"

.PHONY: test

