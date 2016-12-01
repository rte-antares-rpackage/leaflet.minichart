(function() {

  function toArray(x) {
    if (x.constructor !== Array) x = [x];
    return x;
  }

  function roundLabels(x, precision) {
    x = toArray(x);
    var res = [];
    for (var i = 0; i < x.length; i++) {
      if (precision == 0) res.push(x[i]);
      else res.push(x[i].toPrecision(precision));
    }
    return res;
  }

  L.D3chart = L.CircleMarker.extend({
    options: {
      type: "bar",
      data: [1],
      maxValues: [1],
      colors: d3.schemeCategory10,
      width: 60,
      height: 60,
      opacity: 1,
      showLabels: false,
      labelStyle: "fill:white;font-size:8px;",
      labelPrecision: 0,
      labelText: null,
      transitionTime: 750
    },

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
      this._container.setAttribute("class", "leaflet-zoom-hide");

      // create the svg element that holds the chart
      this._chart = d3.select(this._container).append("g");

      map.on('viewreset', this._reset, this);
      this._reset(true);
    },

    onRemove: function() {
      // remove layer's DOM elements and listeners
      L.CircleMarker.prototype.onRemove.call(this, map);
      map.off('viewreset', this._reset, this);
    },

    setOptions: function(options) {
      var newChart = options.type && options.type != this.options.type;
      L.Util.setOptions(this, options);
      this._reset(newChart);
    },

    _reset: function(newChart) {
      // If necessary remove all elements of the previous chart
      if (newChart) {
        this._chart.selectAll("*").remove();
      }

      // Coordinates of the center in the svg frame
      var c = this._map.latLngToLayerPoint(this._center);

      // prepare data
      this.options.data = toArray(this.options.data);
      this.options.maxValues = toArray(this.options.maxValues);

      var max = this.options.maxValues;
      var data = this.options.data;
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
        var labels = roundLabels(data, this.options.labelPrecision)
      } else {
        var labels = this.options.labelText;
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
      if (newChart) {
        // Draw a gray line that represent the 0
        this._chart.append("line")
          .attr("x1", - 3)
          .attr("x2", this.options.width + 3)
          .attr("style", "stroke:#999;stroke-width:1;");
      }

      // D3 scale function
      var scale = d3.scaleLinear()
        .domain([0, 1])
        .range([0, this.options.height]);

      // D3 colors function
      var color = d3.scaleOrdinal(this.options.colors);

      var barWidth = this.options.width / data.length;

      // Set the position of the container
      this._chart
        .attr("transform", "translate(" + (c.x - this.options.width / 2) + "," + (c.y) + ")")
        .transition()
        .duration(this.options.transitionTime)
        .attr("opacity", this.options.opacity);

      // Display/ update data
      var bar = this._chart.selectAll("rect").data(data);

      bar.enter()
        .append("rect")
        .attr("class", "leaflet-clickable")
        .attr("x", function(d, i) {return (i + 1) * barWidth})
        .attr("y", function(d) {return 0})
        .attr("width", 0)
        .merge(bar)
        .transition()
        .duration(this.options.transitionTime)
        .attr("width", barWidth)
        .attr("x", function(d, i) {return i * barWidth})
        .attr("y", function(d) {return d >= 0? -scale(d) : 0;})
        .attr("height", function(d) {return Math.abs(scale(d))})
        .attr("fill", function(d, i) {return color(i)});

      bar.exit()
        .transition()
        .duration(this.options.transitionTime)
        .attr("x", function(d, i) {return i * barWidth})
        .attr("y", 0)
        .attr("width", 0)
        .attr("height", 0)
        .remove();

      // labels
      if (labels) {
        var labelsEl = this._chart.selectAll("text").data(data);

        labelsEl.enter()
          .append("text")
          .attr("text-anchor", "middle")
          .attr("alignment-baseline", function(d) {return d > 0? "before-edge": "after-edge"})
          .attr("opacity", 0)
          .attr("x", function(d, i) {return (i + 0.5) * barWidth})
          .attr("y", function(d) {return -scale(d)})
          .attr("style", this.options.labelStyle)
          .merge(labelsEl)
          .transition()
          .duration(this.options.transitionTime)
          .attr("alignment-baseline", function(d) {return d > 0? "before-edge": "after-edge"})
          .text(function(d, i) {return labels[i]})
          .attr("opacity", 1)
          .attr("x", function(d, i) {return (i + 0.5) * barWidth})
          .attr("y", function(d) {return -scale(d)})

        labelsEl.exit().remove();
      } else {
        this._chart.selectAll("text").remove();
      }
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
        pie.value(function(d) {return d});
        arc.outerRadius(function(d) {return radius});
      } else {
        var scale = type == "radius" ? d3.scaleLinear() : d3.scalePow().exponent(0.5);
        scale.range([0, radius]);
        pie.value(function(d) {return 1});
        arc.outerRadius(function(d, i) {return scale(d.data)});
      }

      var color = d3.scaleOrdinal(this.options.colors);

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
        var labelsEl = this._chart.selectAll("text").data(pie(data));

        labelsEl.enter()
          .append("text")
          .attr("text-anchor", "middle")
          .attr("alignment-baseline", "middle")
          .attr("opacity", 0)
          .attr("transform", function(d) {
            if (data.length == 1) return "translate(0, 0)"
            else return "translate(" + arc.centroid(d) + ")"
          })
          .attr("style", this.options.labelStyle)
          .merge(labelsEl)
          .text(function(d, i) {return labels[i]})
          .transition()
          .duration(this.options.transitionTime)
          .attr("opacity", 1)
          .attr("transform", function(d) {
            if (data.length == 1) return "translate(0, 0)"
            else return "translate(" + arc.centroid(d) + ")"
          })

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
