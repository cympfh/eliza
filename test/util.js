util = require('../lib/util.js');

// `is_reply` is predicate of
// whether that is the reply to eliza.
process.assert(util.is_reply('@いらいざ'));
process.assert(util.is_reply('＠いらいざ'));
process.assert(util.is_reply('@イライザ'));
process.assert(util.is_reply('＠イライザ'));
process.assert(! util.is_reply('いらいざ'), 'this is not reply');
process.assert(! util.is_reply('イライザ'), 'this is not reply');

