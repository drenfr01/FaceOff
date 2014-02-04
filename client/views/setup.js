Template.setup.events({
  'click #start' : function(e) {
    // Grab timer value from the input box
    e.preventDefault();

    //Check then set voting phase length
   
    var timerValue = $("#timer").val();
    if( ! $.isNumeric( timerValue ) ) {
    }

    cardSource = Session.get("source");

    //Set website base URL call
    if( cardSource  === "upload" ) {
        baseUrl = ".";
    } else if ( cardSource  === "natureporn" ) {
        baseUrl = "http://www.reddit.com/r/natureporn/";
    } else if ( cardSource  === "boxers") {
        baseUrl = "http://www.reddit.com/r/boxers/"; 
    } else if ( cardSource === "other" ) {
      baseUrl = $("#url").val();
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
      timer_value: timerValue,
      user_id: Meteor.user(),
      cardsUrl: fullUrl
    };

    Meteor.call('setupGame', gameAttributes, function(error, number) {
      if (error) {
        throwError("Login must be numeric");
        Router.go('setup');
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
