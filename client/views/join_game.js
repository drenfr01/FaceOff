Template.joinGame.gameInPlay = function () {
  return Games.find( {active: 1} );
};


