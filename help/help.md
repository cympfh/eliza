# イライザのヘルプ。

## イライザとは何か。
Twitter bot
twitter.com/ampeloss

## 使い方は何か
一定の書式に従ったツイート(コマンドと呼びます)がイライザのTLに流れたのを
見たら対応する反応、すなわちリプライを行う。

## 注意事項
- イライザへのリプライは無視。コマンドを @ampeloss から始めないこと。
- ツイート中に初めて出現した半角セミコロン(;)から改行までは無視する。
- これは、 Twitterにおいて同一文章を短いスパンでツイートできないのを回避するため。
- コマンドは一部の例外を覗いて、半角コロン(:)から始まる。
- コマンドは全てにおいて一行に収めること。二行以上ある場合、たぶんだけど、二行目以降を無視する

## ソースコード
コマンドの説明を後に書くけど、ソースコードは以下の通りに公開してるので
そちらを見たほうがよいかもしれないし、そちらを自前で動かしてもよい。

https://github.com/cympfh/eliza

## コマンド一覧 (一部かもしれない)

### :tenki
東京の天気を返す。今日と明日の、降水確率、最高気温、最低気温の数字を [MSN天気予報](http://weather.jp.msn.com/local.aspx?wealocations=wc:JAXX0085) から持ってくる。詳細な読み方は、そのページと比較すればきっと分かる。

### :tenki [loc]
locは地名。勘の悪い人は \[ \] 自体を含めて書きそうだけど、locが変数だって意味だよ。
地名一覧は tenki.json (https://github.com/cympfh/eliza/blob/master/tenki.json) を参照のこと。

    :tenki 佐渡

### :tenkei
### :anime
東京における、今日のアニメ一覧を返す。
放送時間が昼間なのはおそらく興味ないものだろうから消してる。

### :j [j-code]
### :twitpic
### :shindan [id] [screen_name]

亜種として

    :neco
    :tateruze

など。

### :memo [command]

    :memo

と打つと、:memo についての詳細なヘルプを返す。

### :lmgtfy [検索ワード]

Let me Google that for you

### :lgtm

Look good to me

### :bio [screen_name]

    :bio ampeloss

## 作者
cympfh@gmail.com

