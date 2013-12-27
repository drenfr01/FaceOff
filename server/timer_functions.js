decrementTimers = function () {
  //Find and update all timers, this decrements each (active) timer at the same time
  var activeTimers = Timer.find({active: 1})

  activeTimers.forEach(function (timer) {
    Timer.update({_id: timer._id}, {$inc: {time: -1} } );
    if(timer.time === 0){
      runFunction(timer.timerFunction, timer.game);
    }
  })
}

//Run function, there is a much better example of how to do this in the Node JS training example
runFunction = function (name, gameNumber)
{
  switch(name) {
    case "getNextImages": getNextImages(gameNumber); break;
    case "endVoting": endVoting(gameNumber); break;
  }
}

setTimer = function(gameNumber, time, func) {
  var gameTimer = Timer.findOne({game: gameNumber});

  Timer.update({_id: gameTimer._id}, {$set : {time: time, timerFunction: func} } );
}

getVotingTime = function(gameNumber) {
  return Timer.findOne({game: gameNumber}).votingTime;
}

initializeTimer = function(gameNumber, time) {
  Timer.insert({game: gameNumber, votingTime: time, time: time, active: 1});
}

startCountDown = function() {
  Meteor.setInterval( decrementTimers , 1000);
}
