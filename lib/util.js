exports.is_reply = function(text) {
  if (/RT/.test(text)) {
    return false;
  }
  return (/(@|＠)(ampeloss|いらいざ|イライザ)/).test(text);
};

exports.split = function (s, n, proc) {
  var xs = s.split('\n').filter(function (l) { return !!l; });

  var buf = [];
  var len = 0;
  xs.forEach(function (line, i) {
    if (len + line.length + 1 < n) {
      buf.push(line);
      len += line.length + 1;
    } else {
      proc(buf.join('\n'));
      buf = [line];
      len = line.length;
    }

    if (i === xs.length - 1 && buf.length > 0) {
      proc(buf.join('\n'));
    }
  });
};

