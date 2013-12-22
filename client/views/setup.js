Template.setup.events({
  'click #start' : function() {
    // Grab timer value from the input box
    var timer_value = document.getElementById("timer").value;

    if(!timer_value) {
      timer_value = 20;
    }

    var current_game = Games.findOne( {number: Session.get("game")} );
    Games.update( { _id: current_game._id}, {$set: { voting_time: timer_value } } );
    setTimer(timer_value, "endVoting");
    Meteor.setInterval( decrementTimer , 1000);

    Session.set("state", "in_game");
    getNextImages();
  }
});
