Template.game.events({
  'click' : function () {
    //need a call to server side message to update users
    //TODO: add hook to make sure user logged in

    Meteor.call('joinUserToGame', Meteor.userId, this.number, 
      function(error, result) {
        if(error) {
          alert(error.reason);
        } 
        
        Router.go('inGame', {number: result});
      }
    );
  }
});
