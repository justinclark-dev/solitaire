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

let gameTimeStarted = 0;
let gameTimeStopped = 0;
let isGameRunning = false;

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

    const columnPileDivs = [col1Div, col2Div, col3Div, col4Div, col5Div, col6Div, col7Div];

    // deal facedown cards
    const facedownPiles = [col2Facedown, col3Facedown, col4Facedown, col5Facedown, col6Facedown, col7Facedown];
    for (let i = 0; i < facedownPiles.length; i++) {
        facedownPiles[i].push(stockPile.pop());
        facedownPiles[i].map(c => createCard(c, columnPileDivs[i+1], 'back'));
    }
    for (let i = 1; i < facedownPiles.length; i++) {
        facedownPiles[i].push(stockPile.pop());
        createCard(facedownPiles[i][1], columnPileDivs[i+1], 'back')
    }
    for (let i = 2; i < facedownPiles.length; i++) {
        facedownPiles[i].push(stockPile.pop());
        createCard(facedownPiles[i][2], columnPileDivs[i+1], 'back')
    }
    for (let i = 3; i < facedownPiles.length; i++) {
        facedownPiles[i].push(stockPile.pop());
        createCard(facedownPiles[i][3], columnPileDivs[i+1], 'back')
    }
    for (let i = 4; i < facedownPiles.length; i++) {
        facedownPiles[i].push(stockPile.pop());
        createCard(facedownPiles[i][4], columnPileDivs[i+1], 'back')
    }   
    for (let i = 5; i < facedownPiles.length; i++) {
        facedownPiles[i].push(stockPile.pop());
        createCard(facedownPiles[i][5], columnPileDivs[i+1], 'back')
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

        div.setAttribute('id', 'id-'+id);
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





gameTimeStarted = new Date();

const renderTimePlaying = () => {

    let endTime = new Date();
    let elapsed = endTime - gameTimeStarted; // time in milliseconds

    let seconds = Math.floor((elapsed / 1000) % 60);
    let minutes = Math.floor((elapsed / (1000 * 60)) % 60);
    let hours = Math.floor((elapsed / (1000 * 60 * 60)) % 24);

    if (seconds < 10) seconds = `0${seconds}`;
    if (minutes < 10) minutes = `0${minutes}`;
    if (hours < 10) hours = `0${hours}`;

    const timeString = `${hours}:${minutes}:${seconds}`;
    const timePlaying = document.getElementById('time-playing');

    timePlaying.innerHTML = timeString;


    // console.log(`${minutes} minutes : ${seconds} seconds`);


}
setInterval(renderTimePlaying, 1000);





// let startTime = Date.now(); // Record the start time

// function updateElapsedTime() {
//     let currentTime = Date.now(); // Get the current time
//     let elapsedTime = Math.floor((currentTime - startTime) / 1000); // Calculate elapsed time in seconds
//     document.getElementById("elapsedTime").innerHTML = `${elapsedTime} seconds`; // Update the display
// }

// // Update the elapsed time every second
// setInterval(updateElapsedTime, 1000);



// gameTimeStarted = new Date.now();

isGameRunning = true;



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

    gameTimeStarted = 0;
    gameTimeStopped = 0;
    isGameRunning = false;
}



/************************************************************************* */
// TODO: look into hiding dragged element's original location until dropped in new location.
// This is a start: https://stackoverflow.com/questions/36379184/html5-draggable-hide-original-element

// Drag and Drop source:
// https://www.w3schools.com/HTML/html5_draganddrop.asp

//let parentId = '';
let draggedFromParentId = '';
let draggedItemId = '';
let isStack = false;

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
    //event.dataTransfer.setData("text", event.target.id);
    
    draggedFromParentId = event.target.parentElement.id;
    draggedItemId = event.target.id;

    // movePile
  
    
    let fromPile;
    switch (draggedFromParentId) {
        case 'col-1': fillMovePile(col1Faceup); break;
        case 'col-2': fillMovePile(col2Faceup); break;
        case 'col-3': fillMovePile(col3Faceup); break;
        case 'col-4': fillMovePile(col4Faceup); break;
        case 'col-5': fillMovePile(col5Faceup); break;
        case 'col-6': fillMovePile(col6Faceup); break;
        case 'col-7': fillMovePile(col7Faceup); break;
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
        case 'hearts': console.log('getOriginationArray(hearts' ); return heartsPile;
        case 'diamonds': console.log('getOriginationArray(diamonds' ); return diamondsPile;
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

function dropHandler(event) {
    event.preventDefault();

    // alert('event.stopPropagation()... not stopping!')

    const targetParent = event.target.parentElement;
    const targetChild = event.target;
    
    let draggedFrom;
    let targetId;
    let targetDiv;

    const draggedCardObj = getRankSuit(draggedItemId);
    const draggedCardValue = getCardValue(draggedCardObj);

    console.log(draggedCardValue)

    
    if (targetChild.classList.contains('card')) {
        // the pile already has cards

        targetId = targetParent.id;
        draggedFrom = draggedFromParentId;
        targetDiv = targetParent

        const topCardId = event.target.id;
        const topCardObj = getRankSuit(topCardId);
        const topCardValue = getCardValue(topCardObj);

        // alert('topCardValue: '+topCardValue)
        // alert('draggedCardValue: '+draggedCardValue)

        console.log('topCardObj: '+topCardObj.suit)

        // alert('targetId in card: '+targetId)
        const charArr = [...targetId];
        switch (targetId) {
            case 'clubs':
            case 'hearts':
            case 'diamonds':
            case 'spades':
                // enforce ascending order
                if (draggedCardValue <= topCardValue) {
                    // alert('Must be next rank in accending order!')
                    return
                } else if ((draggedCardValue - topCardValue) !== 1) {
                    // alert('Must be the next number 1 away')
                    return
                }

                if (charArr[0] !== draggedCardObj.suit) {
                    // alert('Suit of card must match suit of pile!')
                    return;
                }

                break;
        // }
        // switch (targetId) {
            case 'col-1':
            case 'col-2':
            case 'col-3':
            case 'col-4':
            case 'col-5':
            case 'col-6':
            case 'col-7':

                // enforce descending order
                if (draggedCardValue >= topCardValue) {
                    // alert('Must be next rank in decending order!')
                    return
                } else if ((topCardValue - draggedCardValue) !== 1) {
                    // alert('Must be the next number 1 away')
                    return
                }

                // enforce alternating suit colors
                if (draggedCardObj.suit === 'h' && (topCardObj.suit === 'h' || topCardObj.suit === 'd')) {
                    // alert('Color of suit must alternate!')
                    return;
                }
                if (draggedCardObj.suit === 'd' && (topCardObj.suit === 'h' || topCardObj.suit === 'd')) {
                    // alert('Color of suit must alternate!')
                    return;
                }
                if (draggedCardObj.suit === 'c' && (topCardObj.suit === 'c' || topCardObj.suit === 's')) {
                    // alert('Color of suit must alternate!')
                    return;
                }
                if (draggedCardObj.suit === 's' && (topCardObj.suit === 'c' || topCardObj.suit === 's')) {
                    // alert('Color of suit must alternate!')
                    return;
                }
               
                break;

        } // <== end switch()





    } else {

        // alert('targetId (column supposed to be empty?): '+targetId)

        // the pile is empty
        targetId = targetChild.id;
        draggedFrom = draggedFromParentId;
        targetDiv = targetChild;

        switch (targetId) {
            case 'clubs':
            case 'hearts':
            case 'diamonds':
            case 'spades':
                const charArr = [...targetId];
                if (charArr[0] !== draggedCardObj.suit) {
                    // alert('Suit of card must match suit of pile!')
                    return;
                }
                if (draggedCardValue !== 1) {
                    // alert('Only Aces are allowed!')
                    return;
                }
                break;
        // }

        // switch (targetId) {
            case 'col-1':
            case 'col-2':
            case 'col-3':
            case 'col-4':
            case 'col-5':
            case 'col-6':
            case 'col-7':
                // enforce only kings in empty columns
                if (draggedCardValue !== 13) {
                    // alert('Only Kings are allowed in empty columns!')
                    return;
                }
                break;
        }


    }

    let fromPile = getOriginationArray(draggedFrom);
    let toPile = getDestinationArray(targetId);


    // alert('alert id: '+fromPile[0].id)
    // console.log('alert id: '+fromPile[0].id)
    /* 
    ChatGPT Explanation:
        .findIndex() loops through each element in the array.
        For each element (obj), it checks whether obj.id === "001".
        It returns the index of the first matching object (or -1 if none match).
    */
    const index = fromPile.findIndex(obj => obj.id === draggedItemId);
    
    /*
    ChatGPT Explanation
        splice(1, 1): This removes one item at index 1 from sourceArray, which is "banana". The removed item is returned as an array.
        push(removedItem[0]): This adds the first element of the removedItem array (which is "banana") to targetArray.
        This method effectively moves an item from one array to another while modifying the original array.
    */

    if (isStack) {
        console.log(`Attempting to move stack...`)

        console.log(`fromPile: \n${fromPile}`)
        console.log(`toPile: \n${toPile}`)
        console.log(`dragged item index: ${index}`)

        console.log(`fromPile length is: ${fromPile.length}`)
        console.log(`toPile length is: ${toPile.length}`)
        console.log(`movePile length is: ${movePile.length}`)

        // for (let i = index + movePile.length; i >= index; i--) {
        console.log('forward order...........................................')
        console.log('moving html (card) elements...........................................')
        for (let i = index; i < index + movePile.length; i++) {

            console.log(`item ${i}: ${fromPile[i]}`)
            targetDiv.appendChild(document.getElementById(fromPile[i].id));

        }
        console.log('backward order...........................................')
        for (let i = index + movePile.length-1; i >= index; i--) {
            console.log(`item ${i}: ${fromPile[i]}`)
        }
        console.log('Before removing items......')
        console.log(`length of fromPile: ${fromPile.length}`)
        console.log('removeing array items from "fromPile"...........................................')
        for (let i = index + movePile.length-1; i >= index; i--) {


            //console.log(fromPile[i].id)

            // console.log(`attempting to move card id: ${fromPile[i].id} which is at index: ${i}.`);
            
            fromPile.splice(i, 1)[0];

            // targetDiv.appendChild(document.getElementById(fromPile[i].id)); 


        }
        console.log('After removing items......')

        console.log('adding array items to "toPile"...........................................')
        for (let i = movePile.length-1; i >= 0; i--) {
            console.log(`moving movePile[i]: ${movePile[i]}`)
            toPile.push(movePile[i]);
        }



        console.log(`length of fromPile: ${fromPile.length}`)
        movePile = [];
        isStack = false;
    } else {
        toPile.push(fromPile.splice(index, 1)[0]);
        targetDiv.appendChild(document.getElementById(draggedItemId)); 
    }

    switch (draggedFrom) {

        // case 'col-1': flipCard(col1Facedown, col1Faceup, col1Div); break;
        case 'col-2': flipCard(col2Facedown, col2Faceup, col2Div); break;
        case 'col-3': flipCard(col3Facedown, col3Faceup, col3Div); break;
        case 'col-4': flipCard(col4Facedown, col4Faceup, col4Div); break;
        case 'col-5': flipCard(col5Facedown, col5Faceup, col5Div); break;
        case 'col-6': flipCard(col6Facedown, col6Faceup, col6Div); break;
        case 'col-7': flipCard(col7Facedown, col7Faceup, col7Div); break;
            // flipCard(col7Facedown, col7Faceup, col7Div);
            // if (col7Faceup.length === 0) {
            //     const arrItem = col7Facedown[col7Facedown.length - 1];
            //     const id = `id-${arrItem.suit}${arrItem.rank}`;
            //     const element = document.getElementById(id);
            //     element.remove();
            //     createCard(arrItem, col7Div, 'front');
            //     col7Faceup.push(col7Facedown.pop());
            // }
            
    }

    


    // console.log(fromPile.length)
    // console.log(toPile.length)


    // for testing
    renderVarStatuses();

    // DETECT WINNING GAME
    const clubsFull = clubsPile.length === 13;
    const diamondsFull = diamondsPile.length === 13;
    const spadesFull = spadesPile.length === 13;
    const heartsFull = heartsPile.length === 13;

    // if (clubsFull===true && diamondsFull===true && spadesFull===true && heartsFull===true) {
    if (clubsFull && diamondsFull && spadesFull && heartsFull) {

        alert('You win!')
        gameTimeStopped = new Date();
        isGameRunning = false();

    }
    

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

