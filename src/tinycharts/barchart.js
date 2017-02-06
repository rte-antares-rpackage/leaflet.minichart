(function() {
  'use strict';

  var d3 = require("d3");
  var tinycolor = require("tinycolor2");
  var prettyNumbers = require("../prettyNumbers.js");
  var Label = require("./label.js");

  module.exports = Barchart;

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

  function Barchart(el, data, options) {
    var defaultOptions = {
      width:60,
      height:60,
      transitionTime: 750,
      colors: d3.schemeCategory10,
      labelColor: "auto",
      zeroLineStyle: "stroke:#999;stroke-width:1;"
    };

    options = mergeOptions(options, defaultOptions)

    // Set min value and max value if necessary.
    if (!options.hasOwnProperty('minValue')) {
      var min = d3.min(data);
      var max = d3.max(data);

      if (max > 0 && min > 0) options.minValue = 0;
      else options.minValue = min;
    }

    if (!options.hasOwnProperty('maxValue')) {
      var min = d3.min(data);
      var max = d3.max(data);

      if (max < 0 && min < 0) options.maxValue = 0;
      else options.maxValue = max;
    }

    // Initialize the zero line
    var scaleFun = d3.scaleLinear()
      .domain([0, 1])
      .range([options.height, 0]);

    this._container = d3.select(el).append("svg");
    this._chart = this._container.append("g");
    this._zeroLine = this._container.append("line")
      .attr("x1", 0)
      .attr("y1", scaleFun(0))
      .attr("x2", options.width)
      .attr("y2", scaleFun(0))
      .attr("style", options.zeroLineStyle);

    this.update(data, options);
  }

  Barchart.prototype.update = function(data, options) {
    this._data = data;
    this._options = mergeOptions(options, this._options);
    this._draw();
  }

  Barchart.prototype.setData = function(data) {
    this._data = data;
    this._draw();
  }

  Barchart.prototype.setOptions = function(data) {
    this._options = mergeOptions(options, this._options);
    this._draw();
  }

  Barchart.prototype._draw = function() {
    var self = this;
    var barWidth = (self._options.width - 6) / self._data.length;
    var scaleFun = d3.scaleLinear()
      .domain([0, 1])
      .range([self._options.height, 0]);

    var colorFun = d3.scaleOrdinal(self._options.colors);
    self._colorFun = colorFun;

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
      .attr("fill", function(d, i) {return colorFun(i);});
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
    if (self._options.labels) {
      self._drawLabels(barWidth, scaleFun);
    } else {
      self._chart.selectAll(".labels-container").remove();
    }
  }

  Barchart.prototype._drawLabels = function(barWidth, scale) {
    var self = this;

    var labelColor;
    if (this._options.labelColor == "auto") {
      labelColor = function(i) {
        return tinycolor.mostReadable(self._colorFun(i), ["white", "black"])._originalInput
      }
    } else {
      labelColor = function(i) {return this._options.labelColor};
    }

    function labelPositionAndSize(el, options, barWidth, scale, d, i) {
      var bbox = el.innerSize();

      var ratioV = Math.min(options.labelMaxSize, Math.abs(scale(d) - scale(0))) / bbox.height;
      var ratioH = (barWidth - 2 * options.labelPadding) / bbox.width;
      el.updateScale(Math.min(ratioV, ratioH), options.transitionTime);
      var height = bbox.height * el._scale;
      var posy = d > 0? height / 2: -height / 2;
      el.updatePosition((i + 0.5) * barWidth + 3,  posy + scale(d), options.transitionTime);
    }

    var labelsEl = this._chart.selectAll(".labels-container").data(this._data);
    labelsEl.enter()
      .append("g")
      .attr("class", "labels-container")
      .each(function(d, i) {
        this._label = new Label(this, self._options.labelStyle, labelColor(i),
                                self._options.labelMinSize, self._options.labelMaxSize)
        this._label.updateText(self._options.labels[i]);
        labelPositionAndSize(this._label, self._options, barWidth, scale, d, i)
      })

      .merge(labelsEl)
      .each(function(d, i) {
        this._label.updateText(self._options.labels[i]);
        this._label._text.attr("fill", labelColor(i));
        labelPositionAndSize(this._label, self._options, barWidth, scale, d, i)
      });

    labelsEl.exit().remove();
  }
}());
