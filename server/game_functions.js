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
  //Do not run when players first join game
  if(getCardsInPlay(gameNumber).length > 0)
    removeCardsInPlay(gameNumber);

  //TODO: expand to more than 2 players
  playerIds = pickPlayers(gameNumber, 2);

  playerIds.forEach( function(playerId) {
    cardId = getNextPlayerCard(playerId);
    removePlayerVotesFromCard(cardId); //remove previous votes
    setCardInPlay(gameNumber, cardId);
    removePlayerVote(playerId); //allow player to vote on new cards
   });
  //Set phase of game
  updateGamePhase(gameNumber, "Voting");

  setTimer(gameNumber, getVotingTime(gameNumber), "endVoting");
};

pickPlayers = function(gameNumber, numPlayers) {
  removeActivePlayerIds(gameNumber);
  return updateActivePlayerIds(gameNumber);
};

endVoting = function(gameNumber) {
  updateGamePhase(gameNumber, "Display");

  // Start the next round in 3 seconds
  setTimer(gameNumber, 3, "startVoting");
};

