/*-------------------------------- Constants --------------------------------*/

const suits = ['♠', '♥', '♦', '♣'];
const ranks = ['02', '03', '04', '05', '06', '07', '08', '09', '10', 'J', 'Q', 'K', 'A'];

/*-------------------------------- Variables --------------------------------*/

let deck = [];
let stockPile = [];
let drawnPile = [];

/*------------------------ Cached Element References ------------------------*/

const newGameBtn = document.querySelector('#new-game');
const stockPileDiv = document.querySelector('#stock-pile');
const drawnPileDiv = document.querySelector('#drawn-pile');
const clubsFoundation = document.querySelector('#clubs')
const heartsFoundation = document.querySelector('#hearts')
const diamondsFoundation = document.querySelector('#diamonds')
const spadesFoundation = document.querySelector('#spades')
/*-------------------------------- Functions --------------------------------*/

// Creates deck
const createDeck = () => {
    deck = [];
    for (let suit of suits) {
        for (let rank of ranks) {
            deck.push({ suit, rank });
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
    drawnPile.push(stockPile.pop());
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

// handle card clicked
const handleCardClick = (event) => {
    console.log('Button clicked!');
    console.log(event.target)
};

// TODO: look into hiding dragged element's original location until dropped in new location.
// This is a start: https://stackoverflow.com/questions/36379184/html5-draggable-hide-original-element

// Drag and Drop source:
// https://www.w3schools.com/HTML/html5_draganddrop.asp
function dragstartHandler(event) {
    event.dataTransfer.setData("text", event.target.id);
}

function dragoverHandler(event) {
    event.preventDefault();
    console.log('hovering...')
}

function dropHandler(event) {
    event.preventDefault();
    const data = event.dataTransfer.getData("text");
    console.log(data)
    event.target.appendChild(document.getElementById(data));
}


// Creates a card
const createCard = (c, cardDiv, frontBack) => {
    let cardClass = '';
    switch (c.suit) {
        case '♥':
            cardClass = `h${c.rank}`;
            break;
        case '♦':
            cardClass = `d${c.rank}`;
            break;
        case '♠':
            cardClass = `s${c.rank}`;
            break;
        case '♣':
            cardClass = `c${c.rank}`;
            break;
    }

    const id = cardClass;
    const div = document.createElement("div");

    // TODO: create helper function so we can toggle the front/back
    if (frontBack === 'front') {

        div.setAttribute('id', id);
        div.setAttribute('draggable', true)
        div.classList.add('card');
        div.classList.add('large');
        div.classList.add('front');
        div.classList.add(cardClass);

        cardDiv.appendChild(div);

        div.addEventListener('dragstart', dragstartHandler);
        div.addEventListener('dragover', dragoverHandler);
        div.addEventListener('drop', dropHandler);
    } else if (frontBack === 'back') {

        div.setAttribute('id', id);
        div.classList.add('card');
        div.classList.add('large');
        div.classList.add('back-blue');
        div.classList.add('shadow');
        div.classList.add('back');

        stockPileDiv.appendChild(div);
    }

    // dynamically create event listener after div is created
    div.addEventListener('click', handleCardClick);
}

// renders the stock pile
const renderStockPile = () => {
    stockPileDiv.innerHTML = '';
    stockPile.map(c => createCard(c, stockPileDiv, 'back'));
}


// Starts off hiding first card of dealer
const renderDrawnPile = () => {
    drawnPileDiv.innerHTML = '';
    drawnPile.map(c => createCard(c, drawnPileDiv, 'front'));
}

// render table
const renderCards = () => {
    // renderStockPile();***********************************************
    renderStockPile()
    renderDrawnPile();
}

// starts a new game
const newGame = (event) => {
    createDeck();
    shuffleDeck();
    dealCards();
    renderCards();

    console.log('deck: ' + deck.length)
    console.log('stockPile: ' + stockPile.length)
    console.log('drawnPile: ' + drawnPile.length)
}

/*----------------------------- Event Listeners -----------------------------*/

newGameBtn.addEventListener('click', newGame);

//dragoverHandler
clubsFoundation.addEventListener('dragover', dragoverHandler);
heartsFoundation.addEventListener('dragover', dragoverHandler);
diamondsFoundation.addEventListener('dragover', dragoverHandler);
spadesFoundation.addEventListener('dragover', dragoverHandler);

//dropHandler
clubsFoundation.addEventListener('drop', dropHandler);
heartsFoundation.addEventListener('drop', dropHandler);
diamondsFoundation.addEventListener('drop', dropHandler);
spadesFoundation.addEventListener('drop', dropHandler);