var createApp = require('../createApp.js');
var assert = require('assert');

describe('/createApp.js', function () {
  it('app is a function', function () {
    var app = createApp();
    assert.equal(typeof app, 'function');
  });

  describe('settings', function () {
    it('has setters: set, enable, disable', function () {
      var app = createApp();
      assert.equal(typeof app.set, 'function');
      assert.equal(typeof app.enable, 'function');
      assert.equal(typeof app.disable, 'function');
    });

    it('has getters: get, enabled, disabled', function () {
      var app = createApp();
      assert.equal(typeof app.get, 'function');
      assert.equal(typeof app.enabled, 'function');
      assert.equal(typeof app.disabled, 'function');
    });

    it('setters return app', function () {
      var app = createApp();
      assert.strictEqual(app.set('a', 1), app);
      assert.strictEqual(app.enable('b'), app);
      assert.strictEqual(app.disable('c'), app);
    });

    it('getters return default value undefined or false', function () {
      var app = createApp();
      assert.strictEqual(app.get('key1'), undefined);
      assert.strictEqual(app.enabled('key2'), false);
      assert.strictEqual(app.disabled('key3'), true);
    });

    it('setters can set values', function () {
      var app = createApp();
      app.set('key1', 'val1');
      app.enable('key2');
      app.enable('key3');
      app.disable('key3');

      assert.equal(app.get('key1'), 'val1');
      assert.equal(app.enabled('key2'), true);
      assert.equal(app.disabled('key3'), true);
    });

  });

  // app.routes is an array
  // app.handle(req, res, next) try to pass (req, res) through the every route
  // each route can call next to call next route, if they dont call next handler stop
  // if no route stop the excusion app.handle excute the callback
   
  describe('app.handle', function () {
    it('app.routes is an array', function () {
      var app = createApp();
      assert(Array.isArray(app.routes), 'app.routes must be array');      
    });
    
    it('app.handle excute callback if app.routes is emtpty', function (done) {
      var app = createApp();
      app.handle({}, {}, function (err) {
        done(err);
      });
    });
    
    it('app.handle excute callback if app.routes has one route with next()', function (done)  {
      var app = createApp();
      app.routes.push(function (err, req, res, next) {
        next();
      });
      
      app.handle({}, {}, function (err) {
        done(err);
      });
    });

    it('app.handle excute callback(err) if app.routes has one route with next(err)', function (done)  {
      var app = createApp();
      app.routes.push(function (err, req, res, next) {
        next('an error');
      });
      
      app.handle({}, {}, function (err) {
        if(err === 'an error') {
          done();
        } else {
          done('route must send err to callback');
        }
      });
    });
    
    
    it('add 2 functions to routes', function (done)  {
      var app = createApp();
      app.routes.push(function (err, req, res, next) {
        next();
      });
      
      app.routes.push(function (err, req, res, next) {
        assert.equal(req, "req");
        assert.equal(res, "res");
        done();
      });
      
      app.handle("req", "res");
    });
  });
});