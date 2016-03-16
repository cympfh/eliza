#!/usr/bin/env ruby

N = 4

$pr = {}

def load(file)
  for line in File.readlines(file)
    ws = line.split
    ws.unshift :BOS
    ws.push :EOS
    for i in 0..ws.size
      g = [ ws[i] ]
      for n in 1...N
        if i+n < ws.size
          next_char = ws[i+n]
          $pr[g] = {} if $pr[g] == nil
          $pr[g][next_char] = 0 if $pr[g][next_char] == nil
          $pr[g][next_char] += 1
          g = g + [next_char]
        end
      end
    end
  end
end

for f in ARGV
  STDERR.puts "load #{f}"
  load(f)
end

def alpha? str
  !str.match(/[^A-Za-z0-9\+\_\-,\.]/)
end

def join(ws)
  r = ws[0]
  for i in 1...ws.size
    if alpha?(r[-1])
      r += ' ' + ws[i]
    else
      r += ws[i]
    end
  end
  r
end

def gen
  sentence = []
  g = [:BOS]

  while g[-1] != :EOS
    g.shift while $pr[g] == nil
    sum = 0
    for _,m in $pr[g]
      sum += m
    end
    x = rand(sum)
    for next_char,m in $pr[g]
      x -= m
      if x <= 0
        g << next_char
        sentence << next_char
        break
      end
    end
    return join(sentence) if sentence.size > 20
  end

  sentence.pop
  join sentence
end

puts gen
