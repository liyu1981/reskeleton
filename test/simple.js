var util = require('util');
var supertest = require('supertest');

var rask = require('../lib/main.js');
var server = rask.server({
    serveStatic: true,
    enableWebSocket: true
  })
  .route(function(server) {
      server.get('/hello', function(req, res, next) {
          res.send(200, 'world');
        });
      server.get('/login', function(req, res, next) {
          rask.session.createSession(res);
          res.write('I\'m in.');
          res.end();
        });
    })
  .wsRoute(function(wsServer) {
      wsServer.on('connection', function(ws) {
        var id = setInterval(function() {
          ws.send(JSON.stringify(process.memoryUsage()), function() { /* ignore errors */ });
        }, 1000);
        console.log('started client interval');
        ws.on('close', function() {
          console.log('stopping client interval');
          clearInterval(id);
        });
      });
    })
  .start();

var url = "http://localhost:12345";

describe('simpleAndStaticServer', function() {
  describe('testHello', function() {
    it('should get "world" with request "hello"', function(done) {
      supertest(url)
        .get('/hello')
        .expect(200)
        .end(function(err, res) {
            if (err) throw err;
            if (res.body === 'world') {
              console.log(done);
              done();
            } else {
              throw util.format('wrong result: %s', res.body);
            }
          });
    });
  });
});