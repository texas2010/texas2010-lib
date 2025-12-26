#!/bin/sh
set -e

DOCKER_MODE="${DOCKER_MODE:-dev}"

node integration/setup/create-fake-files.js
node integration/setup/publish.js
node integration/setup/install-package.js

if [ "$DOCKER_MODE" = "test" ]; then
  echo "Vitest: Run once"
  exec npx vitest --config vitest.config.ts --run
else
  echo "Vitest: Watch Mode"
  exec npx vitest --config vitest.config.ts --watch --reporter tree
fi