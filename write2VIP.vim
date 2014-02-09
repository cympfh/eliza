scriptencoding utf-8

" グローバル変数
let g:coch_name = ""

fun! s:WriteTextTrim(str, key)
    let str = a:str
    let str = EncodeURI_sub(str)
    let str = Conv2(str)
    call s:WriteThread(str, a:key)
endfun

fun! s:WriteThread(str, key)
    let cookiefile = "/Users/cympfh/.vim/cookie.txt"
    let url = "http://hayabusa.2ch.net/test/bbs.cgi"
    let bbs = "news4vip"
    let key = a:key

    let curlcmd = "curl -# -v -c ".cookiefile." -b ".cookiefile
    let curlcmd .= " -d MESSAGE=\"" . a:str . "\""
    let curlcmd .= " -d mail=sage"
    let curlcmd .= " -d FROM=" . g:coch_name
    let curlcmd .= " -d sid="
    let curlcmd .= " -d key=".key
    let curlcmd .= " -d bbs=".bbs
    let curlcmd .= " -d den=bo"
    let curlcmd .= " -d submit="
    let curlcmd .= " -d time=1 -e ".url." ".url

    let res = Conv(system(curlcmd))
    echo res

    if res =~ "2ch_X:cookie"
        let i = match(res, "name=time")
        let i = match(res, "value", i)
        let j = match(res, ">", i)
        let time = res[ i + 6 : j - 1]
        let time = time - 10000
        echo "time = ".time
        let i = match(res, "key", j)
        let i = match(res, "name", i)
        let j = match(res, "value", i)
            let yuki = res[i + 6 : j - 3]
        let i = match(res, ">", j)
            let akari = res[j + 7 : i - 2]

        let curlcmd .= " -d time=".time." -d ".yuki."=".akari." -e ".url." ".url
        let curlcmd = substitute(curlcmd, "\r", "", "g")
        let curlcmd = substitute(curlcmd, "\n", " ", "g")
        let res = Conv(system(curlcmd))

        echo res
    endif
endfun


fun! Conv(str)
    return iconv(a:str, "sjis", "utf-8")
endfun

fun! Conv2(str)
    return iconv(a:str, "utf-8", "sjis")
endfun

fun! EncodeURI_sub(line)
    let line = a:line
    let line = substitute(line, " ", "%20", "g")
    let line = substitute(line, ">", "%26gt;", "g")
    let line = substitute(line, "<", "%26lt;", "g")
    let line = substitute(line, "～", "%26#12316", "g")

    return line
endfun

fun! DecodeURI_sub(line)
    let line = a:line
    let line = substitute(line, "&gt;", ">","g")
    let line = substitute(line, "&lt;", "<","g")
    let line = substitute(line, "&quot;", "\"","g")

    return line
endfun

