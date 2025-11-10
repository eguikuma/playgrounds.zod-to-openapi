#!/bin/sh

DIR="$(dirname "$(readlink -f "$0")")"

exec tsx "$DIR/../build/core/scripts/generate.js" "$@"
