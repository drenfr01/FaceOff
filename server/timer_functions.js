decrementTimers = function () {
  //Find and update all timers, this decrements each (active) timer at the same time
  var activeTimers = Timer.find({active: 1})

  activeTimers.forEach(function (timer) {
    timer.update({_id: timer._id}, {$inc: {time: -1} } );
    if(timer.time === 0){
      runFunction(timer.timerFunction)
    }
  })
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

getVotingTime = function(gameNumber) {
  console.log(Timer.findOne({game: gameNumber}).votingTime)
  console.log(Timer.findOne({game: gameNumber}))
  return Timer.findOne({game: gameNumber}).votingTime;
}

initializeTimer = function(gameNumber, time) {
  Timer.insert({game: gameNumber, votingTime: time, time:-1, active: 1});
}

startCountDown = function() {
  Meteor.setInterval( decrementTimers , 1000);
}