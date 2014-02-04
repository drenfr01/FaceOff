// Option 1, create a new game
Template.mainMenu.events({
  'click #new_game' : function () {
    Session.set("source","--");
    
    Router.go('setup');
  },

  // Option 2, join a game
  'click #join_game' : function () {
    Router.go('gameList');
  }
});
