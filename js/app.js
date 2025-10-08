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

/*------------------------ Cached Element References ------------------------*/

const copyYear = document.querySelector('#year');
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
    // console.log('Button clicked!');
    // console.log(event.target);
};

const stockPileClick = (event) => {
    // console.log(stockPile.length)
    if (stockPile.length > 1) {
        /*
            flip top card
            move card to drawn pile
            animate flip and move (optional)
        */
        drawnPile.push(stockPile.pop());

        renderDrawnPile();
    } else if (stockPile.length===1) {
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
}
/************************************************************************* */
// TODO: look into hiding dragged element's original location until dropped in new location.
// This is a start: https://stackoverflow.com/questions/36379184/html5-draggable-hide-original-element

// Drag and Drop source:
// https://www.w3schools.com/HTML/html5_draganddrop.asp

//let parentId = '';
let draggedFromParentId = '';
let draggedItemId = '';

function dragstartHandler(event) {
    //event.dataTransfer.setData("text", event.target.id);
    
    draggedFromParentId = event.target.parentElement.id;
    draggedItemId = event.target.id
    
}

function dragoverHandler(event) {
    event.preventDefault();
    console.log('hovering...');
}




function dropHandler(event) {
    event.preventDefault();

    const targetParent = event.target.parentElement;
    const targetChild = event.target;

    const data = draggedItemId;
    

    const droppedToParentId = event.target.parentElement.id;
    
    let draggedFrom;
    let targetId;

    let fromPile;
    let toPile;

    let targetDiv;

    if (targetChild.classList.contains('card')) {
        targetId = targetParent.id;

        draggedFrom = draggedFromParentId;
        targetDiv = targetParent
    } else {
        targetId = targetChild.id
        draggedFrom = draggedFromParentId
        targetDiv = targetChild
    }


    // alert(targetId)


        switch (draggedFrom) {
            case 'drawn-pile':
                fromPile = drawnPile;
                break;
            case 'clubs':
                fromPile = clubsPile;
                break;
            case 'hearts':
                fromPile = heartsPile;
                break;
            case 'diamonds':
                fromPile = diamondsPile;
                break;
            case 'spades':
                fromPile = spadesPile;
                break;
            case 'col-1':
                fromPile = col1Faceup;
                break;
            case 'col-2':
                fromPile = col2Faceup;
                break;
            case 'col-3':
                fromPile = col3Faceup;
                break;
            case 'col-4':
                fromPile = col4Faceup;
                break;
            case 'col-5':
                fromPile = col5Faceup;
                break;
            case 'col-6':
                fromPile = col6Faceup;
                break;
            case 'col-7':
                fromPile = col7Faceup;
                break;
        }


// alert(targetId)

    switch (targetId) {
        case 'clubs':
            toPile = clubsPile;
            break;
        case 'hearts':
            toPile = heartsPile;
            break;
        case 'diamonds':
            toPile = diamondsPile;
            break;
        case 'spades':
            toPile = spadesPile;
            break;
        case 'col-1':
            toPile = col1Faceup;
            break;
        case 'col-2':
            toPile = col2Faceup;
            break;
        case 'col-3':
            toPile = col3Faceup;
            break;
        case 'col-4':
            toPile = col4Faceup;
            break;
        case 'col-5':
            toPile = col5Faceup;
            break;
        case 'col-6':
            toPile = col6Faceup;
            break;
        case 'col-7':
            toPile = col7Faceup;
            break;

    }

    

    /* 
    Explanation:
        .findIndex() loops through each element in the array.
        For each element (obj), it checks whether obj.id === "001".
        It returns the index of the first matching object (or -1 if none match).
    */
    const index = fromPile.findIndex(obj => obj.id === data)
    // console.log(`indexOf(${data}) is index: ${index}`)
    
    toPile.push(fromPile.splice(index, 1))


    console.log('stockPile: '+stockPile.length)
    console.log('drawnPile: '+drawnPile.length)
    console.log('clubsPile: '+clubsPile.length)

    // console.log(event.target)
    targetDiv.appendChild(document.getElementById(data));


    // drawnPileDiv.removeChild(document.getElementById(data))

}
/*************************************************************************/

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
        div.classList.add('large');
        div.classList.add('front');
        div.classList.add(cardClass);

        cardDiv.appendChild(div);

        div.addEventListener('dragstart', dragstartHandler);
        div.addEventListener('dragover', dragoverHandler);
        div.addEventListener('drop', dropHandler);
    } else if (frontBack === 'back') {

        // div.setAttribute('id', id);
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
            // console.log(`suit: ${c.suit}, rank: ${c.rank}, id: ${c.id}`)
            createCard(c, drawnPileDiv, 'front')
        });
    }
}

// render table
const renderCards = () => {
    renderStockPile();
    renderDrawnPile();
}

// starts a new game
const newGame = (event) => {
    clearGame();
    createDeck();
    shuffleDeck();
    dealCards();
    renderCards();
}

const clearGame = () => {

    stockPileDiv.innerHTML = '';
    drawnPileDiv.innerHTML = '';
    clubsPileDiv.innerHTML = 'clubs';
    heartsPileDiv.innerHTML = 'hearts';
    diamondsPileDiv.innerHTML = 'diamonds';
    spadesPileDiv.innerHTML = 'spades';

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
}

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

/*

Key milesontes complete:

Add logic to add IDs to all card elements.
Figure out logic to determine what card was clicked.
Figure out logic to drag and drop elements.
Figure out logic to detect hover targets.


Key milesontes, what's left:

*/
/*

stock pile click handler
    if stock pile not empty
        flip top card
        move card to drawn pile
        animate flip and move (optional)
    else
        flip drawn cards pile
        move pile to stock pile

column arrays
    col1Faceup
    col2Faceup
    col3Faceup
    col4Faceup
    col5Faceup
    col6Faceup
    col7Faceup

    col2Facedown
    col3Facedown
    col4Facedown
    col5Facedown
    col6Facedown
    col7Facedown
    
card drop handler
    if dropping single card
        if drop in foundation piles
            if foundation pile is empty
                card must be Ace
            else card must be:
                next higher rank 
                and same suit
        if drop in column
            if column empty 
                rank must be King
            else
                card to attach to 
                    must be face up
                card to attach
                    suit must be opposite color
                    rank must be next lower rank
    else if dropping pile
        can only drop on face up column
        top card must be
            next lower rank of existing pile
            opposite suit color of existing pile

column card click handler
    if card is face up
        note the highest ordered card in order
        select all cards below
        automove card to available spot (optional)
    else if card is face down
        flip card face up


auto flip (optional)
    (how to detect this?)
    if no face up pile on top
        auto flip last facedown column card

 */