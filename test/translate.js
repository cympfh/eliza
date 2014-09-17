trans = require('../translate');

function assert(expectation) {
  expectation = expectation.trim();
  return function (result) {
    result = result.trim();
    if (expectation !== result) {
      throw new Error("expectation is \"" + expectation + "\". But got \"" + result + "\"");
    }
  }
}

trans(":translate en ja Hello. How are you?", assert('こんにちは。'));
trans(":trans en de And you?", assert('Und Sie ?'));
