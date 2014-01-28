Meteor.methods({
  setupGame: function(gameAttributes) {

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
      votingTime: parseInt(gameAttributes.timer_value),
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


    //Initialize the timer
    initializeTimer(maxGameNumber, parseInt(gameAttributes.timer_value));

    //Get the next images
    getNextImages(maxGameNumber);

    setUserInGame(gameAttributes.user_id, maxGameNumber);

    return maxGameNumber;
  }
});

callExternalAPI = function(source) {
  try {
    var result = HTTP.call("GET", source); 
    return result.data.data.children;
  } catch (e) {
    //TODO: make this a proper meteor error
    console.log(e);
    return false;
  }
};
