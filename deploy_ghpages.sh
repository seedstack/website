#!/bin/sh

(
	cd public
	git init
	git config user.name "Travis-CI"
	git config user.email "travis@seedstack.org"
	git add .
	git commit -m "Prepared for Github Pages"
	git push --force --quiet "https://${GITHUB_TOKEN}@github.com/seedstack/seedstack.github.io" master:master > /dev/null 2>&1
)
