(function() {
  'use strict';

  var d3 = require("d3");

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

  Label.prototype.fillRect = function(x, y, width, height, verticalAlign, horizontalAlign) {

    return this;
  }
}());
