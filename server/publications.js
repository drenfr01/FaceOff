//place publications here
Meteor.publish('cards', function() {
  return Cards.find();
});

Meteor.publish('games', function() {
  return Games.find();
});

Meteor.publish('timer', function() {
  //Update this to only publish the game and time left
  return Timer.find();
});

Meteor.publish("userData", function() {
  return Meteor.users.find({_id: this.userId},
    {fields: {'gameNumber': 1, 'hasVoted': 1}});
});
