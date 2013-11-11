To Do/ Features list:
 * Upload images/store images in DB
 * Implement Join a game functionality
 * Play more than one game
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
 * Configure game parameters at newgame
 * Unable to vote during vote showing screen

Work in progress below this line
===========================================================
### Session variables
state: Tracks the state of the application.  This drives what the main template displays.
 * "landing" First hit the application
 * "in_game" Currently playing a game
 * "setup" Setting up game variables
game_state: Tracks the state of the game.
 * "voting_phase" Vote for which picture is better.
 * "display_phase" Show the winner of the previous round, as well as other relevant statistics.
 * "paused" To be implemented
timer: How many seconds are left before the timer function is called.
timer_function: The function to call when the timer hits 0.

### Collections
Users: Representation of a player
 * To Be Implemented
Cards: Representation of a card
 * _id: Unique id for each card
 * path: Relative path to the card
 * active: Currently in game
 * in_play: Currently on the table
 * votes: Current votes for the card

