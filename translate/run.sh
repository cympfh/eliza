#!/bin/bash

Q=$3
Q=`echo $Q | sed 's/ /%20/g'`
curl -s "https://translate.google.co.jp/translate_a/single?client=t&sl=$1&tl=$2&dt=ex&dt=ld&dt=md&dt=qc&dt=rw&dt=rm&dt=ss&dt=t&dt=at&dt=sw&ie=UTF-8&oe=UTF-8&oc=1&otf=2&ssel=3&tsel=0&q=$Q" -H 'Accept-Encoding: gzip, deflate' -H 'Host: translate.google.co.jp' -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10.9; rv:31.0) Gecko/20100101 Firefox/31.0' | gunzip -d | cut -d'"' -f2
