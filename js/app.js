// CONSTANTS ////////////////////////////////////////////////////////////////////////////////////////

// CANNOT CHANGE ORDER OF RANKS AND SUITS
const suits = ['s', 'h', 'd', 'c'];
const ranks = ['A', '02', '03', '04', '05', '06', '07', '08', '09', '10', 'J', 'Q', 'K'];

// VARIABLES ////////////////////////////////////////////////////////////////////////////////////////

// needed for scoring
let gameTimeStarted;
let gameTimeStopped;
let timeString;
let isGameRunning = false;
let gameScore = 0;
let grantFilpCardPoints = false;
// needed for moving cards
let draggedFromParentId = '';
let draggedItemId = '';
let isStack = false;

// CARD ARRAYS /=============

// starting deck array
let deck = [];

// stock pile arrays
let stockPile = [];
let drawnPile = [];

// foundation pile arrays
let clubsPile = [];
let heartsPile = [];
let diamondsPile = [];
let spadesPile = [];

// face-up column arrays
let col1Faceup = [];
let col2Faceup = [];
let col3Faceup = [];
let col4Faceup = [];
let col5Faceup = [];
let col6Faceup = [];
let col7Faceup = [];

// face-down column arrays
let col2Facedown = [];
let col3Facedown = [];
let col4Facedown = [];
let col5Facedown = [];
let col6Facedown = [];
let col7Facedown = [];

// temp move pile array (holds array of items being moved)
let movePile = [];

// CACHED ELEMENT REFERENCES ////////////////////////////////////////////////////////////////////////

// spash screen
const splashPage = document.getElementById('splash-page');
const enterSiteBtn = document.getElementById('enter-site');

// nav controls
const scoreContainer = document.getElementById('score-container');
const gameScoreDiv = document.getElementById('game-score');
const timePlaying = document.getElementById('time-playing');
const newGameBtn = document.getElementById('new-game');

// admin controls
const arrayStatuses = document.getElementById('array-statuses');
const signature = document.getElementById('signature');
const copyYear = document.getElementById('copy-year');
const copyRight = document.getElementById('copy-right');

// modals
const winOkBtn = document.getElementById('win-ok');
const gameWinModal = document.getElementById('game-win-modal');
const gameRulesModal = document.getElementById('game-rules-modal');
const gameRulesOpenBtn = document.getElementById('game-rules-open');
const gameRulesCloseBtn = document.getElementById('game-rules-close');

// stock pile container
const stockPileDiv = document.getElementById('stock-pile');
const drawnPileDiv = document.getElementById('drawn-pile');

// foundation piles
const clubsPileDiv = document.getElementById('clubs');
const heartsPileDiv = document.getElementById('hearts');
const diamondsPileDiv = document.getElementById('diamonds');
const spadesPileDiv = document.getElementById('spades');

// tableau section
const col1Div = document.getElementById('col-1');
const col2Div = document.getElementById('col-2');
const col3Div = document.getElementById('col-3');
const col4Div = document.getElementById('col-4');
const col5Div = document.getElementById('col-5');
const col6Div = document.getElementById('col-6');
const col7Div = document.getElementById('col-7');

// FUNCTIONS  ///////////////////////////////////////////////////////////////////////////////////////

// set copy right year
const setCopyYear = () => {
    let currentYear = new Date();
    currentYear = currentYear.getFullYear();
    copyYear.innerText = currentYear;
}
setCopyYear(); // <== set immediately!

// creates the initial deck of 52 cards
const createDeck = () => {
    deck = [];
    for (let suit of suits) {
        for (let rank of ranks) {
            const id = `${suit}${rank}`
            deck.push({ suit, rank, id });
        }
    }
}

// Uses Fisher-Yates Shuffle Algorithm with array destructuring.
// This function randomly reorders the deck array so that each
// possible ordering is equally likely — a uniform shuffle.
const shuffleDeck = () => {
    for (let index = deck.length - 1; index > 0; index--) {
        const index2 = Math.floor(Math.random() * (index + 1));
        [deck[index], deck[index2]] = [deck[index2], deck[index]];
    }
}

// deal cards to table
const dealCards = () => {
    for (let i = deck.length; i > 0; i--) {
        stockPile.push(deck.pop());
    }

    // containers for column piles
    const columnPileDivs = [col1Div, col2Div, col3Div, col4Div, col5Div, col6Div, col7Div];

    // deal face-down cards
    const facedownPiles = [col2Facedown, col3Facedown, col4Facedown, col5Facedown, col6Facedown, col7Facedown];
    for (let i = 0; i < facedownPiles.length; i++) {
        facedownPiles[i].push(stockPile.pop());
        facedownPiles[i].map(c => createCard(c, columnPileDivs[i + 1], 'back'));
    }
    for (let i = 1; i < facedownPiles.length; i++) {
        facedownPiles[i].push(stockPile.pop());
        createCard(facedownPiles[i][1], columnPileDivs[i + 1], 'back');
    }
    for (let i = 2; i < facedownPiles.length; i++) {
        facedownPiles[i].push(stockPile.pop());
        createCard(facedownPiles[i][2], columnPileDivs[i + 1], 'back');
    }
    for (let i = 3; i < facedownPiles.length; i++) {
        facedownPiles[i].push(stockPile.pop());
        createCard(facedownPiles[i][3], columnPileDivs[i + 1], 'back');
    }
    for (let i = 4; i < facedownPiles.length; i++) {
        facedownPiles[i].push(stockPile.pop());
        createCard(facedownPiles[i][4], columnPileDivs[i + 1], 'back');
    }
    for (let i = 5; i < facedownPiles.length; i++) {
        facedownPiles[i].push(stockPile.pop());
        createCard(facedownPiles[i][5], columnPileDivs[i + 1], 'back');
    }

    // deal face-up cards
    const faceupPiles = [col1Faceup, col2Faceup, col3Faceup, col4Faceup, col5Faceup, col6Faceup, col7Faceup];
    for (let i = 0; i < 7; i++) {
        faceupPiles[i].push(stockPile.pop());
        createCard(faceupPiles[i][0], columnPileDivs[i], 'front');
    }
}

// Gets card value
const getCardValue = (card) => {
    switch (card.rank) {
        case 'A': return 1;
        case 'J': return 11;
        case 'Q': return 12;
        case 'K': return 13;
    }
    return parseInt(card.rank);
}

// Gets the rank and suit of a card
const getRankSuit = (cardId) => {
    const charArr = [...cardId];
    const cardSuit = charArr[0];
    if (charArr.length === 2) {
        cardRank = charArr[1];
    } else {
        cardRank = `${charArr[1]}${charArr[2]}`;
    }
    const cardObj = { suit: cardSuit, rank: cardRank };
    return cardObj;
}

// Creates a card
const createCard = (c, cardDiv, frontBack) => {

    let cardClass = c.id;
    const id = cardClass;
    const div = document.createElement("div");

    if (frontBack === 'front') {
        // create face-up card
        div.setAttribute('id', id);
        div.setAttribute('draggable', true);
        div.classList.add('card');
        div.classList.add('xlarge');
        div.classList.add('front');
        div.classList.add(cardClass);
        // add face-up card to DOM
        cardDiv.appendChild(div);
        // assign drag and drop listeners to card
        div.addEventListener('dragstart', dragstartHandler);
        div.addEventListener('dragover', dragoverHandler);
        div.addEventListener('drop', dropHandler);
    } else if (frontBack === 'back') {
        // create face-down card
        div.setAttribute('id', `id-${id}`);
        div.classList.add('card');
        div.classList.add('xlarge');
        div.classList.add('back-blue');
        div.classList.add('shadow');
        div.classList.add('back');
        // add face-down card to DOM
        cardDiv.appendChild(div);
    }
}

// renders the stock pile
const renderStockPile = () => {
    stockPileDiv.innerHTML = '';
    if (stockPile.length > 0) {
        stockPile.map(c => createCard(c, stockPileDiv, 'back'));
    }
}

// renders the drawn cards pile
const renderDrawnPile = () => {
    drawnPileDiv.innerHTML = '';
    if (drawnPile.length > 0) {
        // drawnPile.map(c => createCard(c, drawnPileDiv, 'front'));
        drawnPile.map(c => {
            createCard(c, drawnPileDiv, 'front');
        });
    }
}

// render table
const renderCards = () => {
    renderStockPile();
    renderDrawnPile();
    renderArrayStatuses();
}

// renders a clock showing the elapsed time since a game was started
const renderTimePlaying = () => {
    /*  Math is my Kryptonite. I folded after spending a couple hours
        trying to figure out how the reset the hours, minutes, and 
        seconds to "00", and got some help from browser's Search 
        Assist.  There wasn't much I needed to change so this work 
        wasn't mine.
    
        Browser Search Assist:

        To show elapsed time in hours, minutes, and seconds in JavaScript, 
        you can calculate the difference between two Date objects and then 
        convert the result from milliseconds to the desired format. 
        
        For example:

            let startTime = new Date();
            // Perform some task
            let endTime = new Date();
            let elapsed = endTime - startTime; // time in milliseconds

            let seconds = Math.floor((elapsed / 1000) % 60);
            let minutes = Math.floor((elapsed / (1000 * 60)) % 60);
            let hours = Math.floor((elapsed / (1000 * 60 * 60)) % 24);

        console.log(`${hours} hours, ${minutes} minutes, ${seconds} seconds`);
        This will display the elapsed time in a readable format. */
    if (isGameRunning) {
        let endTime = new Date();
        let elapsed = endTime - gameTimeStarted; // time in milliseconds

        let seconds = Math.floor((elapsed / 1000) % 60);
        let minutes = Math.floor((elapsed / (1000 * 60)) % 60);
        let hours = Math.floor((elapsed / (1000 * 60 * 60)) % 24);

        if (seconds < 10) seconds = `0${seconds}`;
        if (minutes < 10) minutes = `0${minutes}`;
        if (hours < 10) hours = `0${hours}`;

        timeString = `${hours}:${minutes}:${seconds}`;
        timePlaying.innerHTML = timeString;
    }
}

// clears the game state
const clearGame = () => {

    // card element container piles
    stockPileDiv.innerHTML = '';
    drawnPileDiv.innerHTML = '';

    heartsPileDiv.innerHTML = '';
    clubsPileDiv.innerHTML = '';
    diamondsPileDiv.innerHTML = '';
    spadesPileDiv.innerHTML = '';

    col1Div.innerHTML = '';
    col2Div.innerHTML = '';
    col3Div.innerHTML = '';
    col4Div.innerHTML = '';
    col5Div.innerHTML = '';
    col6Div.innerHTML = '';
    col7Div.innerHTML = '';

    // pile arrays for card items
    deck = [];
    stockPile = [];
    drawnPile = [];

    clubsPile = [];
    heartsPile = [];
    diamondsPile = [];
    spadesPile = [];

    col1Faceup = [];
    col2Faceup = [];
    col3Faceup = [];
    col4Faceup = [];
    col5Faceup = [];
    col6Faceup = [];
    col7Faceup = [];

    col2Facedown = [];
    col3Facedown = [];
    col4Facedown = [];
    col5Facedown = [];
    col6Facedown = [];
    col7Facedown = [];
    movePile = [];

    // reset game variables
    draggedFromParentId = '';
    draggedItemId = '';
    isStack = false;

    gameTimeStarted = 0;
    gameTimeStopped = 0;
    isGameRunning = false;

    grantFilpCardPoints = false;
    gameScore = 0;
    gameScoreDiv.innerHTML = gameScore;
}

// Automatically flip face down-cards when the card on top of it is moved away.
// Awards points for fliping a face-down card.
const flipCard = (fromPile, toPile, colDiv) => {
    if (toPile.length === 0 && fromPile.length !== 0) {
        const arrItem = fromPile[fromPile.length - 1];
        const id = `id-${arrItem.suit}${arrItem.rank}`;
        const element = document.getElementById(id);
        element.remove();
        createCard(arrItem, colDiv, 'front');
        toPile.push(fromPile.pop());
        // if running code make it here a face-down card was flipped, user gets points
        grantFilpCardPoints = true;
    }
}

// Fill the move pile array so we know what cards to move
const fillMovePile = (fromPile) => {

    movePile = [];
    /*  ChatGPT Explanation:
        .findIndex() loops through each element in the array.
        For each element (obj), it checks whether obj.id === "001".
        It returns the index of the first matching object (or -1 if none match). */
    const index = fromPile.findIndex(obj => obj.id === draggedItemId);
    for (let i = fromPile.length - 1; i >= index; i--) {
        movePile.push(fromPile[i]);
    }

    if (movePile.length > 1) {
        isStack = true;
    } else {
        isStack = false;
    }
}

// Logic for moving cards and stacks of cards.
// Moves card elements on screen and pile array.
const moveCard = (draggedFrom, targetId, targetDiv) => {
    let fromPile = getOriginationArray(draggedFrom);
    let toPile = getDestinationArray(targetId);

    /*  ChatGPT Explanation:
        .findIndex() loops through each element in the array.
        For each element (obj), it checks whether obj.id === "001".
        It returns the index of the first matching object (or -1 if none match). */
    const index = fromPile.findIndex(obj => obj.id === draggedItemId);

    /*  For the 2 "fromPile.splice(i, 1)[0]", the "[0]" part is a little confusing... 
        need to review it again.

        ChatGPT Explanation:
        splice(1, 1): This removes one item at index 1 from sourceArray, 
        which is "banana". The removed item is returned as an array. 
        push(removedItem[0]): This adds the first element of the removedItem 
        array (which is "banana") to targetArray. This method effectively 
        moves an item from one array to another while modifying the original array. */
    // we are moving a stack of multiple cards
    if (isStack) {
        // moving html (card) elements
        for (let i = index; i < index + movePile.length; i++) {
            targetDiv.appendChild(document.getElementById(fromPile[i].id));
        }
        // removeing array items from "fromPile"
        for (let i = index + movePile.length - 1; i >= index; i--) {
            fromPile.splice(i, 1)[0]; // <== ChatGPT help*
        }
        // adding array items to "toPile"
        for (let i = movePile.length - 1; i >= 0; i--) {
            toPile.push(movePile[i]);
        }
        // reset these
        movePile = [];
        isStack = false;
    }
    // we are only moving a single card (not a stack)
    else {
        toPile.push(fromPile.splice(index, 1)[0]); // <== ChatGPT help*
        targetDiv.appendChild(document.getElementById(draggedItemId));
    }

    // when the last face-up card is gone from a pile we automatically filp the first face-down card
    switch (draggedFrom) {
        // we check for and award point for flipping card in the flipCard function
        // col-1 has no face-down cards
        case 'col-2': flipCard(col2Facedown, col2Faceup, col2Div); break;
        case 'col-3': flipCard(col3Facedown, col3Faceup, col3Div); break;
        case 'col-4': flipCard(col4Facedown, col4Faceup, col4Div); break;
        case 'col-5': flipCard(col5Facedown, col5Faceup, col5Div); break;
        case 'col-6': flipCard(col6Facedown, col6Faceup, col6Div); break;
        case 'col-7': flipCard(col7Facedown, col7Faceup, col7Div); break;
    }
}

// Coordinates moving cards and scoring points
const moveAndScore = (draggedFrom, targetId, targetDiv, grantFoundationPoints) => {

    // GET BEFORE MOVE ARRAY COUNTS
    // We need to get all the movable card pile array item counts 
    // to compare before and after dragging and dropping to ensure 
    // the move was made successfully.
    //
    // drawn pile
    const drawnPileLenBefore = drawnPile.length;
    // foundation piles
    const clubsPileLenBefore = clubsPile.length;
    const heartsPileLenBefore = heartsPile.length;
    const diamondsPileLenBefore = diamondsPile.length;
    const spadesPileLenBefore = spadesPile.length;
    // column piles
    const col2FacedownLenBefore = col2Facedown.length;
    const col3FacedownLenBefore = col3Facedown.length;
    const col4FacedownLenBefore = col4Facedown.length;
    const col5FacedownLenBefore = col5Facedown.length;
    const col6FacedownLenBefore = col6Facedown.length;
    const col7FacedownLenBefore = col7Facedown.length;

    // MOVE THE CARD
    moveCard(draggedFrom, targetId, targetDiv);

    // GET AFTER MOVE ARRAY COUNTS
    // drawn cards pile
    const drawnPileLenAfter = drawnPile.length;
    // foundation piles
    const clubsPileLenAfter = clubsPile.length;
    const heartsPileLenAfter = heartsPile.length;
    const diamondsPileLenAfter = diamondsPile.length;
    const spadesPileLenAfter = spadesPile.length;
    // column piles
    const col2FacedownLenAfter = col2Facedown.length;
    const col3FacedownLenAfter = col3Facedown.length;
    const col4FacedownLenAfter = col4Facedown.length;
    const col5FacedownLenAfter = col5Facedown.length;
    const col6FacedownLenAfter = col6Facedown.length;
    const col7FacedownLenAfter = col7Facedown.length;

    // AWARD POINTS

    // grant 5 points for moving cards from the stock pile
    if (drawnPileLenAfter < drawnPileLenBefore) {
        gameScore += 5;
    }

    // grant 10 points for moving cards to the foundation
    if (grantFoundationPoints === true) {
        if (clubsPileLenAfter > clubsPileLenBefore) gameScore += 10;
        if (heartsPileLenAfter > heartsPileLenBefore) gameScore += 10;
        if (diamondsPileLenAfter > diamondsPileLenBefore) gameScore += 10;
        if (spadesPileLenAfter > spadesPileLenBefore) gameScore += 10;
    }

    // grant 5 points for uncovering face-down cards
    if (grantFilpCardPoints === true) {
        // col-1 never has face-down cards
        if (col2FacedownLenAfter < col2FacedownLenBefore) gameScore += 5;
        if (col3FacedownLenAfter < col3FacedownLenBefore) gameScore += 5;
        if (col4FacedownLenAfter < col4FacedownLenBefore) gameScore += 5;
        if (col5FacedownLenAfter < col5FacedownLenBefore) gameScore += 5;
        if (col6FacedownLenAfter < col6FacedownLenBefore) gameScore += 5;
        if (col7FacedownLenAfter < col7FacedownLenBefore) gameScore += 5;
    }
}

// Logic to detect and handle a game win
const detectWin = () => {
        
    // each foundation pile should have all 13 cards
    const clubsFull = clubsPile.length === 13;
    const diamondsFull = diamondsPile.length === 13;
    const spadesFull = spadesPile.length === 13;
    const heartsFull = heartsPile.length === 13;

    // check that all foundation piles are full
    if (clubsFull && diamondsFull && spadesFull && heartsFull) {

        isGameRunning = false;

        // record the time it took to complete the game
        gameTimeStopped = new Date();
        let totalGameElapsed = gameTimeStopped - gameTimeStarted; // time in milliseconds
        let totalGameSeconds = Math.floor((totalGameElapsed / 1000));

        /*Bonus Points
        Complete the game quickly to earn bonus points! Bonus points are calculated by 
        dividing 700,000 by the total game in seconds.*/
        // 
        const pointsMultiplier = 700_000;
        const bonusPoints = Math.floor(pointsMultiplier / totalGameSeconds);
        gameScore += bonusPoints;

        // display the winning message modal to the user
        const winTime = document.getElementById('win-time');
        const winScore = document.getElementById('win-score');        
        winTime.innerText = timeString;
        winScore.innerText = gameScore;
        gameWinModal.style.display = 'grid';

        // celebrate the user's win with confetti animation
        throwConfetti();
    }
}

// BELLS AND WHISTLES ///////////////////////////////////////////////////////////////////////////////

// Function Source: https://github.com/catdad/canvas-confetti/
// I scoured the GA Canvas source code to see if I could find how 
// the confetti was configured to show after submitting an 
// assignment. I couldn't find it there, but I was able to find
// it by searching the web. I tweeked some of the examples given
// by the github repo. But mostly the code is NOT my work.
const throwConfetti = () => {
    // do this for less than a second
    const duration = 0.25 * 1000;
    const end = Date.now() + duration;

    (function frame() {
        // Launch a small poof of confetti from a random part of the page:
        confetti({
            particleCount: 100,
            startVelocity: 30,
            spread: 360,
            origin: {
                x: Math.random(),
                // since they fall down, start a bit higher than random
                y: Math.random() - 0.2
            }
        });

        // keep going until we are out of time
        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    }());
}

// ARRAY LOGGING ////////////////////////////////////////////////////////////////////////////////////

// Create a column to display on screen to show what an array pile currently conatins
const getArrayItems = (arr, arrName) => {
    let divText = `<div> ${arrName}`;
    for (const item of arr) {
        if (item.id !== undefined) {
            divText += `<div>${item.id}</div>`;
        } else {
            divText += `<div>${item[0]}</div>`;
        }
    }
    divText += ` </div>`;
    return divText;
}

// Render all the columns of arrays showing the current cards they contain
const renderArrayStatuses = () => {
    // reset any existing data displayed
    arrayStatuses.innerHTML = '';
    // stock pile arrays
    arrayStatuses.innerHTML += getArrayItems(stockPile, 'stockPile');
    arrayStatuses.innerHTML += getArrayItems(drawnPile, 'drawnPile');
    // foundation arrays
    arrayStatuses.innerHTML += getArrayItems(clubsPile, 'clubsPile');
    arrayStatuses.innerHTML += getArrayItems(heartsPile, 'heartsPile');
    arrayStatuses.innerHTML += getArrayItems(diamondsPile, 'diamondsPile');
    arrayStatuses.innerHTML += getArrayItems(spadesPile, 'spadesPile');
    // face-up column arrays
    arrayStatuses.innerHTML += getArrayItems(col1Faceup, 'col1Faceup');
    arrayStatuses.innerHTML += getArrayItems(col2Faceup, 'col2Faceup');
    arrayStatuses.innerHTML += getArrayItems(col3Faceup, 'col3Faceup');
    arrayStatuses.innerHTML += getArrayItems(col4Faceup, 'col4Faceup');
    arrayStatuses.innerHTML += getArrayItems(col5Faceup, 'col5Faceup');
    arrayStatuses.innerHTML += getArrayItems(col6Faceup, 'col6Faceup');
    arrayStatuses.innerHTML += getArrayItems(col7Faceup, 'col7Faceup');
    // face-down column arrays
    arrayStatuses.innerHTML += getArrayItems(col2Facedown, 'col2Facedown');
    arrayStatuses.innerHTML += getArrayItems(col3Facedown, 'col3Facedown');
    arrayStatuses.innerHTML += getArrayItems(col4Facedown, 'col4Facedown');
    arrayStatuses.innerHTML += getArrayItems(col5Facedown, 'col5Facedown');
    arrayStatuses.innerHTML += getArrayItems(col6Facedown, 'col6Facedown');
    arrayStatuses.innerHTML += getArrayItems(col7Facedown, 'col7Facedown');
    // move pile array
    arrayStatuses.innerHTML += getArrayItems(movePile, 'movePile');
}

// ARRAY HELPERS ////////////////////////////////////////////////////////////////////////////////////

// gets the origination array for a pile by being passed the parent element for the pile
const getOriginationArray = (element) => {
    switch (element) {
        case 'drawn-pile': return drawnPile;
        case 'clubs': return clubsPile;
        case 'hearts': return heartsPile;
        case 'diamonds': return diamondsPile;
        case 'spades': return spadesPile;
        case 'col-1': return col1Faceup;
        case 'col-2': return col2Faceup;
        case 'col-3': return col3Faceup;
        case 'col-4': return col4Faceup;
        case 'col-5': return col5Faceup;
        case 'col-6': return col6Faceup;
        case 'col-7': return col7Faceup;
    }
}

// gets the destination array for a pile by being passed the parent element for the pile
const getDestinationArray = (element) => {
    switch (element) {
        case 'clubs': return clubsPile;
        case 'hearts': return heartsPile;
        case 'diamonds': return diamondsPile;
        case 'spades': return spadesPile;
        case 'col-1': return col1Faceup;
        case 'col-2': return col2Faceup;
        case 'col-3': return col3Faceup;
        case 'col-4': return col4Faceup;
        case 'col-5': return col5Faceup;
        case 'col-6': return col6Faceup;
        case 'col-7': return col7Faceup;
    }
}

// EVENT HANDLERS ///////////////////////////////////////////////////////////////////////////////////

// Starts a new game
const newGame = (event) => {
    clearGame();
    createDeck();
    shuffleDeck();
    dealCards();
    renderCards();

    isGameRunning = true;
    gameTimeStarted = new Date();
    setInterval(renderTimePlaying, 1000);

    gameScoreDiv.innerHTML = '0';
    scoreContainer.style.display = 'flex';
}

// Iterates through each card in the stock pile and moves it 
// to the drawn cards pile, when all cards have been moved 
// to the drawn cards pile the next click moves them all back.
const stockPileClick = (event) => {
    if (stockPile.length > 1) {
        /*  flip top card
            move card to drawn pile
            animate flip and move (optional) */
        drawnPile.push(stockPile.pop());
        renderDrawnPile();
    } else if (stockPile.length === 1) {
        /*  flip drawn cards pile
            move pile to stock pile */
        drawnPile.push(stockPile.pop());
        renderDrawnPile();
        renderStockPile();
    } else {
        for (let i = drawnPile.length; i > 0; i--) {
            stockPile.push(drawnPile.pop());
        }
        renderDrawnPile();
        renderStockPile();
    }
    renderArrayStatuses()
}

// hide the win message modal
const closeWinModal = (event) => {
    gameWinModal.style.display = 'none';
}

// hide the rules modal
const closeRulesModal = (event) => {
    gameRulesModal.style.display = 'none';
}

// show the rules modal
const openRulesModal = (event) => {
    gameRulesModal.style.display = 'grid';
}

// hides the splash page container simulating entering a site
const closeSplashPage = (event) => {
    splashPage.style.display = 'none';
}

// demonstrate the confetti effect
const demoConfetti = (event) => {
    throwConfetti();
}

// Allows toggling the array status on and off the the 
// screen to show where all the cards are in each array
const toggleArrayStatuses = (event) => {
    // 
    if (arrayStatuses.style.display === 'none' || !arrayStatuses.style.display) {
        arrayStatuses.style.display = 'flex';
        col1Div.classList.add('grow');
        col2Div.classList.add('grow');
        col3Div.classList.add('grow');
        col4Div.classList.add('grow');
        col5Div.classList.add('grow');
        col6Div.classList.add('grow');
        col7Div.classList.add('grow');
    } else {
        arrayStatuses.style.display = 'none';
        col1Div.classList.remove('grow');
        col2Div.classList.remove('grow');
        col3Div.classList.remove('grow');
        col4Div.classList.remove('grow');
        col5Div.classList.remove('grow');
        col6Div.classList.remove('grow');
        col7Div.classList.remove('grow');
    }
}

// Set up a game to demo a win by filling the foundation 
// piles with all card except for the kings.
const setEasyWin = (event) => {
    
    clearGame();
    createDeck();
    
    isGameRunning = true;
    gameTimeStarted = new Date();
    setInterval(renderTimePlaying, 1000);

    gameScoreDiv.innerHTML = '0';
    scoreContainer.style.display = 'flex';

    // CANNOT CHANGE ORDER BELOW =======================
    // spades
    for (let i = 0; i < 12; i++) {
        spadesPile.push(deck.shift());
    }
    col7Faceup.push(deck.shift());
    createCard(spadesPile[11], spadesPileDiv, 'front');
    createCard(col7Faceup[0], col7Div, 'front');
    // hearts
    for (let i = 0; i < 12; i++) {
        heartsPile.push(deck.shift());
    }
    col4Faceup.push(deck.shift());
    createCard(heartsPile[11], heartsPileDiv, 'front');
    createCard(col4Faceup[0], col4Div, 'front');
    // diamonds
    for (let i = 0; i < 12; i++) {
        diamondsPile.push(deck.shift());
    }
    col6Faceup.push(deck.shift());
    createCard(diamondsPile[11], diamondsPileDiv, 'front');
    createCard(col6Faceup[0], col6Div, 'front');
    // clubs
    for (let i = 0; i < 12; i++) {
        clubsPile.push(deck.shift());
    }
    col5Faceup.push(deck.shift());
    createCard(clubsPile[11], clubsPileDiv, 'front');
    createCard(col5Faceup[0], col5Div, 'front');
    // CANNOT CHANGE ORDER ABOVE =======================
 
    renderArrayStatuses();
}

// DRAG AND DROP CARD HANDLING ////////////////////////////////////////////////////////
// Drag and Drop Original Source:
// https://www.w3schools.com/HTML/html5_draganddrop.asp
// The link above was my starting point for setting up 
// the 3 event handlers I needed for enabling dragging 
// and dropping cards: dragstartHandler(),
// dragoverHandler(), and dropHandler().

// This event fires when a draggable enabled element starts to get dragged.
// Coordinates card moves with helper function to handle cards and stacks of cards.
// Enforces "only last drawn card can move" rule.
const dragstartHandler = (event) => {

    draggedFromParentId = event.target.parentElement.id;
    draggedItemId = event.target.id;

    // let fromPile;
    switch (draggedFromParentId) {
        case 'col-1': fillMovePile(col1Faceup); break;
        case 'col-2': fillMovePile(col2Faceup); break;
        case 'col-3': fillMovePile(col3Faceup); break;
        case 'col-4': fillMovePile(col4Faceup); break;
        case 'col-5': fillMovePile(col5Faceup); break;
        case 'col-6': fillMovePile(col6Faceup); break;
        case 'col-7': fillMovePile(col7Faceup); break;
        case 'drawn-pile':       
            // only allow picking up the last card of the drawn cards pile
            const lastDrawnCard = drawnPile[drawnPile.length-1];
            if (draggedItemId !== lastDrawnCard.id) {
                return;
            }
            break
    }
    renderArrayStatuses();
}

// The browser will only fire the drop event if the element’s dragover event calls
const dragoverHandler = (event) => {
    /*  GPT Explanation:
        event.preventDefault() inside dragover means:
        “Yes, I’ll accept a drop here — keep the drag operation active.”
        Without it, the drag operation ends immediately when the pointer enters that element.*/
    event.preventDefault();
}

// DROP CARD RULES ================================================================
// This function is the main game play logic as this game is 
// played by moving cards around on the screen.
// This function creates the rules to prevent dropping cards 
// in the wrong piles and in the wrong locations within the piles.
// It also sets the "grantFoundationPoints" flag to true if 
// All return statements here provide a way to silently disallow the illegal moves.
const dropHandler = (event) => {

    // prevents the browser’s default data handling
    event.preventDefault();

    // this flag is set to true if foundation points criteria are met
    let grantFoundationPoints = false;

    // target is what we are dropping onto 
    const targetParent = event.target.parentElement;
    const targetChild = event.target;

    // changes depending on parent or child
    let targetId;
    let targetDiv;

    const draggedCardObj = getRankSuit(draggedItemId);
    const draggedCardValue = getCardValue(draggedCardObj);

    // RULES FOR DROPPING ON OTHER CARDS
    if (targetChild.classList.contains('card')) {
        
        // The original target of the drop was a card, 
        // but cards can't contain other cards so use
        // parent element.
        targetId = targetParent.id;
        targetDiv = targetParent;

        const topCardId = event.target.id;
        const topCardObj = getRankSuit(topCardId);
        const topCardValue = getCardValue(topCardObj);

        // check the destination pile
        const charArr = [...targetId];
        switch (targetId) {
            case 'drawn-pile':
                // don't allow dropping cards back to drawn-pile
                return
            // foundation piles
            case 'hearts':
            case 'clubs':
            case 'diamonds':
            case 'spades':
                // ENFORCE RANK ASCENDING ORDER
                // dragged and dropped card cannot be lower 
                // in rank than the card it goes on
                if (draggedCardValue <= topCardValue) {
                    return; }
                // must be next up in chronological order
                else if ((draggedCardValue - topCardValue) !== 1) {
                    // e.g. 2-1=1, 5-4=1 (subracting the next lower number 
                    // from any number will always equal 1) in this instance 
                    // we are checking that the dropped card is one rank 
                    // higher than the top card
                    return;
                }
                // enforce suit of card matches suit of pile
                if (charArr[0] !== draggedCardObj.suit) {
                    return;
                }
                // if running code made it here that means the user 
                // successfully moved a card to the foundation pile
                // so we set the flag to grant points.
                grantFoundationPoints = true;
                break;
            // tableau column piles
            case 'col-1':
            case 'col-2':
            case 'col-3':
            case 'col-4':
            case 'col-5':
            case 'col-6':
            case 'col-7':
                // only allow dropping on the last card of the stack
                const toPileDestination = getDestinationArray(targetId);
                const bottomCard = toPileDestination[toPileDestination.length-1];
                if (targetChild.id !== bottomCard.id) {
                    return; 
                }
                // ENFORCE RANK DESCENDING ORDER
                // dragged and dropped card cannot be higher 
                // in rank than the card it goes on
                if (draggedCardValue >= topCardValue) {
                    return; }
                // must be next down in chronological order
                else if ((topCardValue - draggedCardValue) !== 1) {
                    // e.g. 2-1=1, 5-4=1 (subracting the next lower number 
                    // from any number will always equal 1) in this instance 
                    // we are checking that the top card is one rank higher 
                    // than the dropped card
                    return;
                }
                // enforce alternating suit colors
                if (draggedCardObj.suit === 'h' && (topCardObj.suit === 'h' || topCardObj.suit === 'd')) {
                    return;
                }
                if (draggedCardObj.suit === 'd' && (topCardObj.suit === 'h' || topCardObj.suit === 'd')) {
                    return;
                }
                if (draggedCardObj.suit === 'c' && (topCardObj.suit === 'c' || topCardObj.suit === 's')) {
                    return;
                }
                if (draggedCardObj.suit === 's' && (topCardObj.suit === 'c' || topCardObj.suit === 's')) {
                    return;
                }
                break;
        } // <== end switch()
    }
    // else: RULES FOR DROPPING ON EMPTY PILES
    else {
        // The original target of the drop was an, 
        // empty pile so we use targetChild 
        // the original (event.target) of the drop.
        targetId = targetChild.id;
        targetDiv = targetChild;

        // check the destination pile
        switch (targetId) {
            // foundation piles
            // only Aces are allowed in empty foundation piles
            case 'hearts':
            case 'clubs':
            case 'diamonds':
            case 'spades':
                const charArr = [...targetId];
                // enforce suit of card must match suit of pile
                if (charArr[0] !== draggedCardObj.suit) {
                    return;
                }
                // enforce only Aces are allowed
                if (draggedCardValue !== 1) {
                    return;
                }
                // if running code make it here, then the user has
                // successfully moved an Ace to the foundation pile
                grantFoundationPoints = true;
                break;
            // tableau column piles
            case 'col-1':
            case 'col-2':
            case 'col-3':
            case 'col-4':
            case 'col-5':
            case 'col-6':
            case 'col-7':
                // enforce only kings allowed in empty tableau columns
                if (draggedCardValue !== 13) {
                    return;
                }
                break;
        } // <== end switch()
    } // <== end if(card)

    moveAndScore(draggedFromParentId, targetId, targetDiv, grantFoundationPoints);

    detectWin();

    gameScoreDiv.innerText = gameScore;

    renderArrayStatuses();

    // TODO: this doesn't work as expected, need to look into deeper:
    event.stopPropagation();
}

// EVENT LISTENERS //////////////////////////////////////////////////////////////////////////////////

// CLICK LISTENERS
newGameBtn.addEventListener('click', newGame);

// splash page enter site listener
enterSiteBtn.addEventListener('click', closeSplashPage);

// hidden admin controls
copyRight.addEventListener('click', demoConfetti);
copyYear.addEventListener('click', toggleArrayStatuses);
signature.addEventListener('click', setEasyWin);

// modal button listeners
winOkBtn.addEventListener('click', closeWinModal);
gameRulesCloseBtn.addEventListener('click', closeRulesModal);
gameRulesOpenBtn.addEventListener('click', openRulesModal);

// Card Event Listeners
stockPileDiv.addEventListener('click', stockPileClick);

// DRAGOVER LISTENERS
// foundation pile dragover's
heartsPileDiv.addEventListener('dragover', dragoverHandler);
clubsPileDiv.addEventListener('dragover', dragoverHandler);
diamondsPileDiv.addEventListener('dragover', dragoverHandler);
spadesPileDiv.addEventListener('dragover', dragoverHandler);

// column pile dragover's
col1Div.addEventListener('dragover', dragoverHandler);
col2Div.addEventListener('dragover', dragoverHandler);
col3Div.addEventListener('dragover', dragoverHandler);
col4Div.addEventListener('dragover', dragoverHandler);
col5Div.addEventListener('dragover', dragoverHandler);
col6Div.addEventListener('dragover', dragoverHandler);
col7Div.addEventListener('dragover', dragoverHandler);

// DROP LISTENERS
// foundation pile drop's
heartsPileDiv.addEventListener('drop', dropHandler);
clubsPileDiv.addEventListener('drop', dropHandler);
diamondsPileDiv.addEventListener('drop', dropHandler);
spadesPileDiv.addEventListener('drop', dropHandler);

// column pile drop's
col1Div.addEventListener('drop', dropHandler);
col2Div.addEventListener('drop', dropHandler);
col3Div.addEventListener('drop', dropHandler);
col4Div.addEventListener('drop', dropHandler);
col5Div.addEventListener('drop', dropHandler);
col6Div.addEventListener('drop', dropHandler);
col7Div.addEventListener('drop', dropHandler);
