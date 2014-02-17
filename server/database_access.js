addPlayer = function(gameNumber) {
  return Players.insert({gameNumber: gameNumber, hasVoted: 0});
};
insertGame = function(gameAttributes) {
    //Ensure timer is numeric value
    var timerValue = parseInt(gameAttributes.timer_value);
    if (! _.isNumber( timerValue ) || isNaN( timerValue ) ) {
      throw new Meteor.Error(302, "Must have numeric value for timer");
    }
    //Find largest game number and insert
    var maxGame = Games.findOne({active: 1}, {sort: {number: -1}});
    var maxGameNumber = 0;

    if(!maxGame)
      maxGameNumber = 0;
    else
      maxGameNumber = maxGame.number + 1;

     Games.insert({
      number: maxGameNumber,
      active: 1,
      votingTime: timerValue,
      isPaused: false,
      phase: "Lobby"
    });

    return maxGameNumber;
};
addPlayerToGame = function(gameNumber, playerId) {
  Games.update({number: gameNumber}, { $push: {players: playerId} });
};
addCard = function(url, gameNumber) {
  return Cards.insert({path: url,
    in_play: [],
    playerVotes : [],
    active: gameNumber});
};
addCardToGame = function(cardId, gameNumber) {
  Games.update({number: gameNumber},
    {$push: {cards: cardId }});
};
addCardToPlayer = function(playerId, cardId) {
  Players.update( { _id: playerId },
    { $push: { cardIds: cardId } } );
  Cards.update({_id: cardId}, {$set: {playerId: playerId}});
};
getPlayersInGame = function(gameNumber) {
  return Players.find({gameNumber: gameNumber});
};
getActivePlayerIds = function(gameNumber) {
  //TODO: fill this in if needed
};
updateActivePlayerIds = function(gameNumber) {
  activePlayerIds = [];
  activePlayerIds.push(popAndReturnGamePlayer(gameNumber));
  activePlayerIds.push(popAndReturnGamePlayer(gameNumber));
  Games.update({number: gameNumber}, {$push: {activePlayerIds: {$each: activePlayerIds}}});
  return activePlayerIds;
};
removeActivePlayerIds = function(gameNumber) {
  //This sets the activePlayerIds to a blank array when the game first starts
  activePlayerIds = Games.findOne({number: gameNumber}).activePlayerIds || [];
  Games.update({number: gameNumber}, {$set: {activePlayerIds: []}});
  Games.update({number: gameNumber}, {$push: {players: {$each: activePlayerIds}}});
};
getNextPlayerCard = function(playerId) {
  cardId = popAndReturnPlayerCard(playerId);
  Players.update({_id: playerId}, {$push : {cardIds: cardId}});
  return cardId;
};
//This does NOT add the player back onto the queue. That is the calling
//functions responsibility
popAndReturnGamePlayer = function(gameNumber) {
  playerId = Games.findOne({number: gameNumber}).players[0];
  Games.update({number: gameNumber}, {$pop: {players: -1}});
  return playerId;
};
//This does NOT add the card back onto the players deck. That is the
//calling functions responsibility. This will allow cards to "be stolen"
//in elimination games and such
//TODO: add checks to make sure we have cards
popAndReturnPlayerCard = function(playerId) {
  cardId = Players.findOne({_id: playerId}).cardIds[0];
  Players.update( {_id: playerId }, { $pop: {cardIds: -1} } );
  return cardId;
};
updateGamePhase = function(gameNumber, gamePhase) {
  Games.update({ number: gameNumber }, { $set: { phase: gamePhase} });
};
setCardInPlay = function(gameNumber, cardId) {
  Games.update({ number: gameNumber }, { $push: { cardsInPlay: cardId } });
};
removeCardsInPlay = function(gameNumber) {
  Games.update({ number: gameNumber}, {$set: {cardsInPlay: [] } });
};
setPlayerVote = function(playerId) {
  Players.update({_id: playerId}, {$set: {hasVoted: 1}});
};
removePlayerVote = function(playerId) {
  Players.update({_id: playerId}, {$set: {hasVoted: 0}});
};
addPlayerVoteToCard = function(playerId, cardId) {
      Cards.update({_id: cardId}, {$push: {playerVotes: playerId}});
};
