//Place data to load into server on start here
Cards.remove({});
Games.remove({});
Timer.remove({});
Players.remove({});
//TODO: Probably want to take another look at this 
Meteor.users.update({}, {$set: {gameNumber: -1, cards: []}}, {multi: true});
