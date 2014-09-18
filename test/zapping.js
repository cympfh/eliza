zap = require('../zapping');
function aset(result) {
  if (result.trim() == '') throw new Error('the zapping returns blank');
  console.warn(result);
}
zap(aset);
