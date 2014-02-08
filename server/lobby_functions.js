Meteor.methods({
  assignCards: function(attributes) {
    // Attributes needs to pass a game number, we can get users and cards from that info
    gameNumber = attributes.number;

    users = Meteor.users.find({gameNumber: gameNumber}).fetch();

    cards = Cards.find( { active: gameNumber } );

    userCount = users.length;
    console.log('users')
    console.log(users)
    // Keep popping cards off the array looping around the users
    cards.forEach( function (card) {
      userCount --
      currentUserId = users[userCount]._id

      // TODO: We should call addCardToUser here I think
      Meteor.users.update( { _id: currentUserId }, { $push: { cards: cards._id } } )
      if(userCount == 0) {
        userCount = users.length;
      }
    });

    //Get the next images
    getNextImages(gameNumber);

    return gameNumber;
  }
});
