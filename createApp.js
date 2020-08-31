var http = require('http');
var flattern = require('./utils/flattern');

var createRoute = require('./createRoute');

var App = Object.create(Function.prototype);

App.init = function () {
  this.settings = Object.create(null);
  this.routes = [];
};

App.set = function (key, val) {
  this.settings[key] = val;
  return this;
};

App.enable = function (key) {
  this.settings[key] = true;
  return this;
};

App.disable = function (key) {
  this.settings[key] = false;
  return this;
};

// conflict
// App.get = function (key, val) {
//   return this.settings[key];
// };

App.enabled = function (key) {
  return !!this.settings[key];
};

App.disabled = function (key) {
  return !this.settings[key];
};

App.finalize = function (err, req, res) {
  if(err) {
    res.status = err.status || 500;
    res.end(err.stack || err.toString());
    
  } else {
    res.status = 404;
    return res.end('Can not ' + req.method + ' ' + req.url);  
  }
};

App.handle = function (req, res, next) {
  var self = this;
  var err;
  
  next = next || function (err) {
    var finalize = self.finalize;
    finalize(err, req, res);
  };
  // TODO
  // if(!next) next = function (err) { return finalize(err, req, res)}
  // next = nextWithRestore(next, {})
  
  return (function loop(i) {
    var route = self.routes[i];
    if(!route) return next(err);  
    return route(err, req, res, function (suberr) {
      err = suberr;
      return loop(i + 1);
    });
  }(0));
};

App.addRoute = function (method, path, pathOpts, fns) {
  var route = createRoute(method, path, pathOpts);
  fns.forEach(function (fn) {
    route.addLayer(fn);
  });
  
  this.routes.push(route);
  return this;
};

App.use = function(path /*, fn1, fn2 */) {
  var fns;
  
  // TODO pathOpts
  var pathOpts = {};
  
  if(typeof path === 'string') {
    fns = flattern([].slice.call(arguments, 1));
    return this.addRoute(null, path, pathOpts, fns);  
  } else {
    fns = flattern([].slice.call(arguments, 0));
    return this.addRoute(null, null, pathOpts, fns);  
  }
};

// TODO all
var methods = ['get', 'post'];

methods.forEach(function (method) {
  App[method] = function (path /*, fn1, fn2, ... */) {
    if(method === 'get' && arguments.length === 1) return this.settings[path];
    var fns = flattern([].slice.call(arguments, 1));
    // TODO pathOpts
    var pathOpts = {};
    
    return this.addRoute(method.toUpperCase(), path, pathOpts, fns);
  };
});


App.listen = function () {
  var server = http.createServer(this);
  return server.listen.apply(server, arguments);
};

module.exports = function createApp () {
  var app = function (req, res, next) {
    return app.handle(req, res, next);
  };

  app.__proto__ = App;
  app.init();

  return app;
};