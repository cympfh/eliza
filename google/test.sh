#!/bin/sh

WORD=$1
echo "GOOGLE/TEST.SH $WORD"
w3m -dump_source "http://www.google.co.jp/search?q=$WORD" |nkf -w > output
node ./google/test.js
