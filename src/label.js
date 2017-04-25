import {Transform} from 'vega-dataflow';
import {inherits, isFunction} from 'vega-util';

var output = ['x', 'y', 'align', 'output', 'color', 'orientation'];
var params = ['ref', 'anchor', 'offset'];

var ANCHORS = [
	'center',
	'top-left',
	'top',
	'top-right',
	'right',
	'bottom-right',
	'bottom',
	'bottom-left',
	'left'
]

export default function Label(params) {
  Transform.call(this, null, params);
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
      as     = _.as || output,
      anchor = _.anchor || 'top',
      offset = _.offset || 10,
      align  = 'center';

  if (anchor.startsWith('left')) {
    align = 'right'
  } else if (anchor.startsWith('right')) {
     align = 'left'
  }

  var data = pulse.materialize(pulse.SOURCE).source;
  data.forEach(function(t) {
    t[as[0]] = NaN;
    t[as[1]] = NaN;
    t[as[3]] = 0;
  });

  var point = {
    x: 1,
    y: 1
  };

  var rect = {
    x: 1,
    y: 1,
    x2: 1,
    y2: 1
  };

  var path = {
    string: "PATH", // line, arc
    horizon: "line" // line symbolizing the horizon
  }

  var shape = "SHAPE";

  var datum = {
    label: [100, 100], // width, height
    baseline: path | null,
    mark: point | rect | path | shape
  }

  var data = [datum, datum, /*... ,*/ datum] // arry of rects, point

  // configure layout
  var labels = layout
    .data(data)
    // label source shape (bounding box)
    .label(function (datum) {
      // label's bounding box
      return datum.label;
    }
    // path, point, rect being labeled
    .mark(function (datum) {
      // mark path or point or rect. infer marktype
      return datum.mark;
    })
    .pivot(20) // degrees allowed for label to tilt (area chart)
    // spacing around label
    .padding(5)
    // allow for leading lines between labels and target
    .extent([width, height]) // width and height we can place labels in
    .line({
      // max length of lines
      length: 10,
      // number corresponds to step ie. 45 = [0, 45, 90, 135, 180, 225, 270, 315, 360].
      angle: 45
    })
    .layout()

  var size = layout.size(),
      dx = size[0] >> 1,
      dy = size[1] >> 1,
      i = 0,
      n = words.length,
      w, t;

  for (; i<n; ++i) {
    w = words[i];
    t = w.datum;
    t[as[0]] = w.x + dx;
    t[as[1]] = w.y + dy;
    t[as[2]] = w.font;
    t[as[3]] = w.size;
    t[as[4]] = w.style;
    t[as[5]] = w.weight;
    t[as[6]] = w.rotate;
  }

  return pulse.reflow(mod).modifies(as);
};
