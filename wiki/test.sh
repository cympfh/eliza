# search word
WORD=$1
NAME=$2

WIKIURL=`w3m -dump "https://duckduckgo.com/?q=$WORD+ja.wikipedia.org" | grep "ja.wikipedia.org/wiki/" | head -1`

TMPFILE=/tmp/wiki.html
w3m -dump $WIKIURL > $TMPFILE

if [ -n "$NAME" ]; then
  cat $TMPFILE | grep $NAME -B1 -A1
else
  cat $TMPFILE | grep $WORD | head -n4 | tail -1
fi
