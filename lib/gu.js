/*
 * 英字中の大文字を全て小文字にする
 */

function gu(str) {
  var ensmall = function (c) {
    return String.fromCharCode(c.charCodeAt(0) + 32);
  };
  return str.replace(/[A-Z]/g, ensmall);
}

module.exports = gu;
