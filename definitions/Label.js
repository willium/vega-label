export default {
  "type": "Label",
  "metadata": {"modifies": true},
  "params": [
    { "name": "pivot", "type": "number", "expr": true, "default": 15 },
    { "name": "padding", "type": "number", "expr": true, "default": 5 },
    { "name": "line", "type": "number", "expr": true, "default": 10 },
    { "name": "size", "type": "number", "array": true, "length": 2 },
    {"name": "as", "type": "string", "array": true, "length": 3,
      "default": ['x', 'y', 'angle']}
  ]
};
