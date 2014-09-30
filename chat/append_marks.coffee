{random, round, log, abs, min, max} = Math

module.exports = (text) ->
  n = round log (do random) * 100 + 2
  p = 1/4
  a = [round do random]
  for i in [1 .. n]
    last = a[a.length - 1]
    a.push if (do random) < p then (1 - last) else last
  suffix =
    a.map (x) -> if x is 0 then '！' else '？'
     .join ''
  text + suffix

