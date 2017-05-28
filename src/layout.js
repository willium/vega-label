import {error} from 'vega-util';

/*
Copyright (c) 2017, William Strimling.
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

  * Redistributions of source code must retain the above copyright notice, this
    list of conditions and the following disclaimer.

  * Redistributions in binary form must reproduce the above copyright notice,
    this list of conditions and the following disclaimer in the documentation
    and/or other materials provided with the distribution.

  * The name William Strimling may not be used to endorse or promote products
    derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL WILLIAM STRIMLING BE LIABLE FOR ANY DIRECT, INDIRECT,
INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE
OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF
ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

/*
  Example usage

  var labels = layout
    .data(data)
    .mark((datum) => datum.mark)
    .padding(5)
    .pivot(20)
    .line(10)
    .size([100, 100])
    .layout()
*/

var STEP = 1;

function orientation(marks) {
  var start = marks[0].bounds;
  var x1 = true;
  var x2 = true;
  var y1 = true;
  var y2 = true;

  for (var i = 0; i < marks.length; i++) {
    var m = marks[i];
    var bounds = m.bounds;
    if (bounds.x1 != start.x1) {
      x1 = false;
    }
    if (bounds.x2 != start.x2) {
      x2 = false;
    }
    if (bounds.y1 != start.y1) {
      y1 = false;
    }
    if (bounds.y2 != start.y2) {
      y2 = false;
    }
    start = bounds;
  }

  var v = x1 || x2;
  var h = y1 || y2;

  if (v && h) {
    return 'center';
  } else if (v) {
    return 'vertical';
  } else if (h) {
    return 'horizontal';
  } else {
    return 'center';
  }
}

function collision(bounds, collections) {
  var i = 0;

  // for (; i < collections.marks.length; i++) {
  //   var mark = collections.marks[i];
  //   // TODO use marks borders (path maybe? how to deal with rect?)
  // }

  // i = 0;
  for (; i < collections.labels.length; i++) {
    var label = collections.labels[i];
    if (!(label.bounds.x1 > bounds.x2 || label.bounds.x2 < bounds.x1 || label.bounds.y1 > bounds.y2 || label.bounds.y2 < bounds.y1)) {
      return true;
    }
  }
  return false;
}

// methods for placement
function rect(label) {
  var mark = label.datum;
  var markWidth = mark.bounds.x2 - mark.bounds.x1;
  var markHeight = mark.bounds.y2 - mark.bounds.y1;
  var x, y, s;
  switch (orientation(label.collections.marks)) {
    case 'center':
      // attempt to place at center
      x = mark.bounds.x1 + markWidth / 2;
      y = mark.bounds.y1 + markHeight / 2;
      // if can't place at center, place above center if it fits
      if (markWidth > label.markWidth && markHeight > label.markWidth) {
        label.x = x;
        label.y = y;
      // place above if it can't fit
      } else {
        y = mark.bounds.y1 - label.height - label.config.padding;
        label.x = x;
        label.y = y;
      }
      // TODO: if can't do that, place below, then right, then left
      return label;
    case 'vertical':
      if (label.height + label.config.padding * 2 < markHeight && label.width + label.config.padding * 2 < markWidth) {
        label.x = mark.bounds.x2 - label.width - label.config.padding;
        label.opacity = 1.0;
        return label;
      }

      s = 0;
      do {
        label.x = mark.bounds.x2 + label.config.padding + s * STEP;
        s++;
      } while (collision(label.bounds, label.collections) && label.config.padding + s * STEP < label.config.line);

      if (!collision({
        x1: label.x,
        x2: label.x + label.width,
        y1: label.bounds.y1,
        y2: label.bounds.y2
      }, label.collections)) {
        label.opacity = 1.0;
        // TODO: add line?
      }
      return label;
    case 'horizontal':
      if (label.height + label.config.padding * 2 < markHeight && label.width + label.config.padding * 2 < markWidth) {
        label.y = mark.bounds.y1 + label.height + label.config.padding;
        label.opacity = 1.0;
        return label;
      }

      s = 0;
      do {
        // keep trying
        label.y = mark.bounds.y1 - label.height - label.config.padding - s * STEP;
        s++;
      } while (collision(label.bounds, label.collections) && label.config.padding + s * STEP < label.config.line);

      if (!collision({
        x1: label.bounds.x1,
        x2: label.bounds.y1,
        y1: label.y,
        y2: label.y + label.height
      }, label.collections)) {
        label.opacity = 1.0;
        // TODO: add line?
      }

      return label;
  }
}

function poly(label) {
  error(label);
  // find inscribed rectangles s.t. label.area + padding^2 + padding * label.width + padding * label.height <= rect.area, track pivot
  // if best rectangle with rect.angle < pivot
    // place label @ center of rectangle with sample angle
  // else
    // put label above center or largest recentangle,
    // while distance from center < line.length
      // try placing label at distance, draw line
      // move up if not
    // try 45 degree alternatives from center
}

function arc(label) {
  error(label);
}

function line(label) {
  error(label);
}

function point(label) {
  error(label);
}

function position(label) {
  switch (label.mark.mark.marktype) {
  case 'rect':
    return rect(label);
  case 'line':
    return line(label);
  case 'point':
    return point(label);
  case 'arc':
   return arc(label); // or maybe poly
  default:
    return poly(label);
  }
}

export default function() {
  var labels = {},
    data = [],
    line = 0,
    padding = 0,
    pivot = 0,
    size = [256, 256],
    mark;

  labels.layout = function() {
    var _marks = [];
    var _labels = [];

    var labels = data.map(function (l) {
      var m = mark(l);
      _marks.push(m);
      _labels.push(l);
      return {
        collections: {
          marks: _marks,
          labels: _labels
        },
        config: {
          padding: padding,
          pivot: pivot,
          line: line
        },
        mark: m,
        line: null, // [[x1, y1], [x2, y2]] of line connecting label to mark
        opacity: 0.0, // is label visible
        x: 0, // x location of label
        y: 0, // y location of label
        width: +l.bounds.x2 - +l.bounds.x1,
        height: +l.bounds.y2 - +l.bounds.y1,
        angle: 0, // angle to display label at
        datum: l
      }
    }).sort(function smallest(a, b) {
      return a.width - b.width;
    });

    return labels.map(position);
  };

  labels.data = function (_data) {
    if (!arguments.length) return data;

    data = _data;
    return labels;
  };

  labels.mark = function (_mark) {
    if (!arguments.length) return mark;

    mark = callable(_mark);
    return labels;
  };

  labels.padding = function (_padding) {
    if (!arguments.length) return padding;

    padding = _padding;
    return labels;
  };

  labels.size = function (_size) {
    if (!arguments.length) return size;

    size = [+_size[0], +_size[1]];
    return labels;
  };

  labels.pivot = function (_pivot) {
    if (!arguments.length) return pivot;

    pivot = _pivot;
    return labels;
  };

  labels.line = function (_line) {
    if (!arguments.length) return line;

    line = _line;
    return labels;
  };

  return labels;
}

// convert arg into callable function
function callable (_arg) {
  if (typeof _arg === "function") return _arg;

  return function () {
    return _arg;
  }
}
