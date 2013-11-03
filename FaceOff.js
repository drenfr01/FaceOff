Users = new Meteor.Collection("users");
Cards = new Meteor.Collection("cards");

if (Meteor.isClient) {
  Meteor.startup(function () {
    Session.set("state", "landing")
  })

  Template.main.events({
    'click #new_game' : function () {
      Session.set("state", "in_game");
    }
  });

  Template.main.getState = function () {
    return Session.get("state");
  }

  Template.main.stateIs = function (state) {
    return Session.get("state") === state
  }
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    //Set the initial State of the application
    Cards.remove({});
    if (Cards.find().count() == 0) {
      }
  });
}
