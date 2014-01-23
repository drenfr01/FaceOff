Meteor.methods({
  setupGame: function(gameAttributes) {
    console.log("Setting up the game");

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
    });

    //This will be updated with the logic to decide which cards are in play
    //For now this will take all the cards available
    var cardsToInsert = Cards.find();

    cardsToInsert.forEach(function (card) {
      //The card needs to know what games it is currently a part of
      Cards.update({_id: card._id}, {$push: {active: maxGameNumber} } );
      //The game needs to know what cards it has active
      Games.update({number: maxGameNumber}, {$push: {cards: card._id} } );
    });

    //Initialize the timer
    initializeTimer(maxGameNumber, parseInt(gameAttributes.timer_value));

    //Get the next images
    getNextImages(maxGameNumber);

    //set users game to the newly created game
    //refactor this to server side function
    //Meteor.users.update(gameAttributes.user_id, {$set: {gameNumber: maxGameNumber}});
    setUserInGame(gameAttributes.user_id, maxGameNumber);

    console.log("Completed game setup");
    return maxGameNumber;
  }
});
