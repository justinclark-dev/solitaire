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

// Creates a card
const createCard = (c, cardDiv) => {
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

    const div = document.createElement("div");
    div.classList.add('card');
    div.classList.add('large');
    div.classList.add('front');
    div.classList.add(cardClass);
    div.innerHTML = `
          <div class="top">${c.rank}</div>
          <div class="middle">${c.suit}</div>
          <div class="bottom">${c.rank}</div>
        `;
    cardDiv.appendChild(div);
}

// renders the stock pile
const renderStockPile = () => {
    stockPileDiv.innerHTML = '';

    console.log('renderStockPile function initiated...')
    for (let index = stockPile.length; index > 0; index--) {
        console.log(`Cards left in draw pile: ${stockPile.length}`)
        
        const div = document.createElement("div");
        div.classList.add('card');
        div.classList.add('large');
        div.classList.add('back-blue');
        div.classList.add('shadow');
        div.classList.add('back');

        stockPileDiv.appendChild(div);
        
        console.log('renderStockPile for loop content: '+stockPile.length);
    } 
    console.log('renderStockPile function ended...');
}

// Starts off hiding first card of dealer
const renderDrawnPile = () => {
    drawnPileDiv.innerHTML = '';
    drawnPile.map(c => createCard(c, drawnPileDiv));
}

// render table
const renderCards = () => {
    renderStockPile();
    renderDrawnPile();
}

// starts a new game
const newGame = (event) => {
    createDeck();
    shuffleDeck();
    dealCards();
    renderCards();

    console.log('deck: '+deck.length)
    console.log('stockPile: '+stockPile.length)
    console.log('drawnPile: '+drawnPile.length)
}

/*----------------------------- Event Listeners -----------------------------*/

newGameBtn.addEventListener('click', newGame);