Router.configure({
  layoutTemplate: 'layout'
});

Router.map(function() {
  this.route('mainMenu', {path: '/'});
  this.route('setup', {path: '/setup' });
  this.route('gameList', {path: '/gameList'});
  this.route('inGame', {
    path: '/inGame/:gameNumber/:playerId',
    data: function() {
      return {
        game: Games.findOne({number: parseInt(this.params.gameNumber)}),
        player: Players.findOne({ _id: this.params.playerId } )
      }
    }
  });
  this.route('lobby', {
    path: '/lobby/:gameNumber/:playerId',
    data: function() {
      return {
        game: Games.findOne({number: parseInt(this.params.gameNumber)}),
        player: Players.findOne({ _id: this.params.playerId } )
      }
    }
  });
  this.route('card', {
    path: '/:path',
    data: function() {
      return Cards.findOne({path: this.params.path});
    }
  });
});
var requireLogin = function() {
  if (! Meteor.user()) {
    this.render('accessDenied');
    this.stop();
  }
};
Router.before(requireLogin, {only: ['setup', 'gameList']});
Router.before(function() { clearErrors(); });
