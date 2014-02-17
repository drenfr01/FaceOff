Template.displayedImage.helpers({
  path: function() {return this.path;},
  votes: function() {return this.playerVotes.length;},
  //get phase from game to see if we show votes or not
  phase: function() {
    player = Players.findOne({_id: Session.get("playerId")});
    game = Games.findOne({number: player.gameNumber});
    return game.phase === "Display";
  }
});

Template.displayedImage.events({
  'click .crop': function() {
    //this session variable created in setup.js
    currentPlayerId = Session.get("playerId");
    Meteor.call('voteForImage', currentPlayerId, this.playerId, this._id,
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
