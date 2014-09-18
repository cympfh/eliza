var curl = require('./curl');

function search(word, cont) {
  var url = "http://www.geocoding.jp/api/?v=1.1&q=" + encodeURIComponent(word);
  curl(url, "GET", function (xml) {
    var lat = xml.match(/<lat>(.*)<\/lat>/);
    lat = lat ? lat[1] : null;
    var lng = xml.match(/<lng>(.*)<\/lng>/);
    lng = lng ? lng[1] : null;
    var loc = xml.match(/<google_maps>(.*)<\/google_maps>/);
    loc = loc ? loc[1] : null;
    cont(lat, lng, loc);
  });
}

module.exports = search;
