build:
	rm -rf dist
	NODE_ENV=production npx webpack

develop:
	npx webpack serve

install:
	npm ci

lint:
	npx eslint .
