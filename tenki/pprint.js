module.exports = function (obj) {
  var ret = JSON.stringify(obj);
  ret = ret.replace(/"/g, '');
  ret = ret.replace(/'/g, '');
  ret = ret.replace(/null/g, '-');
  ret = ret.replace(/tomor/, '\n tomor');
  return ret;
};
