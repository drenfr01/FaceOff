Meteor.methods({
  setupGame: function(gameAttributes) {


    //Ensure timer is numeric value
    var timerValue = parseInt(gameAttributes.timer_value);
    if (! _.isNumber( timerValue ) || isNaN( timerValue ) ) {
      throw new Meteor.Error(302, "Must have numeric value for timer");
    }
    //Find largest game number and insert
    var maxGame = Games.findOne({active: 1}, {sort: {number: -1}});
    var maxGameNumber = 0;

    if(!maxGame)
      maxGameNumber = 0;
    else
      maxGameNumber = maxGame.number + 1;

    var newGameId = Games.insert({
      number: maxGameNumber,
      active: 1,
      votingTime: timerValue,
      isPaused: false
    });

    //This will be updated with the logic to decide which cards are in play
    //For now this will take all the cards available
    if(gameAttributes.cardsUrl === "default") {
      Cards.find().forEach(function (card) {
      Cards.update({_id: card._id}, {$push: {active: maxGameNumber} } );
      Games.update({number: maxGameNumber}, {$push: {cards: card._id} } );
      });
    } else {
      cardsToInsert = callExternalAPI(gameAttributes.cardsUrl);
      cardsToInsert.forEach(function (data) {
        //check to make sure we are given image link
        if(data.data.url.match(/\.(jpeg|jpg|gif|png)$/) !== null) {

          card = Cards.insert({path: data.data.url,in_play: [],
            usersVoting : [], active: maxGameNumber});
          
          Games.update({number: maxGameNumber}, 
            {$push: {cards: card._id_}});
        }
      });
    }

    setUserInGame(gameAttributes.user_id, maxGameNumber);

    return maxGameNumber;
  }
});

callExternalAPI = function(source) {
  try {
    var result = HTTP.call("GET", source); 
    return result.data.data.children;
  } catch (e) {
    //TODO: not throwing proper message
    throw new Meteor.Error(302, "Invalid Subreddit - Try again");
  }
};
