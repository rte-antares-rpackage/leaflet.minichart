(function() {
  'use strict';

  var d3 = require("d3");
  var tinycolor = require("tinycolor2");
  var prettyNumbers = require("../prettyNumbers.js");
  var utils = require("./utils.js");
  var Label = require("./label.js");
  var Chart = require("./chart.js");

  module.exports = Barchart;

  // Barchart inherits from Chart
  Barchart.prototype = Chart.prototype;

  function Barchart(el, data, options) {
    // Default options
    this._options = {
      width:60,
      height:60,
      minValue: "auto",
      maxValue: "auto",
      transitionTime: 750,
      colors: d3.schemeCategory10,
      labels: "none",
      labelColors: "auto",
      zeroLineStyle: "stroke:#999;stroke-width:1;",

    };

    // Call super constructor
    Chart.call(this, el, data, options);

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
    //options = Chart.prototype._processOptions.call(this, options);
    options = utils.mergeOptions(options, this._options);

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
      options.labelColorFun = toFunction(options.labelColorFun);
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
    var bar = self._chart.selectAll("rect").data(self._data);
    // Add new bars
    bar.enter()
      .append("rect")
      .attr("x", function(d, i) {return (i + 1) * barWidth + 3})
      .attr("y", function(d) {return scaleFun(0)})
      .attr("width", 0)
    // Update bars
      .merge(bar)
      .transition()
      .duration(self._options.transitionTime)
      .attr("width", barWidth)
      .attr("x", function(d, i) {return i * barWidth + 3;})
      .attr("y", function(d) {return d >= 0? scaleFun(d) : scaleFun(0);})
      .attr("height", function(d) {return Math.abs(scaleFun(d) - scaleFun(0));})
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
    if (self._options.labels !== "none") {
      self._drawLabels(barWidth, scaleFun);
    } else {
      self._chart.selectAll(".labels-container").remove();
    }
  }

  Barchart.prototype._drawLabels = function(barWidth, scale) {
    var self = this;

    function labelPositionAndSize(el, options, barWidth, scale, d, i) {
      var bbox = el.innerSize();

      var ratioV = Math.min(options.labelMaxSize, Math.abs(scale(d) - scale(0))) / bbox.height;
      var ratioH = (barWidth - 2 * options.labelPadding) / bbox.width;
      el.updateScale(Math.min(ratioV, ratioH), options.transitionTime);
      var height = bbox.height * el._scale;
      var posy = d > 0? height / 2: -height / 2;
      el.updatePosition((i + 0.5) * barWidth + 3,  posy + scale(d), options.transitionTime);
    }

    var labelsEl = self._chart.selectAll(".labels-container").data(self._data);
    labelsEl.enter()
      .append("g")
      .attr("class", "labels-container")
      .each(function(d, i) {
        this._label = new Label(this, self._options.labelStyle, self._options.labelColorFun(d, i),
                                self._options.labelMinSize, self._options.labelMaxSize);
        this._label.updateText(self._options.labelText(d, i));
        labelPositionAndSize(this._label, self._options, barWidth, scale, d, i)
      })

      .merge(labelsEl)
      .each(function(d, i) {
        this._label.updateText(self._options.labelText(d, i));
        this._label._text.attr("fill", self._options.labelColorFun(d, i));
        labelPositionAndSize(this._label, self._options, barWidth, scale, d, i)
      });

    labelsEl.exit().remove();
  }
}());
