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

getNextImages = function (gameNumber) {
  //Push users from at_bat back onto the queue of users
  lastTurnsUsers = Games.findOne( {number: gameNumber} ).atBat
  Games.update({ number: gameNumber }, { $set: { phase: "Voting", atBat: [] } });
//Games.update({ number: gameNumber }, { $set: { phase: "Voting", atBat: [] }. $push { users : lastTurnsUsers } });

  users = setAtBatUsers(gameNumber);

  Cards.find({active: gameNumber}).forEach( function (card) {
    Cards.update( {_id: card._id}, {$pull: { in_play: gameNumber }, 
      $set: {usersVoting: []}});
  });

  //Put new cards into play
  selectRandomCards(gameNumber, 2).forEach(function (id) {
    //TODO: this assumes one game, will need to make the reset more
    //granular
    Meteor.users.update({}, {$set: {hasVoted: 0}}, {multi: true});
    Cards.update( {_id: id}, {$push: { in_play: gameNumber} } , {$set: {votes: 0} } );
  });
  setTimer(gameNumber, getVotingTime(gameNumber), "endVoting");
};

endVoting = function(gameNumber) {
  // TODO: Update the votes to be visible
  Games.update({number: gameNumber}, {$set: {phase: "Display"}});
  // Start the next round in 7 seconds
  setTimer(gameNumber, 3, "getNextImages");
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

setAtBatUsers = function(gameNumber) {
  users = Games.find()
}