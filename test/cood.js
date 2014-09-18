search = require('../cood')

var locs = [
  ['本郷', '34.409934', '132.986688', '本郷駅（広島） (本郷駅)'],
  ['東京 本郷', '35.705524', '139.759661', '東京都文京区本郷'],
];

function assert(a, b, c) {
  return function (d, e, f) {
    if (a !== d || b !== e || c !== f) {
      throw new Error('expect: ' + [a,b,c] + ' got: ' + [d,e,f]);
    }
  }
}

for (i=0; i<locs.length; ++i) {
  loc = locs[i];
  search(loc[0], assert(loc[1], loc[2], loc[3]));
}
