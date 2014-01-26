note: http://www.reddit.com/r/science/top?sort=top&t=all&limit=10
To Do/ Features list:
 * Upload images/store images in DB
 * Implement Join a game functionality -- Should be able to set Session game to the correct number and be golden
 * ~~Play more than one game~~
 * ~~Model a game~~
 * Statistics
 * Metadata about images
 * ~~Implement visible timer~~
 * Indicate winner of voting
 * Hide voting tally as we go
 * Implement a "deck" concept
 * Implement dropping cards from the game without any votes
 * Improve Styling
 * Investigate Less for styling
 * Add unit-test coverage
 * Ability to add time to the timer and pause button
 * ~~Configure game parameters at newgame~~
 * Unable to vote during vote showing screen
 * Add player hands
 * Add card ordering
 * Refactor into seperate files
 * Have all images be same size (roughly the same now, could use some work)
 * Implement socket.io chat ability to allow player communication
 * Have enter button actually do something on "setup game" page
 * Use reddit API for images

Work in progress below this line
===========================================================
### Server variables
game_state: Tracks the state of the game.
 * "voting_phase" Vote for which picture is better.
 * "display_phase" Show the winner of the previous round, as well as other relevant statistics.
 * "paused" To be implemented

timer:
  * time: How many seconds are left before the timer function is called.
  * timer_function: The function to call when the timer hits 0.
  * timer_dep: Dependency object for Meteor


### Client Variables
state: Tracks the state of the application.  This drives what the main template displays.
 * "landing" First hit the application
 * "in_game" Currently playing a game
 * "setup" Setting up game variables

game: The number of the game for this session.

### Collections
Users: Keeps track of a player
 * To Be Implemented

Cards: Keeps track of a card
 * _id: Unique id for each card
 * path: Relative path to the card
 * active: Currently in game
 * in_play: Currently on the table
 * votes: Current votes for the card

Games: Keeps track of games
 * _id: Unique id for the game
 * number: Reference number to join a game
 * voting_time: How long the voting_phase lasts
 * cards(+): Tracks the cards still active
 * active: If the game is still active
