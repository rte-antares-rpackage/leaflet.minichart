(function() {
  'use strict';

  var utils = require("./utils.js");
  var tinycolor = require("tinycolor2");
  var prettyNumbers = require("../prettyNumbers.js");
  var d3 = require("d3");

  module.exports = Chart;

  function Chart(el, data, options) {
    this._container = d3.select(el).append("svg");
    this._options = this._processOptions(options);
    this._data = data;
  }

  Chart.prototype.update = function(data, options) {
    this._data = data;
    this._options = this._processOptions(options);
    this._draw();
  };

  Chart.prototype.setOptions = function(options) {
    this._options = this._processOptions(options);
    this._draw();
  };

  Chart.prototype.setData = function(data) {
    this._data = data;
    this._draw();
  };

  Chart.prototype._draw = function() {};

  Chart.prototype._processOptions = function(options) {
    options = utils.mergeOptions(options, this._options);

    // Convert parameters colors, labels and labelColors to functions
    options.colorFun = utils.toFunction(options.colors);

    if (options.labels === "none") {
      options.labelText = null;
    } else if (options.labels === "auto") {
      options.labelText = utils.toFunction(prettyNumbers(this._data));
    }  else {
      options.labelText = utils.toFunction(options.labels);
    }

    if (options.labelColors === "auto") {
      options.labelColorFun = function(d, i) {
        return tinycolor.mostReadable(options.colorFun(d, i), ["white", "black"])._originalInput
      };
    } else {
      options.labelColorFun = utils.toFunction(options.labelColorFun);
    }

    return options;
  }

}());
