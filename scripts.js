// ------------------------------------------
// Tutorial 5: DOM Objects and Events
// ------------------------------------------

// Step 1: Initialize the game by setting the value inside next-lbl to nextPlayer
let nextPlayer = 'X'; // 'X' always starts

// set the text of the label with id "next-lbl"
document.getElementById('next-lbl').innerText = nextPlayer;

// Step 2: Create the game board
createGameBoard();

function createGameBoard() {
    // There are 9 cells in the board: c1 to c9
    for (let i = 1; i <= 9; i++) {
        // get each cell by its id (c1, c2, ... c9)
        let cell = document.getElementById('c' + i);

        // create a new button element
        let btn = document.createElement('button');
        btn.innerText = "[ ]"; // initial label

        // Step 3: Add event listener to each button
        btn.addEventListener('click', function (event) {
            takeCell(event); // call takeCell on click
        });

        // add the button into the cell
        cell.appendChild(btn);
    }
}

// Step 4: Define what happens when a cell is clicked
function takeCell(event) {
    // get the clicked button
    let button = event.target;

    // replace [ ] with [X] or [O] based on nextPlayer
    button.innerText = "[" + nextPlayer + "]";

    // disable the button so it can't be clicked again
    button.disabled = true;

    // switch to the other player
    nextPlayer = (nextPlayer === 'X') ? 'O' : 'X';

    // update label text for next player
    document.getElementById('next-lbl').innerText = nextPlayer;

    // Step 5: Check if game is over
    if (isGameOver()) {
        // display "Game Over" in the element with id "game-over-lbl"
        document.getElementById('game-over-lbl').innerHTML = "<h1>Game Over</h1>";
    }
}

// Step 6: Define when the game is over
function isGameOver() {
    // select all buttons on the board
    let buttons = document.querySelectorAll('td button');

    // check if all buttons are disabled
    for (let btn of buttons) {
        if (!btn.disabled) {
            return false; // at least one still clickable
        }
    }
    return true; // all are disabled
}
