(function() {
  'use strict';

  module.exports.mergeOptions = mergeOptions;
  module.exports.toArray = toArray;
  module.exports.toFunction = toFunction;

  function mergeOptions(options, defaults) {
    options = options || {};
    defaults = defaults || {};
    for (var opt in defaults) {
      if (defaults.hasOwnProperty(opt) && !options.hasOwnProperty(opt)) {
        options[opt] = defaults[opt];
      }
    }
    return options;
  }

  function toArray(x) {
    if (x.constructor !== Array) x = [x];
    return x;
  }

  function toFunction(x) {
    if (typeof x === "function") return (x);
    x = toArray(x);
    return function(d, i) {return x[i % x.length]};
  }
}());
