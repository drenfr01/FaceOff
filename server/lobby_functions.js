Meteor.methods({
  assignCards: function(attributes) {
    // Attributes needs to pass a game number, we can get users and cards from that info
    gameNumber = attributes.gameNumber;
    playerId = attributes.playerId

    players = getPlayersInGame(gameNumber).fetch();

    playerCount = players.length;

    cards = Games.findOne( { number: gameNumber } ).cards;

console.log("CARDS");
console.log(cards);
    // Keep popping cards off the array looping around the users
    cards.forEach( function (card) {
      playerCount --;
      currentUserId = users[playerCount]._id;

      // TODO: We should call addCardToUser here I think
      Meteor.users.update( { _id: currentUserId },
        { $push: { cards: cards._id } } );

      if(playerCount === 0) {
        playerCount = users.length;
      }
    });

    //Get the next images
    getNextImages(gameNumber);

    //"Broadcast" to all users in lobby that were starting game
    //Meteor.users.update();

    return gameNumber;
  }
});
