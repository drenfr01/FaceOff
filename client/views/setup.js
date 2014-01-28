Template.setup.events({
  'click #start' : function(e) {
    // Grab timer value from the input box
    e.preventDefault();

    //Set voting phase length
    var timer_value = document.getElementById("timer").value;

    if(!timer_value) {
      timer_value = 20;
    }

    cardSource = Session.get("source");

    //Set website base URL call
    if( cardSource  === "Default" ) {
        baseUrl = ".";
    } else if ( cardSource  === "natureporn" ) {
        baseUrl = "http://www.reddit.com/r/natureporn/";
    } else if ( cardSource  === "boxers") {
        baseUrl = "http://www.reddit.com/r/boxers/"; 
      } else {
        baseUrl = "error";
      }

    //Build full json call
    //TODO: current defaults sorting to top
    //ttp://www.reddit.com/r/science/top?sort=top&t=all&limit=10
    if ( cardSource !== "Default" ) {
      urlParams = {
        t : $("#time_range").val(),
        limit : $("#limit").val()
      };
      fullUrl = baseUrl + $("#category").val() + ".json?" +
        $.param(urlParams);
      console.log(fullUrl);
        
    }

    var gameAttributes = {
      timer_value: timer_value,
      user_id: Meteor.user(),
      cardsUrl: fullUrl
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
  },
  'change #test': function(e) {
    Session.set("source",$("#test").val());
  }
});

Template.setup.helpers({
  isNotDefault: function() {
    return Session.get("source") !== "Default"; 
  }
});
