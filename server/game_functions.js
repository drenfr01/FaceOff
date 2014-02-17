Meteor.methods({
  pauseGame: function(gameNumber) {
    pauseTimer(gameNumber);
    Games.update({number: gameNumber}, {$set: {isPaused: true}});
  },
  resumeGame: function(gameNumber) {
    resumeTimer(gameNumber);
    Games.update({number: gameNumber}, {$set: {isPaused: false}});
  }
});

//startVoting will begin the voting after a player enters the game from the lobby
startVoting = function(gameNumber) {

  //TODO: expand to more than 2 players
  playerIds = pickPlayers(gameNumber, 2);

  playerIds.forEach( function(playerId) {
    cardId = getNextPlayerCard(playerId);
    setCardInPlay(gameNumber, cardId);
    console.log("Card Id: " + cardId);
   });
  //Set phase of game
  updateGamePhase(gameNumber, "Voting");

  //setTimer(gameNumber, getVotingTime(gameNumber), "endVoting");
};

pickPlayers = function(gameNumber, numPlayers) {
  game = Games.findOne({number: gameNumber});
  if(game.players.length < numPlayers)
    throw Meteor.Error(500, "Not enough players in game");

  removeActivePlayerIds(gameNumber);
  return updateActivePlayerIds(gameNumber);
};

endVoting = function(gameNumber) {
  updateGamePhase(gameNumber, "Display");
  
  //TODO: remove cards in play in the game
  // Start the next round in 3 seconds
  setTimer(gameNumber, 3, "startVoting");
};

