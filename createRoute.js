var createLayer = require('./createLayer');
var match = require('./utils/match');

var Route = Object.create(Function.prototype);

Route.init = function (method, path) {
	this.method = method;
	this.path = match(path, undefined);
	this.layers = [];
};

Route.addLayer = function (fn) {
	this.layers.push(createLayer(fn));
	return this;
};

Route.match = function (req) {
	if(this.method && req.method !== this.method) return false;
	//if(this.path && req.url.split('?')[0] !== this.path) return false;
	var ret = this.path(req.url);

	if(ret == null) return false;
	req.params = ret;
	return true;	
};

Route.handle = function (err, req, res, next) {
	var self = this;
	
	// match test
	if(!this.match(req)) return next(err);
	
	// excute layers
	return (function loop(i) {
		var layer = self.layers[i];
		if(!layer) return next(err);
		return layer(err, req, res, function (suberr) {
			err = suberr;
			if(err === 'route') return next();
			return loop(i + 1);
		});
	}(0));
};

module.exports = function createRoute(method, path) {
	var route = function (err, req, res, next) {
		route.handle(err, req, res, next);
	};
	
	route.__proto__ = Route;
	route.init(method, path);
	
	return route;
};