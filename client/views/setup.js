Template.setup.events({
  'click #start' : function(e) {
    // Grab timer value from the input box
    e.preventDefault();

    //Set voting phase length
    var timer_value = document.getElementById("timer").value;

    if(!timer_value) {
      timer_value = 20;
    }

    //Grab value of radio buttons to determine source of cards
    source = $('input[name="cardSource"]:checked').val();

    var gameAttributes = {
      timer_value: timer_value,
      user_id: Meteor.user(),
      source: source
    };

    Meteor.call('setupGame', gameAttributes, function(error, number) {
      if (error) {
        alert(error.reason);
      }
      Router.go('inGame', {number: number});
    });
  }, 
  'click #checkAPI' : function(e) {
    e.preventDefault();
    apiAttributes = {};
    Meteor.call('getImagesFromAPI', apiAttributes, 
        function(error, number) {
          if(error) {
            alert(error.reason);
          }
        });
  }
});
