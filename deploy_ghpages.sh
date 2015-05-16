#!/bin/sh

(
	cd public
	git init
	git config user.name "Travis-CI"
	git config user.email "travis@seedstack.org"
	git add .
	git commit -m "Built for seedstack.github.org"
	git push --force-with-lease --quiet "https://${GITHUB_TOKEN}@github.com/seedstack/seedstack.github.io" master:master > /dev/null 2>&1
)
