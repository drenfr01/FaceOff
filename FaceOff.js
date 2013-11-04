Users = new Meteor.Collection("users");
Cards = new Meteor.Collection("cards");

if (Meteor.isClient) {
  Meteor.startup(function () {
    Session.set("state", "landing")
  })

  Template.main.events({
    'click #new_game' : function () {
      //Set up a new game here
      Session.set("state", "in_game");
      Meteor.setInterval( getNextImages , 5000);

      //TODO: Build a function to set in_play
      selectRandomCards(2).forEach( function (id) {
        Cards.update( {_id: id}, {$set: { in_play: 1} } )
      })
    }
  });

  Template.displayedImage.events({
    'click' : function () {
      Cards.update( {_id: this._id}, {$inc: { votes: 1} } )
      console.log(this);
    }
  })

  Template.main.getState = function () {
    return Session.get("state");
  }

  Template.main.stateIs = function (state) {
    return Session.get("state") === state
  }

  Template.main.displayedImages = function () {
    return Cards.find( {in_play: 1} )
  }
  
  //Want flash the winner and display the vote count. 
  endVoting = function() {
    //TODO: Use session variable here
    //TODO: Handle ties
    var winning_card = Cards.find({in_play: 1}, {sort: {votes: -1}, limit: 1})
   
    var winning_card_path = winning_card.fetch()[0].path
    $(winning_card_path).css({'background-color': '10 px solid #967'}) 
    console.log(winning_card_path) 
    
  }

  getNextImages = function () {
    //TODO: Build a function to set in_play
    endVoting();
    Cards.find().forEach( function (card) {
      Cards.update( {_id: card._id}, {$set: { in_play: 0 } } );
    })

    selectRandomCards(2).forEach(function (id) {
      Cards.update( {_id: id}, {$set: { in_play: 1, votes: 0} } );
    })
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

if (Meteor.isServer) {
  Meteor.startup(function () {
    //Set the initial State of the application
    Cards.remove({});
    if (Cards.find().count() == 0) {
      var image_paths = ['0001.jpg'
                        ,'0002.jpg'
                        ,'0003.jpg'
                        ,'0004.jpg'
                        ];
    //path: relative path to file, active: still in the game, in_play: currently on the board
    for (var i = 0; i < image_paths.length; i++)
      Cards.insert({path: image_paths[i], active: 1, in_play: 0});
    }
  });
}

