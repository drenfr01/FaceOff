addPlayer = function(gameNumber) {
  return Players.insert({gameNumber: gameNumber});
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
      isPaused: false
    });

    return maxGameNumber;
};
addPlayerToGame = function(gameNumber, playerId) {
  Games.update({number: gameNumber}, { $push: {players: playerId} });
};
addCard = function(url, gameNumber) {
  return Cards.insert({path: url,
    in_play: [],
    usersVoting : [],
    active: gameNumber});
};
addCardToGame = function(cardId, gameNumber) {
  Games.update({number: gameNumber},
    {$push: {cards: cardId }});
}
addCardToPlayer = function(playerId, cardId) {
  Players.update( { _id: playerId },
    { $push: { cardIds: cardId } } );
}
getPlayersInGame = function(gameNumber) {
  return Players.find({gameNumber: gameNumber});
}