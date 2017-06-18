#!/usr/bin/env bash
set +e
$(npm bin)/eslint index.js **/*.js

RC=$?
if [ $RC -eq 0 ]; then
    echo "Linting passed."
fi
exit $RC
