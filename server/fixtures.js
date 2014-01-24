//Place data to load into server on start here
Cards.remove({});
Games.remove({});
Timer.remove({});
//TODO: Probably want to take another look at this 
Meteor.users.update({}, {$set: {gameNumber: -1}}, {multi: true});

if (Cards.find().count() === 0) {
  var image_paths = ['0001.jpg',
                    '0002.jpg',
                    '0003.jpg',
                    '0004.jpg',
                    '0005.jpg',
                    '0006.jpg',
                    '0007.jpg',
                    '0008.jpg',
                    '0009.jpg',
                    '0000.jpg'];
  //path: relative path to file, active: still in the game, in_play: currently on the board
  for (var i = 0; i < image_paths.length; i++)
    Cards.insert({path: image_paths[i], active: [], in_play: [],
      usersVoting: [] });
}
