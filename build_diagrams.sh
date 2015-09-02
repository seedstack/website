#!/bin/sh

find ./puml -name "*.puml" | while read FILE; do
    echo "Processing file '$FILE'"

    PROCESSED="$(sed -e '/..\/common.puml/ {' -e 'r puml/common.puml' -e 'd' -e '}' $FILE)"
    mkdir -p static/$(dirname $FILE)
    ENCODED="$(curl --data "text=$PROCESSED" http://www.plantuml.com/plantuml/form | sed -n 's/.*<img src=".*\/plantuml\/png\/\([^"]*\)".*/\1/p')"
    curl http://www.plantuml.com/plantuml/png/$ENCODED > static/$FILE.png
done

