var assert = require('assert');

suite('Cards', function() {

  test('adding a card', function(done, server) {
    server.eval(function() {
      gameNumber = 0;
      cardId = addCard('www.image1.com', gameNumber);
      docs = Cards.find().fetch();
      options = {
        cardId: cardId,
        docs: docs
      };
      emit('options', options);
    });

    server.once('options', function(options) {
      assert.equal(options.docs.length, 1);
      done();
    });
  });

  test('adding a playerVote to a card', function(done, server) {
    server.eval(function() {
      gameNumber = 0;
      cardId1 = addCard('www.image1.com', gameNumber);
      cardId2 = addCard('www.image2.com', gameNumber);
      
      playerId1 = addPlayer(gameNumber);
      playerId2 = addPlayer(gameNumber);
      playerId3 = addPlayer(gameNumber); //shouldn't be added to card

      addPlayerVoteToCard(playerId1, cardId1);
      addPlayerVoteToCard(playerId2, cardId1);

      card1 = Cards.findOne(cardId1);
      card2 = Cards.findOne(cardId2);
      options = {
        card1: card1,
        card2: card2,
        playerIds: [playerId1, playerId2]
      };
      emit('options', options);
    });

    server.once('options', function(options) {
      //ensure only 1 card had vote added
      assert.equal(options.card2.playerVotes.length,0);
      //ensure card has array of all players
      assert.deepEqual(options.card1.playerVotes,options.playerIds);
      done();
    });
  });
  test('remove a PlayerVote from  a card', function(done, server) {
    server.eval(function() {
      gameNumber = 0;
      cardId1 = addCard('www.image1.com', gameNumber);
      cardId2 = addCard('www.image2.com', gameNumber);
      
      playerId1 = addPlayer(gameNumber);
      playerId2 = addPlayer(gameNumber);

      addPlayerVoteToCard(playerId1, cardId1);
      addPlayerVoteToCard(playerId2, cardId1);

      removePlayerVotesFromCard(cardId1);

      card1 = Cards.findOne(cardId1);

      options = {
        card1: card1
      };
      emit('options', options);
    });

    server.once('options', function(options) {
      assert.deepEqual(options.card1.playerVotes,[]);
      done();
    });
  });
  test('getting Card Votes from a card', function(done, server) {
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

      card1 = Cards.findOne(fixtures.cardId1);
      card2 = Cards.findOne(fixtures.cardId2);

      options = {
        card1: card1,
        card2: card2
      };

      emit('options', options);
    });

    server.once('options', function(options) {
      assert.equal(options.card1.playerVotes.length, 2);
      assert.equal(options.card2.playerVotes.length, 0);
      done();
    });
  });
});
