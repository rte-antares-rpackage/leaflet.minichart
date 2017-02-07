// Copyright © 2016 RTE Réseau de transport d’électricité
(function() {
  var d3 = require("d3");
  var tinycolor = require("tinycolor2");
  var prettyNumbers = require("./prettyNumbers.js");
  var g = require("./geometry.js");
  var Label = require("./tinycharts/label.js");
  var Barchart = require("./tinycharts/Barchart.js");

  function toArray(x) {
    if (x.constructor !== Array) x = [x];
    return x;
  }

  function addOneLabel(el, options, color) {
    el._container = d3.select(el);
    el._label = el._container.append("g")
      .attr("class", "label");

    el._text = el._label.append("text")
      .attr("class", "leaflet-clickable")
      .attr("dy", "0.35em")
      .attr("text-anchor", "middle")
      .attr("opacity", 1)
      .attr("style", options.labelStyle)
      .attr("fill", color)
  }

  L.D3chart = L.CircleMarker.extend({

    /** Options used to initialize/update a D3chart object.
      * @typedef {object} D3chartOptions
      * @memberOf 'L.D3chart'
      * @prop {string} [type = "bar"]
      * Type of chart to create. Possible values are "bar" for barcharts, "pie"
      * for pie charts, "polar-radius" and "polar-area" for polar area charts
      * where values are represented either by the radius or the area of the
      * slices.
      * @prop {number[]} [data = [1]]
      * Data values the chart has to represent.
      * @prop {number[]} [maxValues = [1]]
      * maximal absolute value the data could take. It can be a single numeric
      * value or an array of values with same length as data. In the first case,
      * all values will be represented with the same scale while in the second
      * case, each value will have its own scale. This is useful when one wants
      * to represent multiple variables that are not comparable.
      * @prop {string} [fillColor=#4281e5]
      * Color used to fill the shape when data contains only one value.
      * @prop {string[]} [colorPalette=d3.schemeCategory10]
      * Array of colors used to fill each part of the chart representing one
      * value of data.
      * @prop {number} [width=60]
      * Width of the chart when `type` equals 'bar' or maximal diameter of the
      * chart for all other types.
      * @prop {number} [height=60]
      * Maximal height of barcharts.
      * @prop {number} [opacity=1]
      * Opacity of the chart.
      * @prop {boolean} [showLabels=false]
      * Should values be displayed in the charts?
      * @prop {string} [labelStyle="font-family:sans-serif"]
      * CSS style to apply to labels
      * @prop {number} [labelMinSize=8]
      * Labels are automatically hidden if the label height is less than this number.
      * @prop {number} [labelMaxSize=24]
      * Maximal height of labels.
      * @prop {number} [labelPadding=2]
      * Padding to apply to labels.
      * @prop {string} [labelColor="auto"]
      * Color to apply to labels. If "auto", text will be black or white
      * depending on the background color.
      * @prop {string[]|null} [labelText=null]
      * Labels to display. It must have same length as data or be null. In the
      * last case, data values are used as labels.
      * @prop {number} [transitionTime=750]
      * Duration in millisecondq of transitions.
      *
      */
    options: {
      type: "bar",
      data: [1],
      maxValues: [1],
      fillColor: "#4281e5",
      colorPalette: d3.schemeCategory10,
      width: 60,
      height: 60,
      opacity: 1,
      showLabels: false,
      labelStyle: "font-family:sans-serif",
      labelMinSize: 8,
      labelMaxSize: 24,
      labelPadding: 2,
      labelColor: "auto",
      labelText: null,
      transitionTime: 750,
    },

    /**
      * @class 'L.D3chart'
      * @summary add add bar, pie and polar charts to a leaflet map
      * @desc L.D3chart is used to add dynamic charts on a leaflet map. It is specially
      * useful to represent multiple data values associated to some geographical
      * coordinates.
      *
      * @example
      *
      * L.d3chart([0, 0], {data: [1, 2, 3], maxValues: 3})
      *
      * @param {L.Point} center
      * @param {D3chartOptions} options - Object containing
      * options to construct a chart.
      */
    initialize: function(center, options) {
      this._center = center;
      L.Util.setOptions(this, options);
      L.CircleMarker.prototype.initialize.call(
        this,
        center,
        {radius: this.options.width/2, stroke: false, fill: false}
      );
    },

    onAdd: function(map) {
      L.CircleMarker.prototype.onAdd.call(this, map);
      // Change class of container so that the element hides when zooming
      var container = this._container || this._renderer._container;

      container.setAttribute("class", "leaflet-zoom-hide");

      // create the svg element that holds the chart
      this._chart = d3.select(container).append("g");

      map.on('viewreset', this._redraw, this);
      this._redraw(true);
    },

    onRemove: function() {
      // remove layer's DOM elements and listeners
      L.CircleMarker.prototype.onRemove.call(this, map);
      map.off('viewreset', this._redraw, this);
    },

    /** Update the options of a D3chart object.
      * @method setOptions
      * @instance
      * @memberOf 'L.D3chart'
      *
      * @param {D3chartOptions} options - Object containing options to update the chart.
      */
    setOptions: function(options) {
      var newChart = options.type && options.type != this.options.type;
      L.Util.setOptions(this, options);
      this._redraw(newChart);
    },

    _redraw: function(newChart) {
      // If necessary remove all elements of the previous chart
      if (newChart === true) {
        this._chart.selectAll("*").remove();
      }

      // Coordinates of the center in the svg frame
      var c = this._map.latLngToLayerPoint(this._center);

      // prepare data
      this.options.data = toArray(this.options.data);
      this.options.maxValues = toArray(this.options.maxValues);

      var max = this.options.maxValues;
      var data = this.options.data;
      for (var i = 0; i < data.length; i++) {
        if (isNaN(data[i]) || !isFinite(data[i])) data[i] = 0;
      }
      if(max.length !== 1 && max.length != data.length) {
        throw new Error("'maxValues' should be a single number or have same length as 'data'");
      }
      dataScaled = []
      for (var i = 0; i < data.length; i++) {
        dataScaled.push(data[i] / max[i % max.length]);
      }

      // Prepare labels
      if (!this.options.showLabels) {
        var labels = null;
      } else if (this.options.labelText == null) {
        var labels = prettyNumbers(data)
      } else {
        labels = toArray(this.options.labelText);
        if (labels.length != data.length) {
          throw new Error("Custom labels must have same length as data")
        }
      }

      switch(this.options.type) {
        case "bar":
          this._drawBar(c, dataScaled, newChart, labels);
          break;
        case "pie":
          this._drawPolar(c, dataScaled, "angle", labels);
          break;
        case "polar-radius":
          this._drawPolar(c, dataScaled, "radius", labels);
          break;
        case "polar-area":
          this._drawPolar(c, dataScaled, "area", labels);
          break;
      }
    },

    _drawBar: function(c, data, newChart, labels) {
      // Clone options and modify some of them
      var opts = JSON.parse(JSON.stringify(this.options));
      opts.minValue = -1;
      opts.maxValue = 1;
      opts.height = opts.height * 2;
      opts.colors = opts.colorPalette;
      opts.labels = labels;

      console.log(newChart);
      if (newChart === true) {

        this._barchart = new Barchart(this._chart.node(), data, opts);
      }
      this._chart
        .attr("transform", "translate(" + (c.x - opts.width / 2) + "," + (c.y - opts.height / 2) + ")")
        .transition()
        .duration(opts.transitionTime)
        .attr("opacity", opts.opacity);
      this._barchart.update(data, opts);

      // D3 scale function
      // var scale = d3.scaleLinear()
      //   .domain([0, 1])
      //   .range([0, this.options.height]);
      //
      // // D3 colors function
      // var colList = data.length == 1 ? [this.options.fillColor] : this.options.colorPalette;
      // var color = d3.scaleOrdinal(colList);
      //
      // var barWidth = this.options.width / data.length;
      //
      // // Set the position of the container
      // this._chart
      //   .attr("transform", "translate(" + (c.x - this.options.width / 2) + "," + (c.y) + ")")
      //   .transition()
      //   .duration(this.options.transitionTime)
      //   .attr("opacity", this.options.opacity);
      //
      // // Display/ update data
      // var bar = this._chart.selectAll("rect").data(data);
      //
      // bar.enter()
      //   .append("rect")
      //   .attr("class", "leaflet-clickable")
      //   .attr("x", function(d, i) {return (i + 1) * barWidth})
      //   .attr("y", function(d) {return 0})
      //   .attr("width", 0)
      //   .merge(bar)
      //   .transition()
      //   .duration(this.options.transitionTime)
      //   .attr("width", barWidth)
      //   .attr("x", function(d, i) {return i * barWidth})
      //   .attr("y", function(d) {return d >= 0? -scale(d) : 0;})
      //   .attr("height", function(d) {return Math.abs(scale(d))})
      //   .attr("fill", function(d, i) {return color(i)});
      //
      // bar.exit()
      //   .transition()
      //   .duration(this.options.transitionTime)
      //   .attr("x", function(d, i) {return i * barWidth})
      //   .attr("y", 0)
      //   .attr("width", 0)
      //   .attr("height", 0)
      //   .remove();
      //
      // // labels
      // if (labels) {
      //   // color labels
      //   var labelColor;
      //   if (this.options.labelColor == "auto") {
      //     labelColor = function(i) {
      //       return tinycolor.mostReadable(color(i), ["white", "black"])._originalInput
      //     }
      //   } else {
      //     labelColor = function(i) {return this.options.labelColor};
      //   }
      //
      //   function labelPositionAndSize(el, options, barWidth, scale, d, i) {
      //     var bbox = el.innerSize();
      //
      //     var ratioV = Math.min(options.labelMaxSize, Math.abs(scale(d))) / bbox.height;
      //     var ratioH = (barWidth - 2 * options.labelPadding) / bbox.width;
      //     el.updateScale(Math.min(ratioV, ratioH), options.transitionTime);
      //     var height = bbox.height * el._scale;
      //     var posy = d > 0? height / 2: -height / 2;
      //     el.updatePosition((i + 0.5) * barWidth,  posy - scale(d), options.transitionTime);
      //   }
      //
      //   var labelsEl = this._chart.selectAll(".labels-container").data(data);
      //   var self = this;
      //   labelsEl.enter()
      //     .append("g")
      //     .attr("class", "labels-container")
      //     .each(function(d, i) {
      //       this._label = new Label(this, self.options.labelStyle, labelColor(i),
      //                               self.options.labelMinSize, self.options.labelMaxSize)
      //       this._label.updateText(labels[i]);
      //       labelPositionAndSize(this._label, self.options, barWidth, scale, d, i)
      //     })
      //
      //     .merge(labelsEl)
      //     .each(function(d, i) {
      //       this._label.updateText(labels[i]);
      //       this._label._text.attr("fill", labelColor(i));
      //       labelPositionAndSize(this._label, self.options, barWidth, scale, d, i)
      //     });
      //
      //   labelsEl.exit().remove();
      // } else {
      //   this._chart.selectAll("text").remove();
      // }
    },

    _drawPolar: function(c, data, type, labels) {
      // Set Position of the container
      this._chart.attr("transform", "translate(" + c.x + "," + c.y + ")")
        .transition()
        .duration(this.options.transitionTime)
        .attr("opacity", this.options.opacity);

      // Draw polar area chart
      var radius = this.options.width / 2;
      var pie = d3.pie().sort(null);
      var arc = d3.arc().innerRadius(0);

      if (type == "angle") {
        var scale = function(d) {return radius}
        pie.value(function(d) {return d});
      } else {
        var scale = type == "radius" ? d3.scaleLinear() : d3.scalePow().exponent(0.5);
        scale.range([0, radius]);
        pie.value(function(d) {return 1});
      }
      arc.outerRadius(function(d, i) {return scale(d.data)});

      var colList = data.length == 1 ? [this.options.fillColor] : this.options.colorPalette;
      var color = d3.scaleOrdinal(colList);

      // redraw the polar chart
      var slices = this._chart.selectAll("path").data(pie(data));
      slices.enter()
        .append("path")
        .attr("class", "leaflet-clickable")
        .attr("d", arc)
        .attr("fill", function(d, i) {return color(i)})
        .each(function(d) {
          if (data.length == 1) this._current = {startAngle:d.startAngle, endAngle:d.endAngle, data:0}
          else this._current = {startAngle:d.endAngle, endAngle:d.endAngle}
        })
        .merge(slices)
        .transition()
        .duration(this.options.transitionTime)
        .attrTween("d", arcTween)
        .attr("fill", function(d, i) {return color(i)})

      slices.exit().remove();

      function arcTween(a) {
        var i = d3.interpolate(this._current, a);
        this._current = i(0);
        return function(t) {
          return arc(i(t));
        };
      }

      // Add labels if necessary
      if (labels) {
        // Label colors
        if (this.options.labelColor == "auto") {
          labelColor = function(i) {
            return tinycolor.mostReadable(color(i), ["white", "black"])._originalInput
          }
        } else {
          labelColor = function(i) {return this.options.labelColor};
        }

        function labelPositionAndSize(el, options, scale, arc, d, i, data) {
          var bbox = el._text.node().getBBox();
          var ratio = bbox.height / bbox.width;
          el._width = bbox.width;

          if (data.length > 1) {
            // chart is a pie of polar chart.
            var c = arc.centroid(d)
            el._x = c[0];
            el._y = c[1];

            // Get maximal scale so that label fits in the slice.
            var diag1 = new g.Line(c[1] - ratio * c[0], ratio);
            var diag2 = new g.Line(c[1] + ratio * c[0], -ratio);
            var limit1 = new g.Line(0, Math.tan(d.startAngle + Math.PI/2));
            var limit2 = new g.Line(0, Math.tan(d.endAngle + Math.PI/2));

            // Get all intersection points
            var intersects = [];
            intersects = intersects.concat(g.intersectionOfTwoLines(diag1, limit1));
            intersects = intersects.concat(g.intersectionOfTwoLines(diag1, limit2));
            intersects = intersects.concat(g.intersectionLineAndCircle(diag1, scale(d.data)));
            intersects = intersects.concat(g.intersectionOfTwoLines(diag2, limit1));
            intersects = intersects.concat(g.intersectionOfTwoLines(diag2, limit2));
            intersects = intersects.concat(g.intersectionLineAndCircle(diag2, scale(d.data)));

            // Compute distance between all these points and take the minimum
            var center = new g.Point(c[0], c[1]);
            var distances = intersects.map(function(x) {return g.distance(center, x)});
            var minDist = d3.min(distances);
            var actualDist = Math.sqrt( Math.pow(bbox.height / 2, 2) + Math.pow(bbox.width / 2, 2));

            el._scale = minDist / actualDist;
          } else {
            // Chart is a bubble chart.
            // Put the label at the center and scale it to fit the circle
            el._x = 0;
            el._y = 0;

            var maxHeight = scale(d.data) * 2 * Math.cos(Math.PI/2 - Math.atan(ratio))
            el._scale =  maxHeight / bbox.height;
          }
          if (isNaN(el._scale) || !isFinite(el._scale) || bbox.height * el._scale < options.labelMinSize) {
            el._scale = 0;
          }
          if (bbox.height * el._scale > options.labelMaxSize) {
            el._scale = options.labelMaxSize / bbox.height;
          }
        }

        var self = this;
        var labelsEl = this._chart.selectAll(".labels-container").data(pie(data));
        labelsEl.enter()
          .append("g")
          .attr("class", "labels-container")
          .each(function(d, i) {
            addOneLabel(this, self.options, labelColor(i));
            this._text.text(labels[i]);
            labelPositionAndSize(this, self.options, scale, arc, d, i, data);
            this._container.attr("transform", "translate(" + this._x + "," + this._y + ")");
            this._label.attr("transform", "scale(" + this._scale + ")");
          })

          .merge(labelsEl)
          .each(function(d, i) {
            var oldWidth = this._width;
            var oldScale = this._scale;
            this._text.text(labels[i]);
            this._text.attr("fill", labelColor(i));
            labelPositionAndSize(this, self.options, scale, arc, d, i, data);
            this._label
              .attr("transform", "scale(" + Math.min(oldScale, oldWidth * oldScale / this._width) + ")")
              .transition()
              .duration(self.options.transitionTime)
              .attr("transform", "scale(" + this._scale + ")");
          })
          .transition()
          .duration(self.options.transitionTime)
          .attr("transform", function(d, i) {
            return "translate(" + this._x + "," + this._y + ")";
          });

        labelsEl.exit().remove();
      } else {
        this._chart.selectAll("text").remove();
      }
    }
  });

  L.d3chart = function(center, options) {
  return new L.D3chart(center, options);
};
})();
