import layout from './layout';
import {Transform} from 'vega-dataflow';
import {boundMark} from 'vega-scenegraph';
import {inherits, isFunction} from 'vega-util';

var output = ['x', 'y', 'angle'];
var params = ['pivot', 'padding', 'size', 'line'];

export default function Label(params) {
  Transform.call(this, layout(), params);
}

var prototype = inherits(Label, Transform);

prototype.transform = function (_, pulse) {
  function modp(param) {
    var p = _[param];
    return isFunction(p) && pulse.modified(p.fields);
  }

  var mod = _.modified();
  if (!(mod || pulse.changed(pulse.ADD_REM) || params.some(modp))) return;

  var layout = this.value,
      as = _.as || output;

  var data = pulse.materialize(pulse.SOURCE).source;
  data.forEach(function (d) {
    d[as[0]] = NaN;
    d[as[1]] = NaN;
    d[as[2]] = 0;
    d.bounds = boundMark(d.mark);
  });

  // configure layout
  var labels = layout
    .data(data)
    .mark(function (d) {
      return d.datum;
    })
    .pivot(_.pivot || 15)
    .padding(_.padding || 5)
    .size(_.size || [500, 500])
    .line(_.line || 10)
    .layout();

  var size = layout.size(),
      dx = size[0] >> 1,
      dy = size[1] >> 1,
      i = 0,
      n = labels.length,
      label, d;

  for (; i<n; ++i) {
    label = labels[i];
    d = label.datum;
    d[as[0]] = label.x + dx;
    d[as[1]] = label.y + dy;
    d[as[2]] = label.angle;
  }

  return pulse.reflow(mod).modifies(as);
};
