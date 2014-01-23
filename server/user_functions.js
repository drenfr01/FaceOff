Meteor.methods({
  getUsersInGame: function(gameId) {
  return Meteor.users.find({gameNumber: gameId}).fetch();
  },
  joinUserToGame: function(userId, gameNumber) {
    setUserInGame(userId, gameNumber);
    return gameNumber;
  }
});

  //change to upsert to support both new game and join
  setUserInGame = function(userId, gameNumber) {
    Meteor.users.update(userId, {$set: {gameNumber: gameNumber}});
   };
