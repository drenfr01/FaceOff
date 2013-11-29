Users = new Meteor.Collection("users");
Cards = new Meteor.Collection("cards");
Games = new Meteor.Collection("games");

//Client code
if (Meteor.isClient) {
  Meteor.startup(function () {
    Session.set("state", "landing")
  })

  Template.main.events({
    'click #new_game' : function () {
      //Set up a new game here
      Session.set("state", "setup");

      // Get the most recent game
      var most_recent_game = Games.findOne( {active: 1}, {sort: {number: -1} } );
      //Set most recent number to 0 if this is the first game ever.
      if(!most_recent_game) {
        var most_recent_number = 0;
      }
      else {
        var most_recent_number = most_recent_game.number;
      }
      Games.insert( { number: most_recent_number + 1, active: 1 } );
      Session.set("game", most_recent_number + 1);
    }
  });

  Template.setup.events({
    'click #start' : function() {
      // Grab timer value from the input box
      var timer_value = document.getElementById("timer").value;

      if(!timer_value) {
        timer_value = 20;
      }

      var current_game = Games.findOne( {number: Session.get("game")} )
      Games.update( { _id: current_game._id}, {$set: { voting_time: timer_value } } );
      setTimer(timer_value, "endVoting");
      Meteor.setInterval( decrementTimer , 1000);

      Session.set("state", "in_game");
      Session.set("game_state", "voting_phase");
      //TODO: Build a function to set in_play
      selectRandomCards(2).forEach( function (id) {
        Cards.update( {_id: id}, {$set: { in_play: 1, votes: 0} } )
      })
    }
  })

  Template.displayedImage.events({
    'click' : function () {
      console.log(Session.get("game_state"))
      if (Session.get("game_state") === "voting_phase") {
        Cards.update( {_id: this._id}, {$inc: { votes: 1} } )};
    }
  })


  Template.gameState.gameStateIs = function (game_state) {
    return Session.get("game_state") === game_state
  }

  Template.main.stateIs = function (state) {
    return Session.get("state") === state
  }

  Template.main.displayedImages = function () {
    return Cards.find( {in_play: 1} )
  }

  Template.main.getTime = function() {
    return Session.get("timer");
  }

  //Want flash the winner and display the vote count.
  endVoting = function() {
    Session.set("game_state", "display_phase");
    //Show votes during the winner stage
    console.log(document.getElementById("votes").style);
    document.getElementById("votes").style.visibility="visible";
    //TODO: Use session variable here
    //TODO: Handle ties
    var winning_card = Cards.find({in_play: 1}, {sort: {votes: -1}, limit: 1})

    var winning_card_path = winning_card.fetch()[0].path
    $(winning_card_path).css({'opacity': '0.4'})
    console.log(winning_card_path)
    // Start the next round in 7 seconds
    setTimer( 7, "getNextImages")
  }

  //Control flow for game
  //This function will get called when the timer decrements to 0, and will drive the gameplay
  getNextImages = function () {
    Session.set("game_state", "voting_phase")
    console.log(document.getElementById("votes").style)
    document.getElementById("votes").style.visibility="hidden";
    //TODO: Build a function to set in_play
    Cards.find().forEach( function (card) {
      Cards.update( {_id: card._id}, {$set: { in_play: 0 } } );
    })

    selectRandomCards(2).forEach(function (id) {
      Cards.update( {_id: id}, {$set: { in_play: 1, votes: 0} } );
    })
    setTimer(getVotingTime(), "endVoting")
  }

  selectRandomCards = function(numberOfCards) {
    var randomNumber = Math.floor(Math.random() * (Cards.find().count()-1)) + 1;
    var cards = Cards.find( {active: 1});
    var cards_array = new Array(0);

    //insert each path into the cards array
    cards.forEach( function (card) {
      cards_array.push( card._id );
    })

    var card1 = Random.choice(cards_array)
    var filtered_cards_array = cards_array.filter( function (element) {
      return element != card1
    });
    var card2 = Random.choice(filtered_cards_array);

    return [card1, card2];
  }
}

//Server code
if (Meteor.isServer) {
  Meteor.startup(function () {
    //Set the initial State of the application
    Cards.remove({});
    Games.remove({});
    if (Cards.find().count() == 0) {
      var image_paths = ['0001.jpg'
                        ,'0002.jpg'
                        ,'0003.jpg'
                        ,'0004.jpg'
                        ,'0005.jpg'
                        ,'0006.jpg'
                        ,'0007.jpg'
                        ,'0008.jpg'
                        ,'0009.jpg'
                        ,'0000.jpg'];
    //path: relative path to file, active: still in the game, in_play: currently on the board
    for (var i = 0; i < image_paths.length; i++)
      Cards.insert({path: image_paths[i], active: 1, in_play: 0});
    }

    //Clear certain session variables
    // TODO: Store "session variables to reset somewhere"
    //Session.set("timer", 0)
  });
}

setTimer = function(time, func) {
  console.log(time, func, Session.get("timer"));
  Session.set("timer", time);
  Session.set("timer_function", func);
}

decrementTimer = function() {
  Session.set("timer", Session.get("timer") - 1 )
  console.log(Session.get("timer"));
  console.log(Session.get("timer_function"));
  if (Session.get("timer") == 0) {
    //Currently we only support running functions without arguments
    runFunction(Session.get("timer_function"));
  }
}

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
