# Project 1 - Solitaire (Klondike)
*Student:* Justin Clark
Build a browser-based Klondike Solitaire game.

## MVP Game Version Requirements
The following is an outline of the basic game play mechanics and the basic user interface. The MVP version of the game will fulfill these basics.

### Game Basics
#### Objective
The goal of Klondike is to move all the cards into four foundation piles creating one pile per suit in ascending order from Ace up to King.
#### Foundation Piles
To start a foundation pile, place an Ace in the foundation and then add cards of the same suit in ascending order: A, 2, 3, 4, 5, 6, 7, 8, 9, 10, J, Q, K.
#### Columns
Move cards to the foundation or another column to create stacks and uncover face-down cards.
Stacks must alternate between red and black suits and be in descending order: K, Q, J, 10, 9, 8, 7, 6, 5, 4, 3, 2.
#### Empty Columns
Empty columns are created when you move the last card from a column.
Only Kings may be moved to an empty column.
#### Stock Pile
Click the stock pile to draw more cards. You draw one card at a time.
#### Drawn Cards Pile
As cards are drawn from stock pile, they are placed face up in the drawn cards pile. Move cards one at a time from the drawn cards pile to an available space in a foundation pile, column, or empty column.

### Scoring
#### Scoring
In Standard Klondike, earn 10 points for moving cards to the foundation, and 5 points for uncovering face-down cards or moving cards from the stock pile.
#### Bonus Points
Complete the game quickly to earn bonus points! Bonus points are calculated by dividing 700,000 by the total game in seconds.

### Controls
#### Mouse Controls
Click and drag cards to a specific destination. To move a stack of cards, click and drag the top-most card.

### Interface
#### New Game Button
Start a new game of Klondike. 
#### End Game Button
Ends the current game of Klondike.
#### Score
Displays the score for the current game.
#### Time
Indicates how long you have been playing the current game for.
#### Game Rules
Displays the rules of the game.
#### Table
Consists of the Stock Pile, Drawn Cards Pile, Foundation Piles, and Columns.
#### Cards
Cards consist of a standard deck of 52 cards.

### Five DOM Interactions for MVP

#### 1. New Game Button Click
Starts a new game. Sets the table up for a new game. Clears the table if a current game is being played. All game data will be reset when clicked. Time Playing (stopwatch) will start counting from 0:00. Cards will be randomly shuffled and the game will initialize a new deal.
#### 2. Game Rules Button Click
Displays a hiddend div with game instructions.
#### 3. Stock Pile Click
Moves a face-down card from the stock pile to face-up on the drawn cards pile.
#### 4. Card Click
Moves a card to the appropriate pile (by suit) in the foundation piles if that card is next in rank for that pile, e.g. clicking an Ace will move the card to the pile for the suit in the foundation pile and then so on for cards of the same suit in ascending order: A, 2, 3, 4, 5, 6, 7, 8, 9, 10, J, Q, K.
#### 5. Card Drag (& Release)
Clicking and holding the click button will allow the card to be moved in position to an appropriate column or pile, the when the mouse button is released the card will be added to the hover target if allowed.  If released when not over an appropriate target, the card will move back to its place of origination.

## Level-Ups
### Level-Up 1
#### 1. Modal
Use a modal to display the game rules.
#### 2. Responsive Navigation
A navigation bar that on desktop runs across the top of the page, but in mobile appears on the side when the user clicks on an icon.
#### 3. Theme Toggle
A button that toggles a light/dark theme.
#### 4. Single Page Application
Instead of having multiple HTML files for each page of the website, load all the content for the website into one HTML file and hide/show different parts of the page using JS Events/DOM Manipulation.
#### 5. Animation
Animate moving cards from the stock pile to the drawn pile.

### Level-Up 2
#### Pexels API
Use Pexels API to get new images to put on the back of cards.
