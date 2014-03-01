
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
      phase: "Lobby",
      activePlayerIds: [],
      cardsInPlay: []
    });

    return maxGameNumber;
};

addCardToGame = function(cardId, gameNumber) {
  Games.update({number: gameNumber},
    {$push: {cards: cardId }});
};

//TODO: Update will NOT work unless removeActivePlayerIds is called 
//before it (with the exception of the first time). 
//This kind of link isn't great
updateActivePlayerIds = function(gameNumber) {
  activePlayerIds = [];
  activePlayerIds.push(popAndReturnGamePlayer(gameNumber));
  activePlayerIds.push(popAndReturnGamePlayer(gameNumber));
  Games.update({number: gameNumber}, {$push: {activePlayerIds: {$each: activePlayerIds}}});
  return activePlayerIds;
};

removeActivePlayerIds = function(gameNumber) {
  activePlayerIds = Games.findOne({number: gameNumber}).activePlayerIds;
  Games.update({number: gameNumber}, {$set: {activePlayerIds: []}});
  Games.update({number: gameNumber}, {$push: {players: {$each: activePlayerIds}}});
};
//This does NOT add the player back onto the queue. That is the calling
//functions responsibility
popAndReturnGamePlayer = function(gameNumber) {
  playerId = Games.findOne({number: gameNumber}).players[0];
  Games.update({number: gameNumber}, {$pop: {players: -1}});
  return playerId;
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

