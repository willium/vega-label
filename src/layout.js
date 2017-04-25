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
    .baseline((datum) => datum.baseline)
    .padding(5)
    .rotation(20)
    .line({length: 10, angle: 45})
    .extent([100, 100])
    .layout()
*/

var ANGLE = [0, 45, 90, 135, 180, 225, 270, 315, 360];

export default function() {
  var layout = {};

  layout.layout = function () {

  };

  layout.data = function (_data) {
    if (!arguments.length) {
      return data;
    }

    data = _data;
    return layout;
  };

  layout.label = function (_label) {
    if (!arguments.length) {
      return label;
    }

    label = callable(_label);
    return layout;
  };

  layout.mark = function (_mark) {
    if (!arguments.length) {
      return mark;
    }

    mark = callable(_mark);
    return layout;
  };

  layout.baseline = function (_baseline) {
    if (!arguments.length) {
      return baseline;
    }

    baseline = callable(_baseline);
    return layout;
  };

  layout.padding = function (_padding) {
    if (!arguments.length) {
      return padding;
    }

    padding = _padding;
    return layout;
  };

  layout.extent = function (_extent) {
    if (!arguments.length) {
      return extent;
    }

    extent = [+_extent[0], +_extent[1]];
    return layout;
  };

  layout.rotation = function (_rotation) {
    if (!arguments.length) {
      return rotation;
    }

    rotation = _rotation;
    return layout;
  };

  layout.line = function (_line) {
    if (!arguments.length) {
      return line;
    }

    if (typeof _line !== "object") {
      line = {
        length: _line,
        angle: ANGLE
      };
    } else if (!_line.hasOwnProperty(angle) || _line.angle == null) {
      line = _line;
      line.angle = ANGLE;
    } else if (!Array.isArray(_line.angle)) {
      line = _line;
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
function callable(_callable) {
  if (typeof _callable !== "function") {
    return function () {
      return arg;
    };
  }
  return _callable;
}