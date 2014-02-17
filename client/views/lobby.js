Template.lobby.helpers({
  getUsers: function() {
    //This prevents an undefined error while server updates first time
    Session.setDefault('usersInGame',[{emails: [{address: []}]}]);
    console.log(this);
    console.log(this.game.phase);
    Meteor.call('getUsersInGame', this.game.number,
      function(error, users) {
          if(error) {
            throwError(error.reason);
          }
          Session.set('usersInGame', users);
      });
    return Session.get('usersInGame');
  },
  beginGame: function() {
      },
  gamePhase: function() {
    if(this.game.phase !== "Lobby") 
      Router.go('inGame', {gameNumber: this.game.number, 
        playerId: Session.get("playerId")});
    return this.game.phase;
  }
});

Template.lobby.events({
  'click #enterGame' : function(e) {
    e.preventDefault();

    var attributes = {
      gameNumber: this.game.number,
      playerId: this.player._id
    };
    Meteor.call('assignCards', attributes, function(error, number) {
      if (error) {
        throwError(error.reason);
        Router.go('lobby', {gameNumber: attributes.gameNumber,
          playerId: attributes.playerId});
      }
      Router.go('inGame', {gameNumber: attributes.gameNumber,
        playerId: attributes.playerId});
    });
  }
});
