Router.configure({
  layoutTemplate: 'layout'
});

Router.map(function() {
  this.route('mainMenu', {path: '/'});
  this.route('setup', {path: '/setup' });
  this.route('gameList', {path: '/gameList'});
  this.route('inGame', {
    path: '/inGame/:number',
    data: function() {
      return Games.findOne({number: parseInt(this.params.number)});
    }
  });
  this.route('card', {
    path: '/:path',
    data: function() {
      return Cards.findOne({path: this.params.path})
    }
  });
});
