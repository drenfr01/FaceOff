Template.lobby.helpers({
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
