// Generated by CoffeeScript 1.8.0
(function() {
  var abs, is_number, log, max, min, pop, popp, ptw, push, random, round;

  random = Math.random, round = Math.round, log = Math.log, abs = Math.abs, min = Math.min, max = Math.max;

  ptw = [];

  popp = function() {
    var prob_pop;
    prob_pop = function() {
      var gen, h, t;
      if (ptw.length < 30) {
        return 0;
      }
      gen = 0.004;
      h = (new Date).getHours();
      t = abs(h - 2);
      switch (false) {
        case !(t < 2):
          return gen;
        case !(t < 12):
          return gen * 0.6;
        default:
          return gen * 0.3;
      }
    };
    return (random()) < (prob_pop());
  };

  pop = function(cont) {
    var p;
    if (popp()) {
      p = ptw.shift();
      console.warn("# chat.pop " + p);
      return cont(p);
    }
  };

  is_number = function(c) {
    var n;
    n = parseInt(c);
    return !(isNaN(n));
  };

  push = function(text, name) {
    var prob_push, pushable, pushp;
    prob_push = function() {
      var len;
      len = ptw.length;
      if (len < 30) {
        return 0.2;
      } else {
        return 3 / len;
      }
    };
    pushp = function() {
      return (random()) < (prob_push());
    };
    pushable = function(text, name) {
      var contain;
      contain = function(sub) {
        return (text.indexOf(sub)) !== -1;
      };
      if (contain('RT')) {
        return false;
      }
      if (contain('@')) {
        return false;
      }
      if (contain('#')) {
        return false;
      }
      if (contain('ttp')) {
        return false;
      }
      if (is_number(name[name.length - 1])) {
        return false;
      }
      return true;
    };
    if ((pushable(text, name)) && (pushp())) {
      ptw.push(text);
      return console.warn("# chat.push; ptw length is " + ptw.length);
    }
  };

  module.exports = {
    pop: pop,
    push: push,
    popp: popp
  };

}).call(this);
