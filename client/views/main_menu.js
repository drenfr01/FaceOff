// Option 1, create a new game
Template.mainMenu.events({
  'click #new_game' : function () {
    
    Router.go('setup');
  },

  // Option 2, join a game
  'click #join_game' : function () {
    Router.go('gameList');
  }
});
