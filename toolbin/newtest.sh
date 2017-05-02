#!/usr/bin/env bash

TARGETDIR=$(dirname "$1")
TESTNAME=$(basename "$1")

if [ -z "$TARGETDIR" ]; then
    FINALDIR="test"
else
    FINALDIR="test/$TARGETDIR"
fi

$(npm bin)/newTest "$FINALDIR" "$TESTNAME.test" bare
