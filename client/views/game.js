Template.game.events({
  'click' : function () {
    //need a call to server side message to update users
    //TODO: add hook to make sure user logged in

    Meteor.call('addPlayerToGame', this.number, 
      function(error, attributes) {
        if(error) {
          alert(error.reason);
        } 
        
        Router.go('lobby', {gameNumber: attributes.gameNumber, 
          playerId: attributes.playerId});
      }
    );
  }
});
