trans = require('../translate');

function assert(expectation) {
  expectation = expectation.trim();
  return function (result) {
    result = result.trim();
    console.warn(result);
    if (expectation !== result) {
      throw new Error("expectation is \"" + expectation + "\". But got \"" + result + "\"");
    }
  }
}

trans(":translate en ja Hello. How are you?", assert('こんにちは。'));
trans(":trans en de And you?", assert('Und Sie ?'));
trans(":translate en ja It's cheeky habit of unemployed", assert('これは、失業者の生意気な癖だ'));
