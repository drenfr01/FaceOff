Meteor.methods({
  assignCards: function(attributes) {
    // Attributes needs to pass a game number, we can get users and cards from that info
    gameNumber = attributes.number;

    users = Meteor.users.find({gameNumber: gameNumber}).fetch();
    userCount = users.length;

    cards = Cards.find( { active: gameNumber } );

    // Keep popping cards off the array looping around the users
    cards.forEach( function (card) {
      userCount --;
      currentUserId = users[userCount]._id;

      // TODO: We should call addCardToUser here I think
      Meteor.users.update( { _id: currentUserId }, 
        { $push: { cards: cards._id } } );

      if(userCount === 0) {
        userCount = users.length;
      }
    });

    //Get the next images
    getNextImages(gameNumber);

    //"Broadcast" to all users in lobby that were starting game
    //Meteor.users.update();

    return gameNumber;
  }
});
