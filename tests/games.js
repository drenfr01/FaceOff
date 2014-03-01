var assert = require('assert');

suite('Games', function() {

  test('adding a Game', function(done, server) {
    server.eval(function() {
      attributes = {
        timer_value: 5
      };
      gameNumber1 = insertGame(attributes);
      gameNumber2 = insertGame(attributes);
      docs = Games.find().fetch();
      game1 = Games.findOne({number: gameNumber1});
      game2 = Games.findOne({number: gameNumber2});
      options = {
        game1: game1,
        game2: game2,
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
      attributes = {
        timer_value: 5
      };
      gameNumber1 = insertGame(attributes);
      cardId1 = addCard('www.image1.com',gameNumber1);
      cardId2 = addCard('www.image2.com',gameNumber1);

      addCardToGame(cardId1, gameNumber1);
      addCardToGame(cardId2, gameNumber1);

      game = Games.findOne({number: gameNumber1});

      options = {
        game: game,
        cardIds: [cardId1, cardId2]
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
      gameNumber = 0;
      attributes = {
        timer_value: 5
      };
      gameNumber1 = insertGame(attributes);
      playerId1 = addPlayer(gameNumber, 'test1@gmail.com');
      playerId2 = addPlayer(gameNumber, 'test2@gmail.com');
      playerId3 = addPlayer(gameNumber, 'test3@gmail.com');
      addPlayerToGame(gameNumber, playerId1);
      addPlayerToGame(gameNumber, playerId2);
      addPlayerToGame(gameNumber, playerId3);

      gameBeforeUpdate = Games.findOne({number: gameNumber});
      updateActivePlayerIds(gameNumber);
      gameAfterFirstUpdate = Games.findOne({number: gameNumber});
      removeActivePlayerIds(gameNumber);
      updateActivePlayerIds(gameNumber);
      gameAfterSecondUpdate = Games.findOne({number: gameNumber});
      removeActivePlayerIds(gameNumber);
      updateActivePlayerIds(gameNumber);
      gameAfterThirdUpdate = Games.findOne({number: gameNumber});

      options = {
        playerId1: playerId1,
        playerId2: playerId2,
        playerId3: playerId3,
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
      gameNumber = 0;
      attributes = {
        timer_value: 5
      };
      gameNumber1 = insertGame(attributes);
      playerId1 = addPlayer(gameNumber, 'test1@gmail.com');
      playerId2 = addPlayer(gameNumber, 'test2@gmail.com');
      playerId3 = addPlayer(gameNumber, 'test3@gmail.com');
      addPlayerToGame(gameNumber, playerId1);
      addPlayerToGame(gameNumber, playerId2);
      addPlayerToGame(gameNumber, playerId3);

      updateActivePlayerIds(gameNumber1);

      gameStateBefore = Games.findOne({number: gameNumber1});

      removeActivePlayerIds(gameNumber1);

      gameStateAfter = Games.findOne({number: gameNumber1});

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
      gameNumber = 0;
      attributes = {
        timer_value: 5
      };
      gameNumber1 = insertGame(attributes);

      gameStateBefore = Games.findOne({number: gameNumber});
      updateGamePhase(gameNumber, 'Voting');
      gameStateAfter = Games.findOne({number: gameNumber});
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
      gameNumber = 0;
      attributes = {
        timer_value: 5
      };
      gameNumber1 = insertGame(attributes);
      cardId1 = addCard('www.image1.com',gameNumber1);
      cardId2 = addCard('www.image2.com',gameNumber1);
      cardId3 = addCard('www.image3.com',gameNumber1);

      addCardToGame(cardId1, gameNumber1);
      addCardToGame(cardId2, gameNumber1);
      addCardToGame(cardId3, gameNumber1);

      gameState1 = Games.findOne({number: gameNumber});
      setCardInPlay(gameNumber, cardId1);
      gameState2 = Games.findOne({number: gameNumber});
      setCardInPlay(gameNumber, cardId2);
      gameState3 = Games.findOne({number: gameNumber});

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
      gameNumber = 0;
      attributes = {
        timer_value: 5
      };
      gameNumber1 = insertGame(attributes);
      cardId1 = addCard('www.image1.com',gameNumber1);
      cardId2 = addCard('www.image2.com',gameNumber1);
      cardId3 = addCard('www.image3.com',gameNumber1);

      addCardToGame(cardId1, gameNumber1);
      addCardToGame(cardId2, gameNumber1);
      addCardToGame(cardId3, gameNumber1);

      setCardInPlay(gameNumber, cardId1);
      setCardInPlay(gameNumber, cardId2);
      gameState1 = Games.findOne({number: gameNumber});
      removeCardsInPlay(gameNumber);
      gameState2 = Games.findOne({number: gameNumber});


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
