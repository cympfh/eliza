exports.is_reply = function(text) {
  return text.indexOf('いらいざ') !== -1 || text.indexOf('イライザ') !== -1 || /^@ampeloss /.test(text)
};
