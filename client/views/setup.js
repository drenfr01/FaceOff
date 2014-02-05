Template.setup.events({
  'click #joinLobby' : function(e) {
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

    if ( cardSource !== "--" ) {
      urlParams = {
        t : $("#time_range").val(),
        limit : $("#limit").val()
      };
      fullUrl = baseUrl + $("#category").val() + ".json?" +
        $.param(urlParams);
       console.log("URL entered: " + fullUrl);
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
      Router.go('lobby', {number: number});
    });
  },
  //TODO: This is dead code right now
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
  'change #urlChoice': function(e) {
    urlOption = $("#urlChoice").val();
    if(urlOption == "other") {
      Session.set("urlEntered",false);
    }
    Session.set("source", urlOption);
  },
  'change #customUrl': function(e) {
    Session.set("urlEntered", true);
  }
});
Template.setup.created = function (){
    //Session variable to control when more options appear when
    //using "other" option
    Session.set("urlEntered", true);
};

Template.setup.helpers({
  isNotDefault: function() {
    return Session.get("source") !== "--" && Session.get("urlEntered");
  },
  isOther: function() {
    return Session.get("source") === "other";
   }
});
