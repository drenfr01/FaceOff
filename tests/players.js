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

  test('using the getNextPlayerCard function', function(done, server) {
    server.eval(function() {
      //setup
      gameNumber = 0;
      cardId1 = addCard('http://image1.com',gameNumber);
      cardId2 = addCard('http://image2.com',gameNumber);
      playerId = addPlayer(gameNumber, 'test@gmail.com');

      addCardToPlayer(playerId, cardId1);
      addCardToPlayer(playerId, cardId2);

      playerBefore = Players.findOne(playerId);

      //nextCard should be first card added to Player
      nextCard = getNextPlayerCard(playerId);

      playerAfter = Players.findOne(playerId);

      var options = {
        cardId1: cardId1,
        cardId2: cardId2,
        nextCard: nextCard,
        playerBefore: playerBefore,
        playerAfter: playerAfter
      };
      emit('options',options);
    });

    server.once('options', function(options) {
      assert.equal(options.cardId1,options.nextCard);
      
      assert.deepEqual(options.playerBefore.cardIds,
        [options.cardId1,options.cardId2]);

      assert.deepEqual(options.playerAfter.cardIds,
        [options.cardId2,options.cardId1]);
      done();
    });
  });
  test('testing the setPlayerVote function', function(done, server) {
    server.eval(function() {
      gameNumber = 0;
      playerId = addPlayer(gameNumber, 'test@gmail.com');

      playerBefore = Players.findOne(playerId);
      setPlayerVote(playerId);
      playerAfter = Players.findOne(playerId);
      
      var options = {
        playerBefore: playerBefore,
        playerAfter: playerAfter
      };
      emit('options', options);

    });

    server.once('options', function(options) {
      assert.equal(options.playerBefore.hasVoted, 0);
      assert.equal(options.playerAfter.hasVoted, 1);
      done();
    });
  });
  test('testing the removePlayerVote function', function(done, server) {
    server.eval(function() {
      gameNumber = 0;
      playerId = addPlayer(gameNumber, 'test@gmail.com');

      setPlayerVote(playerId);
      playerBefore = Players.findOne(playerId);
      removePlayerVote(playerId);
      playerAfter = Players.findOne(playerId);
      
      var options = {
        playerBefore: playerBefore,
        playerAfter: playerAfter
      };
      emit('options', options);

    });

    server.once('options', function(options) {
      assert.equal(options.playerBefore.hasVoted, 1);
      assert.equal(options.playerAfter.hasVoted, 0);
      done();
    });
  });
});
