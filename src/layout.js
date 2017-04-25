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

/* Example usage

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

export default function() {
  var layout = {};

  layout.layout = function () {

  };

  layout.data = function () {

  };

  layout.label = function () {

  };

  layout.mark = function () {

  };

  layout.baseline = function () {

  };

  layout.padding = function () {

  };

  layout.extent = function () {
    return arguments.length ? (extent = [+_[0], +_[1]], layout) : extent;
  };

  layout.rotation = function () {

  };

  layout.line = function () {

  };

  return layout;
};

// convert arg into callable function
function datum(arg) {
  if (typeof arg === "function") {
    return arg;
  } else {
    return function () {
      return arg;
    };
  }
}