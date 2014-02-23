var assert = require('assert');

suite('Players', function() {
  test('in the server', function(done, server) {
    server.eval(function() {
      addPlayer(0, 'test@gmail.com');
      var docs = Players.find().fetch();
      emit('docs', docs);
    });

    server.once('docs', function(docs) {
      assert.equal(docs.length, 1);
      done();
    });
  });
});
