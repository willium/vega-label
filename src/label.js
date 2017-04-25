import layout from './layout';
import {transforms, Transform} from 'vega-dataflow';
import {inherits, isFunction, truthy} from 'vega-util';

var output = ['x', 'y', 'angle'];
var params = [];

export default function Label(params) {
  Transform.call(this, layout(), params);
}

var prototype = inherits(Label, Transform);

prototype.transform = function(_, pulse) {
  function modp(param) {
    var p = _[param];
    return isFunction(p) && pulse.modified(p.fields);
  }

  var mod = _.modified();
  if (!(mod || pulse.changed(pulse.ADD_REM) || params.some(modp))) return;

  var layout = this.value,
      as = _.as || output;

  var data = pulse.materialize(pulse.SOURCE).source;
  data.forEach(function(t) {
    t[as[0]] = NaN;
    t[as[1]] = NaN;
    t[as[2]] = 0;
  });

  // configure layout
  var labels = layout
    .data(data)
    .label(function (datum) {
      return datum.label;
    })
    .mark(function (datum) {
      return datum.mark;
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
      label, t;

  for (; i<n; ++i) {
    label = labels[i];
    t = label.datum;
    t[as[0]] = label.x + dx;
    t[as[1]] = label.y + dy;
    t[as[2]] = label.angle;
  }

  return pulse.reflow(mod).modifies(as);
};

function extent(size, pulse) {
  var e = new transforms.Extent();
  e.transform({field: size, modified: truthy}, pulse);
  return e.value;
}