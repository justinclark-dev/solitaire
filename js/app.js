/*-------------------------------- Constants --------------------------------*/

// const suits = ['♠', '♥', '♦', '♣'];

// const suits = ['s', 'h', 'd', 'c'];
// const ranks = ['02', '03', '04', '05', '06', '07', '08', '09', '10', 'J', 'Q', 'K', 'A'];

const suits = ['s'];
const ranks = ['A','K','J'];

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

const varStatuses = document.querySelector('#var-statuses');

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
   // console.log('Button clicked!')

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
    // for testing
    renderVarStatuses()
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


const getOriginationArray = (arr) => {
    switch (arr) {
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

const getDestinationArray = (arr) => {
    switch (arr) {
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

function dropHandler(event) {
    event.preventDefault();

    const targetParent = event.target.parentElement;
    const targetChild = event.target;
    
    let draggedFrom;
    let targetId;
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

    let fromPile = getOriginationArray(draggedFrom);
    let toPile = getDestinationArray(targetId);

    /* 
    Explanation:
        .findIndex() loops through each element in the array.
        For each element (obj), it checks whether obj.id === "001".
        It returns the index of the first matching object (or -1 if none match).
    */
    const index = fromPile.findIndex(obj => obj.id === draggedItemId)
    
    /*
    Explanation of the Code
        splice(1, 1): This removes one item at index 1 from sourceArray, which is "banana". The removed item is returned as an array.
        push(removedItem[0]): This adds the first element of the removedItem array (which is "banana") to targetArray.
        This method effectively moves an item from one array to another while modifying the original array.
    */
    toPile.push(fromPile.splice(index, 1)[0])
    targetDiv.appendChild(document.getElementById(draggedItemId)); 

    // console.log(fromPile.length)
    // console.log(toPile.length)

    // for testing
    renderVarStatuses();

    event.stopPropagation();

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
        console.log(item[0])
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

/*

Key milesontes complete:

Add logic to add IDs to all card elements.
Figure out logic to determine what card was clicked.
Figure out logic to drag and drop elements.
Figure out logic to detect hover targets.


Key milesontes, what's left:


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