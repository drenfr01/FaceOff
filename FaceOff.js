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
      Session.set("current_images", {})
    }
  });

  Template.main.getState = function () {
    return Session.get("state");
  }

  Template.main.stateIs = function (state) {
    return Session.get("state") === state
  }

  Template.main.displayedImages = function () {
    return Cards.find();
  }

  getNextImages = function () {
    //    
    console.log("getNextImages has been called")
    var images = Cards.find();
    //Session.set("current_images", images )
  }
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    //Set the initial State of the application
    Cards.remove({});
    if (Cards.find().count() == 0) {
      var image_paths = ['0001.jpg'
                        ,'0002.jpg'];
    for (var i = 0; i < image_paths.length; i++)
      Cards.insert({path: image_paths[i], active: 1});
    }
  });
}

