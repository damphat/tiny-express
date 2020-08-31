'use strict';

// √ should assign new properties for obj, return new-next-function
// √ new-next-function should restore old properties
// √ new-next-function should call old-next-function after restoring old properties
// √ new-next-function should pass err argument to old-next-function
// √ new-next-function should pass all arguments to old-next-function
// √ old-next-function can be null
// √ allow non-enumerable properties by add $ to non-enumerable key
// √ allow $ in key by using $$
// √ fully restore by deleting properties
module.exports = function nextWithRestore(next, obj, props) {
  var old = {}; // to be restored
  var del = []; // to be deleted

  Object.keys(props).forEach(function (key) {
    var k = (key[0] === '$' ? key.slice(1) : key);

    if (obj.hasOwnProperty(k) || k === '__proto__') {
      old[key] = obj[k];
    } else {
      del.push(k);
    }

    obj[k] = props[key];
  });

  return function (err) {
    Object.keys(old).forEach(function (key) {
      var k = (key[0] === '$' ? key.slice(1) : key);
      obj[k] = old[key];
    });

    del.forEach(function (key) {
      delete obj[key];
    });

    if (next) {
      return next.apply(this, arguments);
    }
  };
};