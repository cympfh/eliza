module.exports = isgd;
function isgd (url, cont) {
  console.warn('# isgd.js: curl \'http://is.gd/create.php?format=simple&url=\'"' + url + '"');
  require('child_process').exec('curl \'http://is.gd/create.php?format=simple&url=\'"' + url + '"', function(er,ou) {
    cont(ou);
  });
}

// isgd('https://twitter.com/ampeloss/with_replies', console.log);
