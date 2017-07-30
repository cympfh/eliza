#!/bin/bash

while-textarea() {
    awk '
BEGIN {
    v=1
}
/<\/textarea>/ {
    v=0
}
v {
    print $0
}
'
}

trim() {
    sed 's/^[ \t]*//g' |
    sed 's/<[^>]*>//g' |
    sed 's/^#.*//g' |  # hashtag
    sed 's,https://shindanmaker.com/[0-9]*,,g' |
    sed '/^$/d'  # empty lines
}

number=$1
name=$2

curl -s "https://shindanmaker.com/$number" -H 'User-Agent: Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:41.0) Gecko/20100101 Firefox/41.0' -H 'Content-Type: multipart/form-data; boundary=---------------------------2056919927962200798503755374' --data-binary $'-----------------------------2056919927962200798503755374\r\nContent-Disposition: form-data; name="u"\r\n\r\n'$name$'\r\n-----------------------------2056919927962200798503755374--\r\n' |
grep -A 10 '<textarea id="modaltweet"' |
while-textarea |
trim
