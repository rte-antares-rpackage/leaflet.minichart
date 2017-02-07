(function() {
  'use strict';

  var d3 = require("d3");
  var Chart = require("./chart.js");

  module.exports = Barchart;

  // Barchart inherits from Chart
  Barchart.prototype = Object.create(Chart.prototype);

  function Barchart(el, data, options) {
    // Default options
    var defaults = {
      height:60,
      minValue: "auto",
      maxValue: "auto",
      zeroLineStyle: "stroke:#333;stroke-width:1;"
    };

    // Call super constructor
    Chart.call(this, el, data, options, defaults);

    // Initialize the zero line
    var scaleFun = d3.scaleLinear()
      .domain([this._options.minValue, this._options.maxValue])
      .range([this._options.height, 0]);

    this._chart = this._container.append("g");
    this._zeroLine = this._container.append("line")
      .attr("x1", 0)
      .attr("y1", scaleFun(0))
      .attr("x2", this._options.width)
      .attr("y2", scaleFun(0))
      .attr("style", this._options.zeroLineStyle);

    this._draw();
  }

  Barchart.prototype._processOptions = function(options) {
    options = Chart.prototype._processOptions.call(this, options, this._options);

    // Set min value and max value if necessary.
    if (options.minValue === "auto") {
      var min = d3.min(data);
      var max = options.maxValue === "auto"? d3.max(data): options.maxValue;

      if (max > 0 && min > 0) options.minValue = 0;
      else options.minValue = min;
    }

    if (options.maxValue === "auto") {
      var max = options.minValue === "auto"? d3.min(data): options.minValue;
      var max = d3.max(data);

      if (max < 0 && min < 0) options.maxValue = 0;
      else options.maxValue = max;
    }

    return options;
  };

  Barchart.prototype._draw = function() {
    var self = this;
    var barWidth = (self._options.width - 6) / self._data.length;
    var scaleFun = d3.scaleLinear()
      .domain([self._options.minValue, self._options.maxValue])
      .range([self._options.height, 0]);

    // Update container size
    self._container
      .transition()
      .duration(self._options.transitionTime)
      .attr("width", self._options.width)
      .attr("height", self._options.height);

    // Update the zero line
    self._zeroLine
      .transition()
      .duration(self._options.transitionTime)
      .attr("x1", 0)
      .attr("y1", scaleFun(0))
      .attr("x2", self._options.width)
      .attr("y2", scaleFun(0))
      .attr("style", self._options.zeroLineStyle);

    // Update bars
    var bar = self._chart.selectAll("path").data(self._data);
    // Add new bars
    function rectPath(x, y, w, h) {
      return ("M" + x + " " + y + "l" + w + " 0l0 " + h + "l" + (-w) + " 0Z")
    }

    bar.enter()
      .append("path")
      .attr("d", function(d, i) {return rectPath((i + 1) * barWidth + 3, scaleFun(0), 0, 0)})
    // Update bars
      .merge(bar)
      .transition()
      .duration(self._options.transitionTime)
      .attr("d", function(d, i) {return rectPath(i * barWidth + 3, scaleFun(0), barWidth, scaleFun(d) - scaleFun(0))})
      .attr("fill", self._options.colorFun);
    // Remove bars
    bar.exit()
      .transition()
      .duration(self._options.transitionTime)
      .attr("x", function(d, i) {return i * barWidth + 3;})
      .attr("y", 0)
      .attr("width", 0)
      .attr("height", 0)
      .remove();

    // Add/ update labels
    function initLabel(label, d, i) {
      label.fillRect(
        i * barWidth + 3, scaleFun(0),
        barWidth, 0,
        self._options.labelPadding,
        "center", d >= 0? "top": "bottom",
        0
      );
    }

    function updateLabel(label, d, i) {
      label.fillRect(
        i * barWidth + 3, d >= 0? scaleFun(d) : scaleFun(0),
        barWidth, Math.abs(scaleFun(d) - scaleFun(0)),
        self._options.labelPadding,
        "center", d >= 0? "top": "bottom",
        self._options.transitionTime);
    }

    this._drawLabels(initLabel, updateLabel);
  }
}());
