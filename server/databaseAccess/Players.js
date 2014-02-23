addPlayer = function(gameNumber, email) {
  //currently name is just user's email account
  return Players.insert({gameNumber: gameNumber, hasVoted: 0, name: email});
};

addPlayerToGame = function(gameNumber, playerId) {
  Games.update({number: gameNumber}, { $push: {players: playerId} });
};

addCardToPlayer = function(playerId, cardId) {
  Players.update( { _id: playerId },
    { $push: { cardIds: cardId } } );
  Cards.update({_id: cardId}, {$set: {playerId: playerId}});
};

getPlayersInGame = function(gameNumber) {
  return Players.find({gameNumber: gameNumber});
};


getNextPlayerCard = function(playerId) {
  cardId = popAndReturnPlayerCard(playerId);
  Players.update({_id: playerId}, {$push : {cardIds: cardId}});
  return cardId;
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

setPlayerVote = function(playerId) {
  Players.update({_id: playerId}, {$set: {hasVoted: 1}});
};
removePlayerVote = function(playerId) {
  Players.update({_id: playerId}, {$set: {hasVoted: 0}});
};
