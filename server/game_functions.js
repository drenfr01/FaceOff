getNextImages = function (gameNumber) {
  //Clear cards currently in play
  Cards.find({active: gameNumber}).forEach( function (card) {
    Cards.update( {_id: card._id}, {$pull: { in_play: gameNumber } } );
  });

  //Put new cards into play
  selectRandomCards(gameNumber, 2).forEach(function (id) {
    Cards.update( {_id: id}, {$push: { in_play: gameNumber} } , {$set: {votes: 0} } );
  });
  setTimer(gameNumber, getVotingTime(gameNumber), "endVoting");
};

endVoting = function(gameNumber) {
  // TODO: Update the votes to be visible

  // Start the next round in 7 seconds
  setTimer(7, "getNextImages");
};


selectRandomCards = function(gameNumber, numberOfCards) {
  var randomNumber = Math.floor(Math.random() * (Cards.find({active: gameNumber}).count()-1)) + 1;
  var cards = Cards.find( {active: gameNumber});
  var cards_array = new Array(0);

  //insert each path into the cards array
  cards.forEach( function (card) {
    cards_array.push( card._id );
  });

  var card1 = Random.choice(cards_array);
  var filtered_cards_array = cards_array.filter( function (element) {
    return element != card1;
  });
  var card2 = Random.choice(filtered_cards_array);

  return [card1, card2];
};
