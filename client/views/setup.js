Template.setup.events({
  'click #start' : function() {
    // Grab timer value from the input box
    var timer_value = document.getElementById("timer").value;

    if(!timer_value) {
      timer_value = 20;
    }

    var gameAttributes = {
      timer_value: timer_value
    }

    Meteor.call('setupGame', gameAttributes, function(error, number) {
      if (error)
        return alert(error.reason);

      Router.go('inGame', {number: number});
    });
  }
});
