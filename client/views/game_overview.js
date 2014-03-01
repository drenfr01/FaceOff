Template.gameOverview.helpers({
  playersInGame: function() {
    playerNames = []; 
    combinedPlayerIds = this.game.players.concat(this.game.activePlayerIds);
    combinedPlayerIds.forEach( function(playerId) {
      playerNames.push(Players.findOne(playerId).name);
    });
    return playerNames;
  } 
});

Template.gameOverview.events({
  'click #testButton': function(e) {
    console.log(this);
  } 
});
