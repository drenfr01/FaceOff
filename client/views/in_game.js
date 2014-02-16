Template.inGame.helpers({
  number: function () { return this.number; },
  displayedImages: function () {
    cardsInPlay =  Games.findOne({number: this.number}).cardsInPlay; 
    Cards.find({_id: {$in: cardsInPlay}});
  },
  time: function() { return Timer.findOne({game: this.number}).time; },
  getUsers: function() {
    //This prevents an undefined error while server updates first time
    Session.setDefault('usersInGame',[{emails: [{address: []}]}]);
    Meteor.call('getUsersInGame', this.number,
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
    return this.phase === "Voting";
  },
  pauseGame: function() {
    return this.isPaused;
  }
});

Template.inGame.events({
  'click #pauseButton': function(e) {
    e.preventDefault();
    Meteor.call('pauseGame', this.number,
      function(error, result) {
        if(error) {
          throwError(error.reason);
        }
      });
    },
  'click #resumeButton': function(e) {
    e.preventDefault();
    Meteor.call('resumeGame', this.number,
      function(error, result) {
        if(error) {
          throwError(error.reason);
        }
      });
  }
});
