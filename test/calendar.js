calendar = require('../calendar');

function not_blank(result) {
  if (result.trim() == '') throw new Error(result);
  return true;
}

calendar('', not_blank);
calendar('1124', not_blank);
calendar('1/4', not_blank);
calendar('茅原', not_blank);
