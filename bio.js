function bio(name, cont) {
  var keyword = "bio profile-field"
    , url = 'https://twitter.com/' + name
    , command = 'curl ' + url + '|grep \"' + keyword + '\"'
    ;

  require('child_process')
    .exec(command, function(err, data) {
      if (err) {
        console.warn(err);
        cont(err);
        return;
      }
      data = data.slice(data.indexOf('>') + 1
                      , data.lastIndexOf('<'));
      cont(data);
    });
}

module.exports = bio;
//bio('ampeloss', console.log);
