Template.inGame.helpers({
  number: function () { return this.number; },
  displayedImages: function () {return Cards.find({active: this.number, in_play: this.number} ); },
  time: function() { return Timer.findOne({game: this.number}).time; },
  getUsers: function() { 
    //This prevents an undefined error while server updates first time
    Session.setDefault('usersInGame',[{emails: [{address: []}]}]);
    Meteor.call('getUsersInGame', this.number, 
      function(error, users) {
          if(error) {
            return alert(error.reason);
          }
    //      data[this.number] = users;
          Session.set('usersInGame', users);
      });
    console.log(Session.get('usersInGame'));
    return Session.get('usersInGame');
  },
  hasVoted: function() {
    return Meteor.user().hasVoted === 1;
  }
});
