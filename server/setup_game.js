Meteor.methods({
  setupGame: function(gameAttributes) {


    //Use database access function here
    gameNumber = insertGame(gameAttributes);
    playerId = addPlayer(gameNumber); //this sets player's game
    addPlayerToGame(gameNumber, playerId); //this sets game's players


    //This will be updated with the logic to decide which cards are in play
    //For now this will take all the cards available

    cardsToInsert = callExternalAPI(gameAttributes.cardsUrl);
    cardsToInsert.forEach(function (data) {
      //check to make sure we are given image link
      if(data.data.url.match(/\.(jpeg|jpg|gif|png)$/) !== null) {

        card = addCard(data.data.url, gameNumber);
        addCardToGame(card, gameNumber);
      }
    });

    //Initialize the timer
    initializeTimer(gameNumber, parseInt(gameAttributes.timer_value));

    setUserInGame(gameAttributes.user_id, gameNumber);

    return {
      gameNumber: gameNumber,
      playerId: playerId
    };
  },
  removeCard: function(cardId) {
    //TODO: sketchy, does not support multiple games
    gameNumber = Cards.findOne({_id: cardId}).active;
    Games.update({number: gameNumber}, {$pull: {cards: cardId}});
    Cards.update({_id: cardId}, {$set: {active: -1}});
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
