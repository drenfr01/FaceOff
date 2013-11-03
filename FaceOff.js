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
      Meteor.setInterval( getNextImages , 10000);
      // TODO: Use random card function
      var cards = Cards.find()
      cards.forEach( function (card) {
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
    Cards.find().forEach( function (card) {
      Cards.update( {_id: card._id}, {$set: { in_play: 0 } } );
    })
    // TODO: Use random card function
    
  }
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    //Set the initial State of the application
    Cards.remove({});
    if (Cards.find().count() == 0) {
      var image_paths = ['0001.jpg'
                        ,'0002.jpg'];
    //path: relative path to file, active: still in the game, in_play: currently on the board
    for (var i = 0; i < image_paths.length; i++)
      Cards.insert({path: image_paths[i], active: 1, in_play: 0});
    }
  });
}

