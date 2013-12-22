Template.gameList.activeGames = function () {
  return Games.find( {active: 1} );
};


