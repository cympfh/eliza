#!/bin/bash

# original is
# curl -s 'https://shindanmaker.com/80808' -H 'User-Agent: Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:41.0) Gecko/20100101 Firefox/41.0' -H 'Content-Type: multipart/form-data; boundary=---------------------------2056919927962200798503755374' --data-binary $'-----------------------------2056919927962200798503755374\r\nContent-Disposition: form-data; name="u"\r\n\r\n\u30a4\u30e9\u30a4\u30b6\r\n-----------------------------2056919927962200798503755374--\r\n'

number=$1
name=$2

curl -s "https://shindanmaker.com/$number" -H 'User-Agent: Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:41.0) Gecko/20100101 Firefox/41.0' -H 'Content-Type: multipart/form-data; boundary=---------------------------2056919927962200798503755374' --data-binary $'-----------------------------2056919927962200798503755374\r\nContent-Disposition: form-data; name="u"\r\n\r\n'$name$'\r\n-----------------------------2056919927962200798503755374--\r\n' |
grep -A 10 '<textarea' | sed 's/^[ \t]*//g' | sed 's/<[^>]*>//g' | sed '/^$/d'
