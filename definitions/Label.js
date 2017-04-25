export default {
  "type": "Label",
  "metadata": {"modifies": true},
  "params": [
    {"name": "ref", "type": "string"},
    {"name": "offset", "type": "number", "default": 10},
    {"name": "anchor", "type": "string", "default": "top"},
    {"name": "as", "type": "string", "array": true, "length": 3,
      "default": ['x', 'y', 'align', 'output', 'color', 'orientation']}
  ]
};
