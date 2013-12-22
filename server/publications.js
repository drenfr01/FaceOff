//place publications here
Meteor.publish('cards', function() {
  return Cards.find();
});

Meteor.publish('games', function() {
  return Games.find();
});
