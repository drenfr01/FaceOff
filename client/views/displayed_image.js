Template.displayedImage.helpers({
  path: function() {return this.path;},
  votes: function() {return this.usersVoting.length;},
  //get phase from game to see if we show votes or not
  phase: function() {
    game = Games.findOne({number: Meteor.user().gameNumber});
    return game.phase === "Display";
  }
});

Template.displayedImage.events({
  'click .crop': function() {
    //Voting data model:
    //add userIDs to image, sum for count,
    //Dumb way: adding has_voted flag to userId, flip it
    Meteor.call('voteForImage', Meteor.userId(), this._id,
      function(error, response) {
        if(error)
          throwError(error.reason);
          //TODO: this appeared to solve a bug where you could vote twice. No idea how...
          return false;
      });
  },
  'click #removeCard': function() {
    Meteor.call('removeCard', this._id,
      function(error,response) {
        if(error)
          throwError(error.reason);
          //TODO: refer to above line...we should really figure this out
          return false;
        });
    }
});
