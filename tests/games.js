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
  //TODO: expand test to cover ties
  test('remove cards in play', function(done, server) {
    server.eval(function() {
      fixtures = setupBasicGame();

      //Note: we see here that setCardInPlay and getNextPlayerCard
      //are linked, so we need to call both to properly
      //set both the players deck and the game's active cards
      setCardInPlay(fixtures.gameNumber1, 
        getNextPlayerCard(fixtures.playerId1));
      setCardInPlay(fixtures.gameNumber1, 
        getNextPlayerCard(fixtures.playerId2));
      //Vote for Card 1, which belongs to player1
      addPlayerVoteToCard(fixtures.playerId1, fixtures.cardId1);
      addPlayerVoteToCard(fixtures.playerId2, fixtures.cardId1);

      console.log("Winning card belongs to: " + 
        Cards.findOne(fixtures.cardId1).playerId + " " +  playerId1);

      gameState1 = Games.findOne({number: fixtures.gameNumber1});
      
      removeCardsInPlay(fixtures.gameNumber1);
      //Grab players and game state after removing cards
      gameState2 = Games.findOne({number: fixtures.gameNumber1});
      player1 = Players.findOne(fixtures.playerId1);
      player2 = Players.findOne(fixtures.playerId2);

      options = {
        gameState1: gameState1,
        gameState2: gameState2,
        player1: player1,
        player2: player2,
        cardId1: fixtures.cardId1,
        cardId2: fixtures.cardId2
      };
      emit('options',options);
    });

    server.once('options', function(options) {
      //Test that removeCards clears cards in play
      //Test that removeCards rmeoves card from losers deck
      assert.equal(options.gameState1.cardsInPlay.length,2);
      assert.equal(options.gameState2.cardsInPlay.length,0);
      //Test that removeCards pushes both cards to winners deck
      //TODO: should we test order of cards pushed back on?
      assert.equal(options.player1.cardIds.length, 2);
      //Test that removeCards does not push card back to losers deck
      assert.equal(options.player2.cardIds.length, 0);
      done();
    });
  });
});
