Meteor.methods({
  getUsersInGame: function(gameId) {
    return Meteor.users.find({gameNumber: gameId}).fetch();
  },
  joinUserToGame: function(userId, gameNumber) {
    setUserInGame(userId, gameNumber);
    return gameNumber;
  },
  voteForImage: function(userId, imageId) {
      user = Meteor.users.findOne({_id: userId});
      usersGame = Games.findOne({number: user.gameNumber});
      if(usersGame.phase === "Display") {
        throw new Meteor.Error(403,
          "Can't vote while displaying results of voting...",
          user._id);
      }
      if(user.hasVoted) {
        throw new Meteor.Error(302,
          "You've already voted!!!",
          user._id);
      }

      Meteor.users.update(userId, {$set: {hasVoted: 1}});
      //TODO: this assumes card is only in one game
      Cards.update(imageId, {$push: {usersVoting: userId}});
    }
});

  //change to upsert to support both new game and join
setUserInGame = function(userId, gameNumber) {
  console.log("userId " + userId + " gameNumber: " + gameNumber);
  Meteor.users.update(userId, {$set: {gameNumber: gameNumber}});
 };

Accounts.onCreateUser(function(options, user) {
  //ensure above check of hasVoted is never undefined
  console.log('New user created!');
  user.hasVoted = 0;
  return user;
});


