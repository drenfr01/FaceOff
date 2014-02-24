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
});
