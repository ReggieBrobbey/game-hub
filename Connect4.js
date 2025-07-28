var playerRed = "R";
var playerYellow = "Y";
var currPlayer = playerRed;
var gameOver = false;
var board;
var currColumns;
var rows = 6;
var columns = 7;
var timerInterval;
var timeLeft;

function setPlayersColors() {
    const player1Color = document.getElementById('player1-color').value;
    const player2Color = document.getElementById('player2-color').value;

    // Change the CSS styles dynamically
    document.documentElement.style.setProperty('--player1-color', player1Color);
    document.documentElement.style.setProperty('--player2-color', player2Color);
}

window.onload = function() {
    setGame();
}

function setGame() {
    board = [];
    currColumns = [5, 5, 5, 5, 5, 5, 5];
    const boardElement = document.getElementById("board");
    boardElement.innerHTML = ""; // Clear the board element
    for (let r = 0; r < rows; r++) {
        let row = [];
        for (let c = 0; c < columns; c++) {
            // JS
            row.push(' ');

            // HTML
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            tile.classList.add("tile");
            tile.addEventListener("click", setPiece);
            boardElement.append(tile);
        }
        board.push(row);
    }
    startTurnTimer(); // Start the timer for the first turn
}

function startTurnTimer() {
    // Generate random time between 30 and 60 seconds
    timeLeft = Math.floor(Math.random() * (60 - 30 + 1) + 30);
    document.getElementById("timer").innerText = `Time left: ${timeLeft}s`;

    clearInterval(timerInterval); // Clear any existing timer
    timerInterval = setInterval(function() {
        timeLeft--;
        document.getElementById("timer").innerText = `Time left: ${timeLeft}s`;
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            skipTurn();
        }
    }, 1000);
}

function skipTurn() {
    currPlayer = (currPlayer === playerRed) ? playerYellow : playerRed;
    startTurnTimer();
}

function setPiece() {
    if (gameOver) {
        return;
    }

    let coords = this.id.split("-"); // "0-0" -> ["0", "0"]
    let r = parseInt(coords[0]);
    let c = parseInt(coords[1]);

    r = currColumns[c];
    if (r < 0) {
        return;
    }

    board[r][c] = currPlayer;
    let tile = document.getElementById(r.toString() + "-" + c.toString());
    if (currPlayer === playerRed) { 
        tile.classList.add("red-piece");
        currPlayer = playerYellow;
    } else {
        tile.classList.add("yellow-piece");
        currPlayer = playerRed;
    }

    currColumns[c] = r - 1; // Corrected row height update for the column

    checkWinner();
    if (!gameOver) {
        startTurnTimer(); // Start the timer for the next turn
    }
}

function checkWinner() {
    // Horizontally
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns - 3; c++) { 
            if (board[r][c] != ' ') {
                if (board[r][c] == board[r][c+1] && board[r][c+1] == board[r][c+2] && board[r][c+2] == board[r][c+3]) {
                    setWinner(r, c);
                    return;
                }
            }
        }
    }

    // Vertically
    for (let c = 0; c < columns; c++) {
        for (let r = 0; r < rows - 3; r++) {
            if (board[r][c] != ' ') {
                if (board[r][c] == board[r+1][c] && board[r+1][c] == board[r+2][c] && board[r+2][c] == board[r+3][c]) {
                    setWinner(r, c);
                    return;
                }
            }
        }
    }

    // Diagonally (Bottom-Left to Top-Right)
    for (let r = 0; r < rows - 3; r++) {
        for (let c = 0; c < columns - 3; c++) {
            if (board[r][c] != ' ') {
                if (board[r][c] == board[r+1][c+1] && board[r+1][c+1] == board[r+2][c+2] && board[r+2][c+2] == board[r+3][c+3]) {
                    setWinner(r, c);
                    return;
                }
            } 
        }
    }

    // Diagonally (Top-Left to Bottom-Right)
    for (let r = 3; r < rows; r++) {
        for (let c = 0; c < columns - 3; c++) {
            if (board[r][c] != ' ') {
                if (board[r][c] == board[r-1][c+1] && board[r-1][c+1] == board[r-2][c+2] && board[r-2][c+2] == board[r-3][c+3]) {
                    setWinner(r, c);
                    return;
                }
            } 
        }
    }
}

function setWinner(r, c) {
    let winner = document.getElementById("winner");
    if (board[r][c] == playerRed) {
        winner.innerText = "Player 1 Wins";
    } else {
        winner.innerText = "Player 2 Wins";
    }
    gameOver = true;
    clearInterval(timerInterval); // Stop the timer
    document.getElementById("play-again").style.display = "block"; // Show the "Play Again" button
    
    // Trigger confetti effect
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
    });
}

function playAgain() {
    // Reset the game state
    gameOver = false;
    currPlayer = playerRed;
    document.getElementById("winner").innerText = "";
    document.getElementById("play-again").style.display = "none"; // Hide the "Play Again" button
    document.getElementById("timer").innerText = ""; // Reset the timer display

    // Reinitialize the game
    setGame();
}
