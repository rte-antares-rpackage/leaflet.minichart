// Copyright © 2016 RTE Réseau de transport d’électricité
(function() {
  var d3 = require("d3");
  var prettyNumbers = require("./prettyNumbers.js");
  var Barchart = require("./tinycharts/Barchart.js");
  var Polarchart = require("./tinycharts/Polarchart.js");

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
      labelClass: "leaflet-clickable",
      shapeClass: "leaflet-clickable"
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
          this._drawPolar(c, dataScaled, newChart, labels, "pie");
          break;
        case "polar-radius":
          this._drawPolar(c, dataScaled, newChart, labels, "radius");
          break;
        case "polar-area":
          this._drawPolar(c, dataScaled, newChart, labels, "area");
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

      if (newChart === true) {
        this._barchart = new Barchart(this._chart.node(), data, opts);
      }
      this._chart
        .attr("transform", "translate(" + (c.x - opts.width / 2) + "," + (c.y - opts.height / 2) + ")")
        .transition()
        .duration(opts.transitionTime)
        .attr("opacity", opts.opacity);
      this._barchart.update(data, opts);
    },

    _drawPolar: function(c, data, newChart, labels, type) {
      var opts = JSON.parse(JSON.stringify(this.options));
      opts.type = type;
      opts.colors = opts.colorPalette;
      opts.maxValue = 1;
      opts.labels = labels;

      if (newChart === true) {
        this._polarchart = new Polarchart(this._chart.node(), data, opts);
      }
      this._chart
        .attr("transform", "translate(" + (c.x - opts.width / 2) + "," + (c.y - opts.width / 2) + ")")
        .transition()
        .duration(opts.transitionTime)
        .attr("opacity", opts.opacity);
      this._polarchart.update(data, opts);
    }
  });

  L.d3chart = function(center, options) {
  return new L.D3chart(center, options);
};
})();
