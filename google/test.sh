#!/bin/sh

WORD=$1
w3m -dump_source "http://www.google.co.jp/search?q=$WORD" |nkf -w > output
node test.js
