var assert = require('assert');

suite('Games', function() {

  test('adding a Game', function(done, server) {
    server.eval(function() {
      fixtures = setupBasicGame(); 
      docs = Games.find().fetch();
      options = {
        game1: fixtures.game1,
        game2: fixtures.game2,
        docs: docs
      };
      emit('options',options);
    });

    server.once('options',function(options) {
      //2 games are inserted
      assert.equal(options.docs.length, 2);
      //A new game has the appropriate attributes
      assert.equal(options.game1.active, 1);
      assert.equal(options.game1.isPaused, false);
      assert.equal(options.game1.phase, "Lobby");
      assert.equal(options.game1.number, 0); 
      //New games auto-increment
      assert.equal(options.game2.number, 1);
      done();
    });
  });
  test('adding card to game', function(done, server) {
    server.eval(function() {
      fixtures = setupBasicGame();

      options = {
        game: fixtures.game1,
        cardIds: [fixtures.cardId1, fixtures.cardId2]
      };

      emit('options',options);
    });

    server.once('options', function(options) {
      assert.deepEqual(options.game.cards,options.cardIds);
      done();
    });
  });
  test('updating Active Players', function(done, server) {
    server.eval(function() {

      fixtures = setupBasicGame();

      gameBeforeUpdate = Games.findOne({number: fixtures.gameNumber1});
      updateActivePlayerIds(fixtures.gameNumber1);

      gameAfterFirstUpdate = Games.findOne(
        {number: fixtures.gameNumber1});
      removeActivePlayerIds(fixtures.gameNumber1);
      updateActivePlayerIds(fixtures.gameNumber1);

      gameAfterSecondUpdate = Games.findOne(
        {number: fixtures.gameNumber1});
      removeActivePlayerIds(fixtures.gameNumber1);
      updateActivePlayerIds(fixtures.gameNumber1);

      gameAfterThirdUpdate = Games.findOne(
        {number: fixtures.gameNumber1});

      options = {
        playerId1: fixtures.playerId1,
        playerId2: fixtures.playerId2,
        playerId3: fixtures.playerId3,
        gameState1: gameBeforeUpdate,
        gameState2: gameAfterFirstUpdate,
        gameState3: gameAfterSecondUpdate,
        gameState4: gameAfterThirdUpdate
      };
  
      emit('options',options);
    });

    server.once('options', function(options) {

      assert.deepEqual(options.gameState1.players,
        [options.playerId1, options.playerId2, options.playerId3]); 
      assert.deepEqual(options.gameState1.activePlayerIds,[]);
      //After first call to updateActivePlayerIds
      assert.deepEqual(options.gameState2.players,
        [options.playerId3]);
      assert.deepEqual(options.gameState2.activePlayerIds,
        [options.playerId1, options.playerId2]);
      //After second call to updateActivePlayerIds
      assert.deepEqual(options.gameState3.players,
        [options.playerId2]);
      assert.deepEqual(options.gameState3.activePlayerIds,
        [options.playerId3, options.playerId1]);
      //After third call to updateActivePlayerIds
      assert.deepEqual(options.gameState4.players,
        [options.playerId1]);
      assert.deepEqual(options.gameState4.activePlayerIds,
        [options.playerId2, options.playerId3]);
      done();
    });
  });
  test('removing Active Players', function(done, server) {
    server.eval(function() {
      fixtures = setupBasicGame();

      updateActivePlayerIds(fixtures.gameNumber1);

      gameStateBefore = Games.findOne({number: fixtures.gameNumber1});

      removeActivePlayerIds(fixtures.gameNumber1);

      gameStateAfter = Games.findOne({number: fixtures.gameNumber1});

      options = {
        gameState1: gameStateBefore,
        gameState2: gameStateAfter
      };

      emit('options',options);
    });

    server.once('options', function(options) {
      //After updating active players, 1 player in queue
      //and 2 are active
      assert.equal(options.gameState1.activePlayerIds.length,2);
      //Update active players doesn't touch player queue
      assert.equal(options.gameState2.players.length,3);
      //After removing active players, 3 players in queue
      //0 are active
      assert.equal(options.gameState2.activePlayerIds.length,0);
      assert.equal(options.gameState2.players.length,3);
      done();
    });
  });
  test('updating game phase', function(done, server) {
    server.eval(function() {
      fixtures = setupBasicGame();

      gameStateBefore = Games.findOne({number: fixtures.gameNumber1});
      updateGamePhase(fixtures.gameNumber1, 'Voting');
      gameStateAfter = Games.findOne({number: fixtures.gameNumber1});
      options = {
        gameState1: gameStateBefore,
        gameState2: gameStateAfter
      };
      emit('options',options);
    });

    server.once('options', function(options) {
      assert.equal(options.gameState1.phase, 'Lobby');
      assert.equal(options.gameState2.phase, 'Voting');
      done();
    });
  });
  test('set card in play', function(done, server) {
    server.eval(function() {
      fixtures = setupBasicGame();

      gameState1 = Games.findOne({number: fixtures.gameNumber1});
      setCardInPlay(fixtures.gameNumber1, fixtures.cardId1);
      gameState2 = Games.findOne({number: fixtures.gameNumber1});
      setCardInPlay(fixtures.gameNumber1, fixtures.cardId2);
      gameState3 = Games.findOne({number: fixtures.gameNumber1});

      options = {
        gameState1: gameState1,
        gameState2: gameState2,
        gameState3: gameState3,
        cardId1: cardId1,
        cardId2: cardId2
      };
      emit('options',options);
    });

    server.once('options', function(options) {
      assert.equal(options.gameState1.cardsInPlay,0);
      assert.deepEqual(options.gameState2.cardsInPlay,
        [options.cardId1]);
      assert.deepEqual(options.gameState3.cardsInPlay,
        [options.cardId1,options.cardId2]);
      done();
    });
  });
  test('remove cards in play', function(done, server) {
    server.eval(function() {
      fixtures = setupBasicGame();

      setCardInPlay(fixtures.gameNumber1, fixtures.cardId1);
      setCardInPlay(fixtures.gameNumber1, fixtures.cardId2);
      gameState1 = Games.findOne({number: fixtures.gameNumber1});
      removeCardsInPlay(fixtures.gameNumber1);
      gameState2 = Games.findOne({number: fixtures.gameNumber1});


      options = {
        gameState1: gameState1,
        gameState2: gameState2,
      };
      emit('options',options);
    });

    server.once('options', function(options) {
      assert.equal(options.gameState1.cardsInPlay.length,2);
      assert.equal(options.gameState2.cardsInPlay.length,0);
      done();
    });
  });
});
