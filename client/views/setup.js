Template.setup.events({
  'click #start' : function() {
    // Grab timer value from the input box
    var timer_value = document.getElementById("timer").value;

    if(!timer_value) {
      timer_value = 20;
    }

    //TODO: initialize game function
    //Find largest game number and insert
    var maxGame = Games.findOne({active: 1}, {sort: {number: -1}});
    console.log(maxGame);
    var maxGameNumber = 0;

    if(!maxGame)
      maxGameNumber = 0;
    else
      maxGameNumber = maxGame.number + 1; 
    
    var newGameId = Games.insert({number: maxGameNumber, active:1, voting_time: timer_value});
    setTimer(timer_value, "endVoting");
    Meteor.setInterval( decrementTimer , 1000);

    Router.go('inGame', {number: maxGameNumber});
    getNextImages();
  }
});
