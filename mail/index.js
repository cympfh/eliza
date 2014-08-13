var exec = require('child_process').exec;

module.exports = function(to, title, body) {
  exec('./mail/send.py "' + to + '" "' + title + '" "' + body + '"',
       function(er){if (er) console.log(er); });
};
