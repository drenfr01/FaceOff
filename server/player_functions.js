Meteor.methods({
  getPlayersInGame: function(gameNumber) {
    return Players.find({gameNumber: gameNumber}).fetch();
  },
  addPlayerToGame: function(attributes) {
    playerId = addPlayer(attributes.gameNumber, attributes.email);
    addPlayerToGame(attributes.gameNumber, playerId);
    return {
      gameNumber: gameNumber,
      playerId: playerId
    };
  },
  voteForImage: function(currentPlayerId, cardPlayerId, cardId) {
      currentPlayer = Players.findOne({_id: currentPlayerId});
      cardPlayer = Players.findOne({_id: cardPlayerId});
      playersGame = Games.findOne({number: currentPlayer.gameNumber});

      if(playersGame.phase === "Display") {
        throw new Meteor.Error(403,
          "Can't vote while displaying results of voting...",
          currentPlayerId);
      }
      if(currentPlayer.hasVoted) {
        throw new Meteor.Error(302,
          "You've already voted!!!",
          currentPlayerId);
      }
     setPlayerVote(currentPlayerId);
     addPlayerVoteToCard(currentPlayerId, cardId);
    },
  getPlayerVoters: function(cardId) {
    card = Cards.findOne({_id: cardId});
    console.log(card);
    return card.playerVotes;
  }
});

  //change to upsert to support both new game and join
setUserInGame = function(userId, gameNumber) {
  Meteor.users.update(userId, {$set: {gameNumber: gameNumber}});
 };

Accounts.onCreateUser(function(options, user) {
  //ensure above check of hasVoted is never undefined
  user.hasVoted = 0;
  return user;
});


