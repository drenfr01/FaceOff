var assert = require('assert');

suite('Players', function() {

  test('using the addPlayer function', function(done, server) {
    server.eval(function() {
      addPlayer(0, 'test@gmail.com');
      var docs = Players.find().fetch();
      emit('docs', docs);
    });

    server.once('docs', function(docs) {
      assert.equal(docs.length, 1);
      assert.equal(docs[0].gameNumber,0);
      assert.equal(docs[0].name,'test@gmail.com');
      done();
    });
  });
  test('using the addCardToPlayer function', function(done, server) {
    server.eval(function() {
      playerId = addPlayer(0, 'test@gmail.com');
      cardId = addCard('http://test.com', 0);
      addCardToPlayer(playerId, cardId);
      player = Players.findOne(playerId);
      var options = {
        playerId: playerId,
        cardId: cardId,
        player: player
      };
      emit('docs', options);
    });

    server.once('docs', function(options) {
      assert.equal(options.player.cardIds, options.cardId);
      done();
    });
  });
  test('using the getPlayersInGame function', function(done, server) {
    server.eval(function() {
      gameNumber = 0;
      playerId1 = addPlayer(gameNumber, 'test@gmail.com');
      playerId2 = addPlayer(gameNumber, 'test@gmail.com');
      docs = getPlayersInGame(gameNumber).fetch();
      var options = {
        playerId1: playerId1,
        playerid2: playerId2,
        docs: docs
      };
      emit('options', options);
    });
    
    server.once('options', function(options) {
      assert.equal(options.docs.length,
        2);
      done();
    });
  });
});
