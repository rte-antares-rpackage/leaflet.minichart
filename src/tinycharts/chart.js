(function() {
  'use strict';

  var d3 = require("d3");
  var tinycolor = require("tinycolor2");
  var utils = require("./utils.js");
  var prettyNumbers = require("../prettyNumbers.js");
  var Label = require("./label.js")

  module.exports = Chart;

  function Chart(el, data, options, defaults) {
    this._options = {
      width:60,
      height: 60,
      transitionTime: 750,
      colors: d3.schemeCategory10,
      labels: "none",
      labelColors: "auto"
    };

    this._options = utils.mergeOptions(this._options, defaults || {});
    this._options = this._processOptions(options);
    this._data = data;
    this._container = d3.select(el).append("svg");
    this._chart = this._container.append("g");
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

  Chart.prototype._draw = function() {
    var self = this;
    // Update container size
    self._container
      .transition()
      .duration(self._options.transitionTime)
      .attr("width", self._options.width)
      .attr("height", self._options.height);
  };

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

  Chart.prototype._drawLabels = function(initFun, updateFun) {
    var self = this;

    if (self._options.labels === "none") {
      self._chart.selectAll(".labels-container").remove();
      return;
    }


    self._labels = self._chart.selectAll(".labels-container").data(self._data);
    self._labels.enter()
      .append("g")
      .attr("class", "labels-container")
      .each(function(d, i) {
        this._label = new Label(this, self._options.labelStyle, self._options.labelColorFun(d, i),
                                self._options.labelMinSize, self._options.labelMaxSize);
        this._label.updateText(self._options.labelText(d, i))
        initFun(this._label, d, i);
      })

      .merge(self._labels)
      .each(function(d, i) {
        this._label.updateText(self._options.labelText(d, i));
        this._label._text.attr("fill", self._options.labelColorFun(d, i));
        updateFun(this._label, d, i);
      });

    self._labels.exit().remove();
  }

}());
