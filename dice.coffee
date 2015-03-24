chars = [
  '⚀'
  '⚁'
  '⚂'
  '⚃'
  '⚄'
  '⚅'
]
dice = (k) ->
  for i in [0 ... k]
    n = Math.random() * 100 | 0
    n %= 6
    chars[n]

module.exports = dice
