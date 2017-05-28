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
    .label((datum) => datum.label)
    .mark((datum) => datum.mark)
    .padding(5)
    .pivot(20)
    .line(10)
    .size([100, 100])
    .layout()
*/

function orientation(marks) {
  var start = marks[0].bounds;
  var x1 = true;
  var x2 = true;
  var y1 = true;
  var y2 = true;

  marks.forEach(function (m) {
    var bounds = marks[0].bounds;
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
  });

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

// methods for placement
function RECT(label) {
  var labelWidth = label.bounds.x2 - label.bounds.x1;
  var labelHeight = label.bounds.y2 - label.bounds.y1;
  var mark = label.datum;
  var orientation = orientation(label.collections.marks);
  switch (orientation) {
    case 'center':
      // attempt to place at center
      var markWidth = mark.bounds.x2 - mark.bounds.x1;
      var markHeight = mark.bounds.y2 - mark.bounds.y1;
      if (markWidth > labelWidth && markHeight > labelWidth) {
        // if can't place at center, place above center if it fits
        var x = mark.bounds.x1 + markWidth / 2;
        var y = mark.bounds.y1 + markHeight / 2;
        label.x = x;
        label.y = y;
      } else {
        // place above if it can't fit
        var x = mark.bounds.x1 + markWidth / 2;
        var y = min(mark.bounds.y1, mark.bounds.y2) - labelHeight / 2;
        label.x = x;
        label.y = y;
      }
      // if can't do that, place below, then right, then left
      // TODO
      break;
    case 'vertical':
      // calculate marks dimensions (it should be a rect)
      // if d.label height + d.padding * 2 < d.mark's height
        // if d.label width + d.padding * 2 < d.mark's width
          // place label at right, inside of mark (w.r.t. padding)
        // else place d.label right of mark w.r.t. padding
      // else attempt to place label right of mark @ padding
        // while occluding another label or mark, and not higher than line.length, move right
        // add label, add line connecting label
      break;
    case 'horizontal':
      // calculate marks dimensions (it should be a rect)
      // if d.label width + d.padding * 2 < d.mark's width
        // if d.label height + d.padding * 2 < d.mark's height
          // place label at top, inside of mark (w.r.t. padding)
        // else place d.label above mark w.r.t. padding
      // else attempt to place label above mark @ padding
        // while occluding another label or mark, and not higher than line.length, move up
        // add label, add line connecting label
      break
  }
}

function POLY(label) {
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

function ARC(label) {

}

function LINE(label) {

}

function POINT(label) {

}

function position(label) {
  switch (label.mark.mark.marktype) {
  case 'rect':
    return RECT(label);
  case 'line':
    return LINE(label);
  case 'point':
    return POINT(label);
  case 'arc':
   return ARC(label); // or maybe poly
  default:
    return POLY(label);
  }
  // error(label);
}

export default function() {
  var labels = {},
    data = [],
    line = 0,
    padding = 0,
    pivot = 0,
    size = [256, 256],
    label, mark;

  labels.layout = function () {
    var _marks = [];
    var _labels = [];

    var labels = data.map(function (d) {
      var m = mark(d);
      var l = label(d);
      l = l[+l[0], +l[1]]
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
        width: +l[0],
        height: +l[1],
        angle: 0, // angle to display label at
        datum: d
      }
    }).sort(function smallest(a, b) {
      return a.width - b.width;
    });

    return labels.map(position);
  };

  labels.data = function (d) {
    if (!arguments.length) return data;

    data = d;
    return labels;
  };

  labels.label = function (d) {
    if (!arguments.length) return label;

    label = callable(d);
    return labels;
  };

  labels.mark = function (d) {
    if (!arguments.length) return mark;

    mark = callable(d);
    return labels;
  };

  labels.padding = function (d) {
    if (!arguments.length) return padding;

    padding = d;
    return labels;
  };

  labels.size = function (d) {
    if (!arguments.length) return size;

    size = [+d[0], +d[1]];
    return labels;
  };

  labels.pivot = function (d) {
    if (!arguments.length) return pivot;

    pivot = d;
    return labels;
  };

  labels.line = function (d) {
    if (!arguments.length) return line;

    line = d;
    return labels;
  };

  return labels;
}

// convert arg into callable function
function callable(d) {
  if (typeof d === "function") return d;

  return function () {
    return d;
  }
}
