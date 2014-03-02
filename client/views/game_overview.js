Template.gameOverview.helpers({
  playersInGame: function() {
    playerNames = []; 
    combinedPlayerIds = this.game.players.concat(this.game.activePlayerIds);
    combinedPlayerIds.forEach( function(playerId) {
      player = Players.findOne(playerId);
      playerNames.push(
        {name: player.name, cardsLeft: player.cardIds.length}
      );
    });
    return playerNames;
  }
});

Template.gameOverview.events({
  'click #testButton': function(e) {
    console.log(this);
  } 
});
