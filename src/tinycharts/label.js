(function() {
  'use strict';

  var d3 = require("d3");
  var g = require("./geometry.js")

  module.exports = Label;

  function Label(el, style, color, minSize, maxSize) {
    this._el = el;
    this._minSize = minSize;
    this._maxSize = maxSize;
    this._container = d3.select(el);
    this._label = this._container.append("g")
      .attr("class", "label");

    this._text = this._label.append("text")
      .attr("dy", "0.35em")
      .attr("text-anchor", "middle")
      .attr("style", style || "")
      .attr("fill", color || "black");
  }

  // Size of the label before scaling
  Label.prototype.innerSize = function() {
    return this._text.node().getBBox();
  }

  Label.prototype.size = function() {
    var bbox = this.innerSize();
    return {
      width: bbox.width * this._scale,
      height: bbox.height * this._scale
    }
  }

  Label.prototype.updateText = function(newText) {
    // New label should fit in the old bounding bbox
    var oldSize = this.size();
    this._text.text(newText);
    var newSize = this.size();

    var scale = Math.min(
      oldSize.width / newSize.width,
      oldSize.height / newSize.height
    );
    this.updateScale(this._scale * scale, 0);
    return this;
  }

  Label.prototype.updatePosition = function(x, y, transitionTime) {
    this._container
      .transition()
      .duration(transitionTime || 0)
      .attr("transform", "translate(" + x + "," + y + ")");
      return this;
  }

  Label.prototype.updateScale = function(newScale, transitionTime) {
    if (!newScale || isNaN(newScale) || !isFinite(newScale)) {
      newScale = 0;
    }
    var newHeight = this.innerSize().height * newScale;
    if (this._minSize && newHeight < this._minSize) {
      newScale = 0;
    }
    if (this._maxSize && newHeight > this._maxSize) {
      newScale = this._maxSize / this.innerSize().height;
    }
    this._label
      .transition()
      .duration(transitionTime || 0)
      .attr("transform", "scale(" + newScale + ")");
    this._scale = newScale;

    return this;
  }

  Label.prototype.fillRect = function(x, y, width, height, padding,
                                      hAlign, vAlign,
                                      transitionTime) {
      var bbox = this.innerSize();
      this.updateScale(Math.min(
        (width - 2 * padding) / bbox.width,
        (Math.abs(height)) / bbox.height
      ), transitionTime);

      var lsize = this.size();
      var lx, ly;
      switch(vAlign) {
        case "top":
          ly = y + lsize.height / 2;
          break;
        case "center":
          ly = y + (height) / 2;
          break;
        case "bottom":
          ly = y + height - lsize.height / 2;
      }

      switch(hAlign) {
        case "left":
          lx = x + padding + lsize.width / 2;
          break;
        case "center":
          lx = x + width / 2;
          break;
        case "right":
          lx = x + width - padding - lsize.width / 2;
      }

      this.updatePosition(lx, ly, transitionTime);

    return this;
  }

  Label.prototype.fillCircle = function(radius, transitionTime) {
    this.updatePosition(0, 0, transitionTime);

    var bbox = this.innerSize();
    var ratio = bbox.height / bbox.width;

    var maxHeight = radius * 2 * Math.cos(Math.PI/2 - Math.atan(ratio))
    this.updateScale(maxHeight / bbox.height, transitionTime);
  }

  Label.prototype.fillSlice = function(arc, radius, d, transitionTime) {
    var c = arc.centroid(d);
    this.updatePosition(c[0], c[1], transitionTime);

    var bbox = this.innerSize();
    var ratio = bbox.height / bbox.width;

    // Get maximal scale so that label fits in the slice.
    var diag1 = new g.Line(c[1] - ratio * c[0], ratio);
    var diag2 = new g.Line(c[1] + ratio * c[0], -ratio);
    var limit1 = new g.Line(0, Math.tan(d.startAngle + Math.PI/2));
    var limit2 = new g.Line(0, Math.tan(d.endAngle + Math.PI/2));

    // Get all intersection points
    var intersects = [];
    intersects = intersects.concat(g.intersectionOfTwoLines(diag1, limit1));
    intersects = intersects.concat(g.intersectionOfTwoLines(diag1, limit2));
    intersects = intersects.concat(g.intersectionLineAndCircle(diag1, radius));
    intersects = intersects.concat(g.intersectionOfTwoLines(diag2, limit1));
    intersects = intersects.concat(g.intersectionOfTwoLines(diag2, limit2));
    intersects = intersects.concat(g.intersectionLineAndCircle(diag2, radius));

    // Compute distance between all these points and take the minimum
    var center = new g.Point(c[0], c[1]);
    var distances = intersects.map(function(x) {return g.distance(center, x)});
    var minDist = d3.min(distances);
    var actualDist = Math.sqrt( Math.pow(bbox.height / 2, 2) + Math.pow(bbox.width / 2, 2));

    this.updateScale(minDist / actualDist, transitionTime);
  }
}());
