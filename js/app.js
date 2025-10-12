///////////////////////////////////////////////////////////////
// modals
const main = document.querySelector('main');
const gameWinModal = document.getElementById('game-win-modal');
const gameRulesModal = document.getElementById('game-rules-modal');
const gameRulesOpenBtn = document.getElementById('game-rules-open');
const gameRulesCloseBtn = document.getElementById('game-rules-close');


const splashPage = document.getElementById('splash-page');
const enterSiteBtn = document.getElementById('enter-site');

const scoreContainer = document.getElementById('score-container');


///////////////////////////////////////////////////////////////

/*-------------------------------- Constants --------------------------------*/

// const suits = ['♠', '♥', '♦', '♣'];

const suits = ['s', 'h', 'd', 'c'];
const ranks = ['02', '03', '04', '05', '06', '07', '08', '09', '10', 'J', 'Q', 'K', 'A'];

// const suits = ['s'];
// const ranks = ['A','K','J'];



/*-------------------------------- Variables --------------------------------*/

let deck = [];
let stockPile = [];
let drawnPile = [];

let clubsPile = [];
let heartsPile = [];
let diamondsPile = [];
let spadesPile = [];


let col1Faceup = [];
let col2Faceup = [];
let col3Faceup = [];
let col4Faceup = [];
let col5Faceup = [];
let col6Faceup = [];
let col7Faceup = [];

let col2Facedown = [];
let col3Facedown = [];
let col4Facedown = [];
let col5Facedown = [];
let col6Facedown = [];
let col7Facedown = [];

let movePile = [];

let gameTimeStarted;
let gameTimeStopped;
let timeString;
let isGameRunning = false;

let gameScore = 0;

let draggedFromParentId = '';
let draggedItemId = '';
let isStack = false;

let grantFilpCardPoints = false;


/*------------------------ Cached Element References ------------------------*/


const gameScoreDiv = document.getElementById('game-score');
const timePlaying = document.getElementById('time-playing');
const newGameBtn = document.querySelector('#new-game');
// stock pile container
const stockPileDiv = document.querySelector('#stock-pile');
const drawnPileDiv = document.querySelector('#drawn-pile');
// foundation piles
const clubsPileDiv = document.querySelector('#clubs');
const heartsPileDiv = document.querySelector('#hearts');
const diamondsPileDiv = document.querySelector('#diamonds');
const spadesPileDiv = document.querySelector('#spades');
// tableau section
const col1Div = document.querySelector('#col-1');
const col2Div = document.querySelector('#col-2');
const col3Div = document.querySelector('#col-3');
const col4Div = document.querySelector('#col-4');
const col5Div = document.querySelector('#col-5');
const col6Div = document.querySelector('#col-6');
const col7Div = document.querySelector('#col-7');

const winOkBtn = document.getElementById('win-ok');

const varStatuses = document.querySelector('#var-statuses');
const copyYear = document.querySelector('#year');

/*-------------------------------- Functions --------------------------------*/

// set copy right year
const setCopyYear = () => {
    let currentYear = new Date();
    currentYear = currentYear.getFullYear();
    copyYear.innerText = currentYear;
}
setCopyYear();

// Creates deck
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

// Deal cards to player and dealer
const dealCards = () => {
    for (let i = deck.length; i > 0; i--) {
        stockPile.push(deck.pop());
    }

    const columnPileDivs = [col1Div, col2Div, col3Div, col4Div, col5Div, col6Div, col7Div];

    // deal facedown cards
    const facedownPiles = [col2Facedown, col3Facedown, col4Facedown, col5Facedown, col6Facedown, col7Facedown];
    for (let i = 0; i < facedownPiles.length; i++) {
        facedownPiles[i].push(stockPile.pop());
        facedownPiles[i].map(c => createCard(c, columnPileDivs[i + 1], 'back'));
    }
    for (let i = 1; i < facedownPiles.length; i++) {
        facedownPiles[i].push(stockPile.pop());
        createCard(facedownPiles[i][1], columnPileDivs[i + 1], 'back')
    }
    for (let i = 2; i < facedownPiles.length; i++) {
        facedownPiles[i].push(stockPile.pop());
        createCard(facedownPiles[i][2], columnPileDivs[i + 1], 'back')
    }
    for (let i = 3; i < facedownPiles.length; i++) {
        facedownPiles[i].push(stockPile.pop());
        createCard(facedownPiles[i][3], columnPileDivs[i + 1], 'back')
    }
    for (let i = 4; i < facedownPiles.length; i++) {
        facedownPiles[i].push(stockPile.pop());
        createCard(facedownPiles[i][4], columnPileDivs[i + 1], 'back')
    }
    for (let i = 5; i < facedownPiles.length; i++) {
        facedownPiles[i].push(stockPile.pop());
        createCard(facedownPiles[i][5], columnPileDivs[i + 1], 'back')
    }

    // deal faceup cards
    const faceupPiles = [col1Faceup, col2Faceup, col3Faceup, col4Faceup, col5Faceup, col6Faceup, col7Faceup]
    for (let i = 0; i < 7; i++) {
        faceupPiles[i].push(stockPile.pop());
        createCard(faceupPiles[i][0], columnPileDivs[i], 'front')
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

const getRankSuit = (cardId) => {


    const charArr = [...cardId]
    const cardSuit = charArr[0]

    if (charArr.length === 2) {
        cardRank = charArr[1];
    } else {
        cardRank = `${charArr[1]}${charArr[2]}`;
    }

    const cardObj = { suit: cardSuit, rank: cardRank };
    return cardObj;
    // return { suit: "s", rank: "05" };
    // for (let i = 1; i < charArr.length; i++) {
    //     const checkLetter = char.toLowerCase().match(/[a-z]/)
    // }
}

// handle card clicked
const handleCardClick = (event) => {
    // console.log('Button clicked!')
    // alert('Button Clicked!')
};

const stockPileClick = (event) => {

    if (stockPile.length > 1) {
        /*
            flip top card
            move card to drawn pile
            animate flip and move (optional)
        */
        drawnPile.push(stockPile.pop());

        renderDrawnPile();
    } else if (stockPile.length === 1) {
        /*
            flip drawn cards pile
            move pile to stock pile
        */

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
    // for testing
    renderVarStatuses()
}


// Creates a card
const createCard = (c, cardDiv, frontBack) => {

    let cardClass = c.id;
    const id = cardClass;


    const div = document.createElement("div");

    // TODO: create helper function so we can toggle the front/back
    if (frontBack === 'front') {

        div.setAttribute('id', id);
        div.setAttribute('draggable', true);
        div.classList.add('card');
        div.classList.add('xlarge');
        div.classList.add('front');
        div.classList.add(cardClass);

        cardDiv.appendChild(div);

        div.addEventListener('dragstart', dragstartHandler);
        div.addEventListener('dragover', dragoverHandler);
        div.addEventListener('drop', dropHandler);
    } else if (frontBack === 'back') {

        div.setAttribute('id', 'id-' + id);
        // div.setAttribute('id', id);
        div.classList.add('card');
        div.classList.add('xlarge');
        div.classList.add('back-blue');
        div.classList.add('shadow');
        div.classList.add('back');

        cardDiv.appendChild(div);
    }

    // dynamically create event listener after div is created
    div.addEventListener('click', handleCardClick);
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
            createCard(c, drawnPileDiv, 'front')
        });
    }
}

// render table
const renderCards = () => {
    renderStockPile();
    renderDrawnPile();

    // for testing
    renderVarStatuses();
}







const renderTimePlaying = () => {
    /*
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
        This will display the elapsed time in a readable format.
    */
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








// starts a new game
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

const clearGame = () => {

    stockPileDiv.innerHTML = '';
    drawnPileDiv.innerHTML = '';
    clubsPileDiv.innerHTML = '';
    heartsPileDiv.innerHTML = '';
    diamondsPileDiv.innerHTML = '';
    spadesPileDiv.innerHTML = '';

    col1Div.innerHTML = '';
    col2Div.innerHTML = '';
    col3Div.innerHTML = '';
    col4Div.innerHTML = '';
    col5Div.innerHTML = '';
    col6Div.innerHTML = '';
    col7Div.innerHTML = '';

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

const closeWinModal = (event) => {
    gameWinModal.style.display = 'none'
}
winOkBtn.addEventListener('click', closeWinModal);

const closeRulesModal = (event) => {
    gameRulesModal.style.display = 'none'
}

gameRulesCloseBtn.addEventListener('click', closeRulesModal);

const openRulesModal = (event) => {
    
    gameRulesModal.style.display = 'grid';
}
gameRulesOpenBtn.addEventListener('click', openRulesModal);

const closeSplashPage = (event) => {
    
    splashPage.style.display = 'none';
}
enterSiteBtn.addEventListener('click', closeSplashPage);


/************************************************************************* */
// TODO: look into hiding dragged element's original location until dropped in new location.
// This is a start: https://stackoverflow.com/questions/36379184/html5-draggable-hide-original-element

// Drag and Drop source:
// https://www.w3schools.com/HTML/html5_draganddrop.asp


const fillMovePile = (fromPile) => {

    movePile = []
    /* 
    ChatGPT Explanation:
        .findIndex() loops through each element in the array.
        For each element (obj), it checks whether obj.id === "001".
        It returns the index of the first matching object (or -1 if none match).
    */
    const index = fromPile.findIndex(obj => obj.id === draggedItemId);
    console.log(`\nGetting stack cards list...`);
    console.log(`Dragged card id: ${index}`);
    console.log(`Last index of stack: ${fromPile.length - 1}`);
    for (let i = fromPile.length - 1; i >= index; i--) {
        console.log(`This card id: ${draggedItemId} is at index: ${i}.`);
        console.log(fromPile[i])
        movePile.push(fromPile[i]);
    }

    if (movePile.length > 1) {
        isStack = true;
    } else {
        isStack = false
    }

}

function dragstartHandler(event) {

    

    draggedFromParentId = event.target.parentElement.id;
    draggedItemId = event.target.id;

    let fromPile;
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
                alert('You can only move the last drawn card!')
                return;
            }
            break
    }

    renderVarStatuses();
}

function dragoverHandler(event) {
    event.preventDefault();
    console.log('hovering...');
}

const getOriginationArray = (arr) => {
    switch (arr) {
        case 'drawn-pile': console.log('getOriginationArray(drawn-pile '); return drawnPile;
        case 'clubs': console.log('getOriginationArray(clubs '); return clubsPile;
        case 'hearts': console.log('getOriginationArray(hearts'); return heartsPile;
        case 'diamonds': console.log('getOriginationArray(diamonds'); return diamondsPile;
        case 'spades': console.log('getOriginationArray(spades '); return spadesPile;
        case 'col-1': console.log('getOriginationArray(col1Faceup '); return col1Faceup;
        case 'col-2': console.log('getOriginationArray(col2Faceup '); return col2Faceup;
        case 'col-3': console.log('getOriginationArray(col3Faceup '); return col3Faceup;
        case 'col-4': console.log('getOriginationArray(col4Faceup '); return col4Faceup;
        case 'col-5': console.log('getOriginationArray(col5Faceup '); return col5Faceup;
        case 'col-6': console.log('getOriginationArray(col6Faceup '); return col6Faceup;
        case 'col-7': console.log('getOriginationArray(col7Faceup '); return col7Faceup;
    }
}

const getDestinationArray = (arr) => {
    switch (arr) {
        case 'clubs': console.log('getDestinationArray(clubs '); return clubsPile;
        case 'hearts': console.log('getDestinationArray(hearts '); return heartsPile;
        case 'diamonds': console.log('getDestinationArray(diamonds '); return diamondsPile;
        case 'spades': console.log('getDestinationArray(spades '); return spadesPile;
        case 'col-1': console.log('getDestinationArray(col1Faceup '); return col1Faceup;
        case 'col-2': console.log('getDestinationArray(col2Faceup '); return col2Faceup;
        case 'col-3': console.log('getDestinationArray(col3Faceup '); return col3Faceup;
        case 'col-4': console.log('getDestinationArray(col4Faceup '); return col4Faceup;
        case 'col-5': console.log('getDestinationArray(col5Faceup '); return col5Faceup;
        case 'col-6': console.log('getDestinationArray(col6Faceup '); return col6Faceup;
        case 'col-7': console.log('getDestinationArray(col7Faceup '); return col7Faceup;
    }
}



const dropHandler = (event) => {
    event.preventDefault();

    // alert('event.stopPropagation()... not stopping!')

    const drawnPileLenBefore = drawnPile.length;

    const clubsPileLenBefore = clubsPile.length;
    const heartsPileLenBefore = heartsPile.length;
    const diamondsPileLenBefore = diamondsPile.length;
    const spadesPileLenBefore = spadesPile.length;

    const col2FacedownLenBefore = col2Facedown.length;
    const col3FacedownLenBefore = col3Facedown.length;
    const col4FacedownLenBefore = col4Facedown.length;
    const col5FacedownLenBefore = col5Facedown.length;
    const col6FacedownLenBefore = col6Facedown.length;
    const col7FacedownLenBefore = col7Facedown.length;

    // 10 points for moving cards to the foundation
    // 5 points for uncovering face-down cards
    // 5 points for moving cards from the stock pile
    let grantFoundationPoints = false;


    const targetParent = event.target.parentElement;
    const targetChild = event.target;

    let draggedFrom;
    let targetId;
    let targetDiv;

    const draggedCardObj = getRankSuit(draggedItemId);
    const draggedCardValue = getCardValue(draggedCardObj);

    console.log(draggedCardValue)




    // these are the rules for piles that already have cards in them
    if (targetChild.classList.contains('card')) {

        targetId = targetParent.id;
        draggedFrom = draggedFromParentId;
        targetDiv = targetParent

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
            case 'clubs':
            case 'hearts':
            case 'diamonds':
            case 'spades':
                // enforce rank ascending order
                // dragged and dropped card cannot be lower in rank than the card it goes on
                if (draggedCardValue <= topCardValue) {
                    // alert('Must be next rank in accending order!')
                    return;
                }
                // must be next up in chronological order
                // e.g. 2-1=1, 5-4=1 (subracting the next lower number from any number will always equal 1)
                // in this instance we are checking that the dropped card is one rank higher than the top card
                else if ((draggedCardValue - topCardValue) !== 1) {
                    return;
                }
                // enforce suit of card matches suit of pile
                if (charArr[0] !== draggedCardObj.suit) {
                    return;
                }
                // if running code make it here the user successfully moved a card to the foundation pile
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
                // enforce rank descending order
                // dragged and dropped card cannot be higher in rank than the card it goes on
                if (draggedCardValue >= topCardValue) {
                    return;
                }
                // must be next down in chronological order
                // e.g. 2-1=1, 5-4=1 (subracting the next lower number from any number will always equal 1)
                // in this instance we are checking that the top card is one rank higher than the dropped card
                else if ((topCardValue - draggedCardValue) !== 1) {
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
    // else: these are the rules for empty piles
    else {
        targetId = targetChild.id;
        draggedFrom = draggedFromParentId;
        targetDiv = targetChild;

        // check the destination pile
        switch (targetId) {
            // foundation piles
            // only Aces are allowed in empty foundation piles
            case 'clubs':
            case 'hearts':
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
                // if running code make it here the user successfully moved an Ace to the foundation pile
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
        }
    }


    let fromPile = getOriginationArray(draggedFrom);
    let toPile = getDestinationArray(targetId);

    /* 
    ChatGPT Explanation:
        .findIndex() loops through each element in the array.
        For each element (obj), it checks whether obj.id === "001".
        It returns the index of the first matching object (or -1 if none match).
    */
    const index = fromPile.findIndex(obj => obj.id === draggedItemId);

    /*
    For the 2 "fromPile.splice(i, 1)[0]", the "[0]" part is a little confusing... need to review it again.
    ChatGPT Explanation
        splice(1, 1): This removes one item at index 1 from sourceArray, which is "banana". The removed item is returned as an array.
        push(removedItem[0]): This adds the first element of the removedItem array (which is "banana") to targetArray.
        This method effectively moves an item from one array to another while modifying the original array.
    */
    // we are moving a stack of multiple cards
    if (isStack) {
        // moving html (card) elements
        for (let i = index; i < index + movePile.length; i++) {
            console.log(`item ${i}: ${fromPile[i]}`)
            targetDiv.appendChild(document.getElementById(fromPile[i].id));
        }

        // removeing array items from "fromPile"
        for (let i = index + movePile.length - 1; i >= index; i--) {
            fromPile.splice(i, 1)[0]; // <== ChatGPT help*
        }

        // adding array items to "toPile"
        for (let i = movePile.length - 1; i >= 0; i--) {
            console.log(`moving movePile[i]: ${movePile[i]}`)
            toPile.push(movePile[i]);
        }

        // do we still need these
        movePile = [];
        isStack = false;
    }
    // we are only moving a single card (not a stack)
    else {

        toPile.push(fromPile.splice(index, 1)[0]); // <== ChatGPT help*
        targetDiv.appendChild(document.getElementById(draggedItemId));
    }

    // when the last faceup card is gone from a pile we automatically filp the first facedown card
    switch (draggedFrom) {
        // we check for and award point for flipping card in the flipCard function
        // col-1 has no facedown cards
        case 'col-2': flipCard(col2Facedown, col2Faceup, col2Div); break;
        case 'col-3': flipCard(col3Facedown, col3Faceup, col3Div); break;
        case 'col-4': flipCard(col4Facedown, col4Faceup, col4Div); break;
        case 'col-5': flipCard(col5Facedown, col5Faceup, col5Div); break;
        case 'col-6': flipCard(col6Facedown, col6Faceup, col6Div); break;
        case 'col-7': flipCard(col7Facedown, col7Faceup, col7Div); break;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////
    // SCORE

    /*
        In Standard Klondike, earn 10 points for moving cards to the foundation, 
        and 5 points for uncovering face-down cards or moving cards from the stock pile.

        Bonus Points
        Complete the game quickly to earn bonus points! Bonus points are calculated by 
        dividing 700,000 by the total game in seconds.
    */

    // 10 points for moving cards to the foundation
    // 5 points for uncovering face-down cards
    // 5 points for moving cards from the stock pile

    // Bonus Points
    // divide 700,000 by the total game in seconds

    const drawnPileLenAfter = drawnPile.length;

    const clubsPileLenAfter = clubsPile.length;
    const heartsPileLenAfter = heartsPile.length;
    const diamondsPileLenAfter = diamondsPile.length;
    const spadesPileLenAfter = spadesPile.length;

    const col2FacedownLenAfter = col2Facedown.length;
    const col3FacedownLenAfter = col3Facedown.length;
    const col4FacedownLenAfter = col4Facedown.length;
    const col5FacedownLenAfter = col5Facedown.length;
    const col6FacedownLenAfter = col6Facedown.length;
    const col7FacedownLenAfter = col7Facedown.length;

    // grant 5 points for moving cards from the stock pile
    if (drawnPileLenAfter < drawnPileLenBefore) {
        gameScore += 5;
    }

    // grant 10 points for moving cards to the foundation
    if (grantFoundationPoints === true) {
        if (clubsPileLenAfter > clubsPileLenBefore) {
            gameScore += 10;
        }
        if (heartsPileLenAfter > heartsPileLenBefore) {
            gameScore += 10;
        }
        if (diamondsPileLenAfter > diamondsPileLenBefore) {
            gameScore += 10;
        }
        if (spadesPileLenAfter > spadesPileLenBefore) {
            gameScore += 10;
        }
    }

    // grant 5 points for uncovering face-down cards
    if (grantFilpCardPoints === true) {
        // col-1 never has facedown cards
        if (col2FacedownLenAfter < col2FacedownLenBefore) {
            gameScore += 5;
        }
        if (col3FacedownLenAfter < col3FacedownLenBefore) {
            gameScore += 5;
        }
        if (col4FacedownLenAfter < col4FacedownLenBefore) {
            gameScore += 5;
        }
        if (col5FacedownLenAfter < col5FacedownLenBefore) {
            gameScore += 5;
        }
        if (col6FacedownLenAfter < col6FacedownLenBefore) {
            gameScore += 5;
        }
        if (col7FacedownLenAfter < col7FacedownLenBefore) {
            gameScore += 5;
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////
    // DETECT WINNING GAME
    const clubsFull = clubsPile.length === 13;
    const diamondsFull = diamondsPile.length === 13;
    const spadesFull = spadesPile.length === 13;
    const heartsFull = heartsPile.length === 13;

    if (clubsFull && diamondsFull && spadesFull && heartsFull) {

        isGameRunning = false;

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

        const winTime = document.getElementById('win-time');
        const winScore = document.getElementById('win-score');
        
        winTime.innerText = timeString;
        winScore.innerText = gameScore;
        gameWinModal.style.display = 'grid';

    }

    gameScoreDiv.innerText = gameScore;
    ////////////////////////////////////////////////////////////////////////////////////////////

    // for testing
    renderVarStatuses();

    event.stopPropagation();

}
/*************************************************************************/

const flipCard = (fromPile, toPile, colDiv) => {
    if (toPile.length === 0 && fromPile.length !== 0) {
        const arrItem = fromPile[fromPile.length - 1];
        const id = `id-${arrItem.suit}${arrItem.rank}`;
        const element = document.getElementById(id);
        element.remove();
        createCard(arrItem, colDiv, 'front');
        toPile.push(fromPile.pop());
        // if running code make it here a facedown card was flipped, user gets points
        grantFilpCardPoints = true;
    }
}


/* ********************************************************** */
// LOG ALL ARRAY DATA FOR TESTING
const getArrayItems = (arr, arrName) => {
    let divText = `<div> ${arrName}`;
    for (const item of arr) {
        // alert(item.id)
        if (item.id !== undefined) {
            divText += `<div>${item.id}</div>`;
        } else {
            divText += `<div>${item[0]}</div>`;
        }
        // console.log(item[0])
    }
    divText += ` </div>`;
    return divText;
}

const renderVarStatuses = () => {

    varStatuses.innerHTML = '';

    varStatuses.innerHTML += getArrayItems(stockPile, 'stockPile');
    varStatuses.innerHTML += getArrayItems(drawnPile, 'drawnPile');

    varStatuses.innerHTML += getArrayItems(clubsPile, 'clubsPile');
    varStatuses.innerHTML += getArrayItems(heartsPile, 'heartsPile');
    varStatuses.innerHTML += getArrayItems(diamondsPile, 'diamondsPile');
    varStatuses.innerHTML += getArrayItems(spadesPile, 'spadesPile');

    varStatuses.innerHTML += getArrayItems(col1Faceup, 'col1Faceup');
    varStatuses.innerHTML += getArrayItems(col2Faceup, 'col2Faceup');
    varStatuses.innerHTML += getArrayItems(col3Faceup, 'col3Faceup');
    varStatuses.innerHTML += getArrayItems(col4Faceup, 'col4Faceup');
    varStatuses.innerHTML += getArrayItems(col5Faceup, 'col5Faceup');
    varStatuses.innerHTML += getArrayItems(col6Faceup, 'col6Faceup');
    varStatuses.innerHTML += getArrayItems(col7Faceup, 'col7Faceup');

    varStatuses.innerHTML += getArrayItems(col2Facedown, 'col2Facedown');
    varStatuses.innerHTML += getArrayItems(col3Facedown, 'col3Facedown');
    varStatuses.innerHTML += getArrayItems(col4Facedown, 'col4Facedown');
    varStatuses.innerHTML += getArrayItems(col5Facedown, 'col5Facedown');
    varStatuses.innerHTML += getArrayItems(col6Facedown, 'col6Facedown');
    varStatuses.innerHTML += getArrayItems(col7Facedown, 'col7Facedown');

    varStatuses.innerHTML += getArrayItems(movePile, 'movePile');
}
/* ********************************************************** */

/*----------------------------- Event Listeners -----------------------------*/

newGameBtn.addEventListener('click', newGame);

stockPileDiv.addEventListener('click', stockPileClick)

//dragoverHandler
clubsPileDiv.addEventListener('dragover', dragoverHandler);
heartsPileDiv.addEventListener('dragover', dragoverHandler);
diamondsPileDiv.addEventListener('dragover', dragoverHandler);
spadesPileDiv.addEventListener('dragover', dragoverHandler);

//dropHandler
clubsPileDiv.addEventListener('drop', dropHandler);
heartsPileDiv.addEventListener('drop', dropHandler);
diamondsPileDiv.addEventListener('drop', dropHandler);
spadesPileDiv.addEventListener('drop', dropHandler);


col1Div.addEventListener('dragover', dragoverHandler);
col2Div.addEventListener('dragover', dragoverHandler);
col3Div.addEventListener('dragover', dragoverHandler);
col4Div.addEventListener('dragover', dragoverHandler);
col5Div.addEventListener('dragover', dragoverHandler);
col6Div.addEventListener('dragover', dragoverHandler);
col7Div.addEventListener('dragover', dragoverHandler);

col1Div.addEventListener('drop', dropHandler);
col2Div.addEventListener('drop', dropHandler);
col3Div.addEventListener('drop', dropHandler);
col4Div.addEventListener('drop', dropHandler);
col5Div.addEventListener('drop', dropHandler);
col6Div.addEventListener('drop', dropHandler);
col7Div.addEventListener('drop', dropHandler);

