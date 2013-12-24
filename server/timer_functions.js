decrementTimer = function (gameNumber) {
  var gameTimer = Timer.findOne({game: gameNumber});

  Timer.update({_id: gameTimer._id}, {$inc: {time: -1} } );
  if(gameTimer.time === 0)
    runFunction(gameTimer.timerFunction)
}

//Run function, there is a much better example of how to do this in the Node JS training example
runFunction = function (name, arguments)
{
  switch(name) {
    case "getNextImages": getNextImages(); break;
    case "endVoting": endVoting(); break;
  }
}

setTimer = function(gameNumber, time, func) {
  var gameTimer = Timer.findOne({game: gameNumber});

  Timer.update({_id: gameTimer._id}, {time: time, timerFunction: func} );
}

initializeTimer = function(gameNumber, time) {
  Timer.insert({game: gameNumber, votingTime: time});
  Meteor.setInterval( decrementTimer(gameNumber) , 1000);
}

getVotingTime = function(gameNumber) {
  return Timer.findOne({game: gameNumber}).votingTime;
}