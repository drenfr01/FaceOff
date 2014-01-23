Template.setup.events({
  'click #start' : function(e) {
    // Grab timer value from the input box
    e.preventDefault();
    var timer_value = document.getElementById("timer").value;

    if(!timer_value) {
      timer_value = 20;
    }

    var gameAttributes = {
      timer_value: timer_value,
      user_id: Meteor.user()
    };

    Meteor.call('setupGame', gameAttributes, function(error, number) {
      if (error) {
        console.log(error.reason);
        return alert(error.reason);
      }
      Router.go('inGame', {number: number});
    });
  }
});
