Games = new Meteor.Collection("games");

Meteor.methods({
  setupGame: function(gameAttributes) {
    //grab all the cards
    //insert all the cards into

    //Find largest game number and insert
    var maxGame = Games.findOne({active: 1}, {sort: {number: -1}});
    var maxGameNumber = 0;

    if(!maxGame)
      maxGameNumber = 0;
    else
      maxGameNumber = maxGame.number + 1;

    var cardsToInsert = Cards.find().fetch();

    var newGameId = Games.insert({
      number: maxGameNumber,
      active: 1,
      voting_time: gameAttributes.timer_value,
      cards: cardsToInsert
    });

    return maxGameNumber;
  }
})
