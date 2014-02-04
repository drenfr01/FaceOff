Template.setup.events({
  'click #start' : function(e) {
    e.preventDefault();

    //Set voting phase length
    var timerValue = $("#timer").val();

    cardSource = Session.get("source");

    //Set website base URL call
    if( cardSource  === "upload" ) {
        baseUrl = ".";
    } else if ( cardSource  === "natureporn" ) {
        baseUrl = "http://www.reddit.com/r/natureporn/";
    } else if ( cardSource  === "boxers") {
        baseUrl = "http://www.reddit.com/r/boxers/"; 
    } else if ( cardSource === "other" ) {
      baseUrl = "http://www.reddit.com/r/" + $("#customUrl").val() + "/";
    } else { 
      baseUrl = "error";
    }

    //TODO: current defaults sorting to top
    //ttp://www.reddit.com/r/science/top?sort=top&t=all&limit=10
    if ( cardSource !== "--" ) {
      urlParams = {
        t : $("#time_range").val(),
        limit : $("#limit").val()
      };
      fullUrl = baseUrl + $("#category").val() + ".json?" +
        $.param(urlParams);
        
    }

    var gameAttributes = {
      timer_value: timerValue,
      user_id: Meteor.user(),
      cardsUrl: fullUrl
    };

    Meteor.call('setupGame', gameAttributes, function(error, number) {
      if (error) {
        throwError(error.reason);
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
    return Session.get("source") !== "--"; 
  },
  isOther: function() {
    return Session.get("source") === "other";
   }
});
