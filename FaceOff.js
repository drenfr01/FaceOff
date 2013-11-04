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
      Meteor.setInterval( getNextImages , 2000);

      //TODO: Build a function to set in_play
      selectRandomCards(2).forEach( function (card) {
        Cards.update( {_id: card._id}, {$set: { in_play: 1} } )
      })
    }
  });

  Template.main.getState = function () {
    return Session.get("state");
  }

  Template.main.stateIs = function (state) {
    return Session.get("state") === state
  }

  Template.main.displayedImages = function () {
    return Cards.find( {in_play: 1} )
  }

  getNextImages = function () {
    console.log("getNextImages has been called")
    //TODO: Build a function to set in_play
    Cards.find().forEach( function (card) {
      Cards.update( {_id: card._id}, {$set: { in_play: 0 } } );
    })

    selectRandomCards(2).forEach(function (card) {
      Cards.update( {_id: card._id}, {$set: { in_play: 1}})
    })
    
  }

  selectRandomCards = function(numberOfCards) {
    var randomNumber = Math.floor(Math.random() * (Cards.find().count()-1)) + 1;
    var cards = Cards.find({in_play: 0}, {limit: numberOfCards, skip: randomNumber});
    console.log(cards)
    return cards
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

