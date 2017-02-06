(function() {
  'use strict';

  var utils = require("./utils.js");
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
    return options;
  }

}());
