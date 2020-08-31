"use strict";


 // ./utils/flattern
 //   √ flattern(undefined) => []
 //   √ flattern(null) => [])
 //   √ flattern(1) => [1]
 //   √ flattern([]) => []
 //   √ flattern([1]) => [1]
 //   √ flattern([1, [2, 3], 4]) => [1, 2, 3, 4]
module.exports = function flattern(args, ret) {
  var i;
  ret = ret || [];
  if (Array.isArray(args)) {
    /*jslint plusplus: true*/
    for (i = 0; i < args.length; i++) {
      flattern(args[i], ret);
    }
  } else {
    if (args !== null && args !== undefined) {
      ret.push(args);
    }
  }

  return ret;
};

