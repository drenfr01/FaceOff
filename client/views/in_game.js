Template.inGame.helpers({
  number: function () { return this.game.number; },
  displayedImages: function () {
    cardsInPlay =  this.game.cardsInPlay; 
    return Cards.find({_id: {$in: cardsInPlay}});
  },
  time: function() { return Timer.findOne({game: this.game.number}).time; },
  //TODO: this is the same as the code in lobby. we should refactor this to
  //common function
  getPlayers: function() {
    //This prevents an undefined error while server updates first time
    Session.setDefault('playersInGame',[]);
    Meteor.call('getPlayersInGame', this.game.number,
      function(error, names) {
          if(error) {
            throwError(error.reason);
          }
          Session.set('playersInGame', names);
      });
    return Session.get('playersInGame');
  },
  hasVoted: function() {
    return Players.findOne({_id: Session.get("playerId")}).hasVoted === 1;
  },
  votingPhase: function() {
    return this.game.phase === "Voting";
  },
  pauseGame: function() {
    return this.game.isPaused;
  },
  gameOverviewToggled: function() {
    return Session.get('gameOverviewToggled');
  }
});

Template.inGame.created = function() {
  Session.set('gameOverviewToggled',false);
};

Template.inGame.events({
  'click #pauseButton': function(e) {
    e.preventDefault();
    Meteor.call('pauseGame', this.game.number,
      function(error, result) {
        if(error) {
          throwError(error.reason);
        }
      });
    },
  'click #resumeButton': function(e) {
    e.preventDefault();
    Meteor.call('resumeGame', this.game.number,
      function(error, result) {
        if(error) {
          throwError(error.reason);
        }
      });
  },
  'click #gameOverviewButton': function(e) {
    e.preventDefault();
    console.log('Clicked');
    //flip the gameOverviewToggled boolean
    Session.set('gameOverviewToggled',!Session.get('gameOverviewToggled'));
  }
});
