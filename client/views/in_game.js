Template.inGame.helpers({
  number: function () { return this.game.number; },
  displayedImages: function () {
    cardsInPlay =  this.game.cardsInPlay; 
    return Cards.find({_id: {$in: cardsInPlay}});
  },
  time: function() { return Timer.findOne({game: this.game.number}).time; },
  getUsers: function() {
    //This prevents an undefined error while server updates first time
    Session.setDefault('usersInGame',[{emails: [{address: []}]}]);
    Meteor.call('getUsersInGame', this.game.number,
      function(error, users) {
          if(error) {
            throwError(error.reason);
          }
    //      data[this.number] = users;
          Session.set('usersInGame', users);
      });
    return Session.get('usersInGame');
  },
  hasVoted: function() {
    return Meteor.user().hasVoted === 1;
  },
  votingPhase: function() {
    return this.game.phase === "Voting";
  },
  pauseGame: function() {
    return this.game.isPaused;
  }
});

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
  }
});
