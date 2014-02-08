Template.lobby.helpers({
  getUsers: function() {
    //This prevents an undefined error while server updates first time
    Session.setDefault('usersInGame',[{emails: [{address: []}]}]);
    Meteor.call('getUsersInGame', this.number,
      function(error, users) {
          if(error) {
            throwError(error.reason);
          }
          Session.set('usersInGame', users);
      });
    return Session.get('usersInGame');
  },
});

Template.lobby.events({
  'click #enterGame' : function(e) {
    e.preventDefault();

    var lobbyAttributes = {
      number: this.number
    }
    Meteor.call('assignCards', lobbyAttributes, function(error, number) {
      if (error) {
        throwError(error.reason);
        Router.go('lobby', {number: number});
      }
      Router.go('inGame', {number: number});
    });
  }
})