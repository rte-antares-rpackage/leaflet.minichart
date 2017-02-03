(function() {
  'use strict';

  module.exports.Point = Point;
  module.exports.Line = Line;
  module.exports.intersectionOfTwoLines = intersectionOfTwoLines
  module.exports.intersectionLineAndCircle = intersectionLineAndCircle
  module.exports.distance = distance

  function Point(x, y) {
    this.x = x;
    this.y = y;
  }

  function Line(a, b) {
    this.a = a;
    this.b = b
  }
  Line.prototype.getY = function(x) {
    return this.a + this.b * x;
  }

  function intersectionOfTwoLines(l1, l2) {
    if (l1.b == l2.b) return []
    return [new Point(
      (l2.a - l1.a) / (l1.b - l2.b),
      (l1.b * l2.a - l1.a * l2.b) / (l1.b - l2.b)
    )]
  }

  function intersectionLineAndCircle(l, r) {
    var x = solveEqSecondDegree(l.b * l.b + 1, 2 * l.a * l.b, l.a * l.a - r * r);
    return x.map(function(x) {return new Point(x, l.getY(x))});
  }

  function solveEqSecondDegree(a, b, c) {
    var det = b * b - 4 * a * c
    if (det < 0) return [];
    if (det == 0) return [(- b) / (2 * a)];
    else return [
      (-b - Math.sqrt(det)) / (2 * a),
      (-b + Math.sqrt(det)) / (2 * a)
    ]
  }

  function distance(p1, p2) {
    return Math.sqrt( Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2))
  }
}());
