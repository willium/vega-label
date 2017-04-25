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
    .line({length: 10, angle: 45})
    .extent([100, 100])
    .layout()
*/

var ANGLE = 45;
var PADDING = 10;

// methods for placement
function TOP(d) {
  // calculate marks dimensions (it should be a rect)
  // if d.label width + d.padding * 2 < d.mark's width
    // if d.label height + d.padding * 2 < d.mark's height
      // place label at top, inside of mark (w.r.t. padding)
    // else place d.label above mark w.r.t. padding
  // else attempt to place label above mark @ padding
    // while occluding another label or mark, and not higher than line.length, move up
    // add label, add line connecting label
}

function RIGHT(d) {
  // calculate marks dimensions (it should be a rect)
  // if d.label height + d.padding * 2 < d.mark's height
    // if d.label width + d.padding * 2 < d.mark's width
      // place label at right, inside of mark (w.r.t. padding)
    // else place d.label right of mark w.r.t. padding
  // else attempt to place label right of mark @ padding
    // while occluding another label or mark, and not higher than line.length, move right
    // add label, add line connecting label
}

function INSIDE(d) {
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

function ARC(d) {

}

function LINE(d) {

}

function SCATTER(d) {

}

function position(label) {
  // if mark is a rect
    // determine orientation through l.collections.marks
    // if can't determine orientation use CENTER
    // if orientation = vertical, use RIGHT
    // if orientation = horizontal, use TOP
  // if mark is a polygon/shape (area, geo)
    // use INSIDE
  // if mark is an arc
    // use ARC (fallback to area)
  // if mark is a line
    // use LINE
  // if mark is a point
    // use SCATTER
}

export default function() {
  var layout = {},
      data = [],
      line = null,
      orient = null,
      padding = PADDING,
      label, mark, extent, pivot, line;

  layout.layout = function () {
    var _marks = [];
    var _labels = [];

    var Labels = data.map(function (d) {
      var m = mark(d);
      var l = label(d);
      l = l[+l[0], +l[1]]
      _marks.push(m);
      _labels.push(m);
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
        angle: 0 // angle to display label at
      }
    }).sort(function smallest(a, b) {
      return a.width - b.width;
    });

    return Labels.map(position);
  };

  layout.data = function (d) {
    if (!arguments.length) return data;

    data = d;
    return layout;
  };

  layout.label = function (d) {
    if (!arguments.length) return label;

    label = callable(d);
    return layout;
  };

  layout.mark = function (d) {
    if (!arguments.length) return mark;

    mark = callable(d);
    return layout;
  };

  layout.padding = function (d) {
    if (!arguments.length) return padding;

    padding = d;
    return layout;
  };

  layout.extent = function (d) {
    if (!arguments.length) return extent;

    extent = [+d[0], +d[1]];
    return layout;
  };

  layout.pivot = function (d) {
    if (!arguments.length) return pivot;

    pivot = d;
    return layout;
  };

  layout.line = function (d) {
    if (!arguments.length) return line;

    if (typeof d !== "object") {
      line = {
        length: d,
        angle: ANGLE
      };
    } else if (!d.hasOwnProperty(angle) || d.angle == null) {
      line = d;
      line.angle = ANGLE;
    } else {
      line = d;
    }

    if (!Array.isArray(line.angle)) {
      var iterator = line.angle;
      line.angle = [];
      for (var i = 0; i < 360; i += iterator) {
        line.angle.push(i);
      }
    }

    return layout;
  };

  return layout;
};

// convert arg into callable function
function callable(d) {
  if (typeof d === "function") return d;

  return function () {
    return d;
  }
}
