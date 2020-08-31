var Layer = Object.create(Function.prototype);

Layer.init = function (fn) {
	this.fn = fn;
};

Layer.handle = function (err, req, res, next) {
	var fn = this.fn;
	if(err && fn.length === 4) return fn(err, req, res, next);
	if(!err && fn.length !== 4) return fn(req, res, next);
	return next(err);
}

module.exports = function (fn) {
	var layer = function (err, req, res, next) {
		layer.handle(err, req, res, next);
	};
	
	layer.__proto__ = Layer;
	layer.init(fn);
	return layer;
};