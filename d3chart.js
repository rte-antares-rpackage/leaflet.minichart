(function() {
  
  function toArray(x) {
    if (x.constructor !== Array) x = [x];
    return x;
  }
  
  L.D3chart = L.CircleMarker.extend({
    options: {
      type: "bar",
      data: [1],
      maxValues: [1],
      colors: d3.schemeCategory10,
      width: 40,
      height: 40,
      opacity: 1,
      label: false,
      labelStyle: ""
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
      var data = toArray(this.options.data);
      var max = toArray(this.options.maxValues);
      if(max.length !== 1 && max.length != data.length) {
        throw new Error("'maxValues' should be a single number or have same length as 'data'");
      }
      for (var i = 0; i < data.length; i++) {
        data[i] = data[i] / max[i % max.length];
      }
      
      switch(this.options.type) {
        case "bar":
          this._drawBar(c, data, newChart);
          break;
        case "pie":
          this._drawPolar(c, data, "angle");
          break;
        case "polar-radius":
          this.drawPolar(c, data, "radius");
          break;
        case "polar-area":
          this.drawPolar(c, data, "area");
          break;
      }
    },
    
    _drawBar: function(c, data, newChart) {
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
        .duration(750)
        .attr("opacity", this.options.opacity);
      
      // Display/ update data
      var bar = this._chart.selectAll("rect").data(data);
    
      bar.enter()
        .append("rect")
        .attr("x", function(d, i) {return (i + 1) * barWidth})
        .attr("y", function(d) {return 0})
        .attr("width", 0)
        .merge(bar)
        .transition()
        .duration(750)
        .attr("width", barWidth)
        .attr("x", function(d, i) {return i * barWidth})
        .attr("y", function(d) {return d >= 0? -scale(d) : 0;})
        .attr("height", function(d) {return Math.abs(scale(d))})
        .attr("fill", function(d, i) {return color(i)});
        
      bar.exit()
        .transition()
        .duration(750)
        .attr("x", function(d, i) {return i * barWidth})
        .attr("y", 0)
        .attr("width", 0)
        .attr("height", 0)
        .remove();
    }
  });
  
  L.d3chart = function(center, options) {
  return new L.D3chart(center, options);
};
})();
