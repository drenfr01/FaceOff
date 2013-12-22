// Option 1, create a new game
Template.mainMenu.events({
  'click #new_game' : function () {
    
    //use unique id to switch between games
    Games.insert( { active: 1 } );
    Router.go('setup');
  },

  // Option 2, join a game
  'click #join_game' : function () {
    Router.go('gameList');
  }
});

//Vote for a card
Template.mainMenu.stateIs = function (state) {
  return Session.get("state") === state;
};

Template.mainMenu.displayedImages = function () {
  return Cards.find( {in_play: 1} );
};

  Template.mainMenu.getTime = function() {
  timer.time_dep.depend();
  return timer.time;
};

//Want flash the winner and display the vote count.
endVoting = function() {
  Session.set("game_state", "display_phase");

//-------------------------------------------------------
  //TODO: Use session variable here
  //TODO: Handle ties
  var winning_card = Cards.find({in_play: 1}, {sort: {votes: -1}, limit: 1});
  var winning_card_path = winning_card.fetch()[0].path;
  $(winning_card_path).css({'opacity': '0.4'});
  console.log(winning_card_path);
//-------------------------------------------------------

  // Start the next round in 7 seconds
  setTimer( 7, "getNextImages");
};

//Control flow for game
//This function will get called when the timer decrements to 0, and will drive the gameplay
getNextImages = function () {
  Session.set("game_state", "voting_phase");

  //Clear cards currently in play
  Cards.find().forEach( function (card) {
    Cards.update( {_id: card._id}, {$set: { in_play: 0 } } );
  });

  //Put new cards into play
  selectRandomCards(2).forEach(function (id) {
    Cards.update( {_id: id}, {$set: { in_play: 1, votes: 0} } );
  });
  setTimer(getVotingTime(), "endVoting");
};

selectRandomCards = function(numberOfCards) {
  var randomNumber = Math.floor(Math.random() * (Cards.find().count()-1)) + 1;
  var cards = Cards.find( {active: 1});
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

setTimer = function(time, func) {
  timer.time = time;
  timer.timer_function = func;
  // Move this to the timer instantiation
  if(!timer.time_dep)
    timer.time_dep = new Deps.Dependency;
};

decrementTimer = function() {
  timer.time = timer.time - 1;
  timer.time_dep.changed();
  if (timer.time === 0) {
    //Currently we only support running functions without arguments
    runFunction(timer.timer_function);
  }
};

function runFunction(name, arguments)
{
  switch(name) {
    case "getNextImages": getNextImages(); break;
    case "endVoting": endVoting(); break;
  }
}

function getVotingTime() {
  return Games.findOne( { number: Session.get("game") } ).voting_time;
}

timer = {
  game: null,
  time: 0,
  timer_function: null,
  time_dep: null
};
