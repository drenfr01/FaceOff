//Place data to load into server on start here
Cards.remove({});
Games.remove({});
Timer.remove({});
Players.remove({});
//TODO: Probably want to take another look at this 
Meteor.users.update({}, {$set: {gameNumber: -1, cards: []}}, {multi: true});


setupBasicGame = function() {
    attributes = {
      timer_value: 5
    };
    //Add Games 
    gameNumber1 = insertGame(attributes);
    gameNumber2 = insertGame(attributes);
    
    //Add Cards
    cardId1 = addCard('www.image1.com', gameNumber1);
    cardId2 = addCard('www.image2.com', gameNumber1);

    addCardToGame(cardId1, gameNumber1);
    addCardToGame(cardId2, gameNumber1);

    //Add Players
    playerId1 = addPlayer(gameNumber1, 'test1@gmail.com');
    playerId2 = addPlayer(gameNumber1, 'test2@gmail.com');
    playerId3 = addPlayer(gameNumber1, 'test3@gmail.com');
    addPlayerToGame(gameNumber1, playerId1);
    addPlayerToGame(gameNumber1, playerId2);
    addPlayerToGame(gameNumber1, playerId3);

    //Add Cards to Players
    addCardToPlayer(playerId1, cardId1);
    addCardToPlayer(playerId2, cardId2);
    
    //Get games after they're fully setup (game 2 is blank)
    game1 = Games.findOne({number: gameNumber1});
    game2 = Games.findOne({number: gameNumber2});
    //Return hash for values
    return {
      gameNumber1: gameNumber1,
      gameNumber2: gameNumber2,
      game1: game1,
      game2: game2,
      cardId1: cardId1,
      cardId2: cardId2,
      playerId1: playerId1,
      playerId2: playerId2,
      playerId3: playerId3
    };
  };
