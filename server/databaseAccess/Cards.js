addCard = function(url, gameNumber) {
  return Cards.insert({path: url,
    in_play: [],
    playerVotes : [],
    active: gameNumber});
};
addPlayerVoteToCard = function(playerId, cardId) {
  Cards.update({_id: cardId}, {$push: {playerVotes: playerId}});
};
removePlayerVotesFromCard = function(cardId) {
  //TODO: push statistics from card up to "image" or to user history
  Cards.update({_id: cardId}, {$set: {playerVotes: []}});
};
getCardVotes = function (cardId) {
  return Cards.findOne( {_id: cardId } ).playerVotes.length;
};
