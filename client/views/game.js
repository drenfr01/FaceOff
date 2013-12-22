Template.game.events({
  'click' : function () {
    // Join the game, set the session variable for game
    // Set the state to in play?
    Session.set("game", this.number);
    Session.set("state", "in_game");
    console.log(Session.get("game"));
  }
});
