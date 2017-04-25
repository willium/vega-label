# vega-label
Label layout algorithm for Vega dataflows.

## line
- prefer 90, 45, degrees
- handle overlap (consider double outset stack)
- constant for how long a tail can possibly be (A/B test)

### rect
1. determine orient
2. if vertical, right most; if horizontal top most
3. if not possible, outset from right/top
4. if stacked, outset from group, need line

### line
1. try longest segment, starting from right
2. consider flag for points individually (or would you make invisible points?)
### area
1. largest internal rect. Otherwise, find place, use tail

### arc
1. use angle to determine orient relatively
2. position at top of pie (crust)
3. use line?

### scatter
1. simulated annealing
2. use line

### geo
1. similar to area


//  var point = {
//     x: 1,
//     y: 1
//   };

//   var rect = {
//     x: 1,
//     y: 1,
//     x2: 1,
//     y2: 1
//   };

//   var path = {
//     string: "PATH", // line, arc
//     horizon: "line" // line symbolizing the horizon
//   }

//   var shape = "SHAPE";

//   var datum = {
//     label: [100, 100], // width, height
//     baseline: path | null,
//     mark: point | rect | path | shape
//   }
