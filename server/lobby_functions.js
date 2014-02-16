Meteor.methods({
  assignCards: function(attributes) {
    // Attributes needs to pass a game number, we can get users and cards from that info
    gameNumber = attributes.gameNumber;
    playerId = attributes.playerId

    players = getPlayersInGame(gameNumber).fetch();

    playerCount = players.length;

    cardIds = Games.findOne( { number: gameNumber } ).cards;

    // Keep popping cards off the array looping around the users
    cardIds.forEach( function (cardId) {
      playerCount --;
      currentPlayerId = players[playerCount]._id;

      addCardToPlayer(currentPlayerId, cardId)

      if(playerCount === 0) {
        playerCount = players.length;
      }
    });

    //Get the next images
    getNextImages(gameNumber);

    //"Broadcast" to all users in lobby that were starting game
    //Meteor.users.update();

    return gameNumber;
  }
});
