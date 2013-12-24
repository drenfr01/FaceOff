Router.configure({
  layoutTemplate: 'layout'
});

Router.map(function() {
  this.route('mainMenu', {path: '/'});
  this.route('setup', {path: '/setup' });
  this.route('gameList', {path: '/gameList'});
  this.route('inGame', {
    path: '/inGame/:number',
    data: function() { return Games.findOne(this.params.number); }
  });
});