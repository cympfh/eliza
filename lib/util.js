exports.is_reply = function(text) {
  if (/RT/.test(text)) {
    return false;
  }
  return /(@|＠)(ampeloss|いらいざ|イライザ)/.test(text)
};
