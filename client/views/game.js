Template.game.events({
  'click' : function () {
    //need a call to server side message to update users
    //TODO: add hook to make sure user logged in

    attributes = {
      gameNumber: this.number,
      email: Meteor.user().emails[0].address
    };
    Meteor.call('addPlayerToGame', attributes, 
      function(error, attributes) {
        if(error) {
          alert(error.reason);
        } 
        
        Session.set("playerId", attributes.playerId);         
        Router.go('lobby', {gameNumber: attributes.gameNumber, 
          playerId: attributes.playerId});
      }
    );
  }
});
