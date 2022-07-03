let board = {
    startArrangement: [4, 4, 4, 4, 4, 4, 0, 4, 4, 4, 4, 4, 4, 0],
    currentArrangement: [4, 4, 4, 4, 4, 4, 0, 4, 4, 4, 4, 4, 4, 0],
};
let player1 = {
    name: "Player 1",
    playableSpaces: board.currentArrangement.slice(0, 6),
    winSpace: 6,
    score: board.currentArrangement[6],
    isTurn: true
};
let player2 = {
    name: "Player 2",
    playableSpaces: board.currentArrangement.slice(7, 13),
    winSpace: 13,
    score: board.currentArrangement[13],
    isTrue: false
};
board.currentTurn = checkTurn();
board.gameOver = false;

//html stuff below

let pitArray = Array.from(document.getElementsByClassName("pit"));
document.getElementById("score-display1").innerHTML = player1.score;
document.getElementById("score-display2").innerHTML = player2.score;
document.getElementById("current-turn").innerHTML = board.currentTurn.name + "'s turn";
document.getElementById("reset-button").addEventListener("click", resetGame);
updateDisplay();
setPlayableSpace();


//functions below

function move(event){
    let target = event.currentTarget;
    let beginMove = pitArray.indexOf(target);
    calculateMove(beginMove);
    checkMove (beginMove + board.currentArrangement[beginMove] % board.currentArrangement.length);
    updateBoard(beginMove);
    updateScore();
    updateDisplay();
    checkGameOver();
    if (!board.gameOver){
        switchTurn();
        setPlayableSpace();
        test(beginMove);
    }
}

function calculateMove (startSpot){
    let boardToCalculate = board.currentArrangement;
    for (i = startSpot + 1; (i <= startSpot + boardToCalculate[startSpot]); i++){
        if (boardToCalculate[i] === undefined){
            boardToCalculate[i % boardToCalculate.length] += 1;
        }
        else{
            boardToCalculate[i] += 1;
        }
    }
    board.currentArrangement = boardToCalculate;
}

function checkMove(landingSpot){
    let boardToCheck = board.currentArrangement;
    let currentPlayer = board.currentTurn;
    if (landingSpot === currentPlayer.winSpace){
        switchTurn();
    }
    else if (boardToCheck[landingSpot] === 1){
        if ((currentPlayer === player1) && landingSpot < 6){
            boardToCheck[currentPlayer.winSpace] += boardToCheck[12 - landingSpot];
            boardToCheck[12 - landingSpot] = 0;
        }
        else if ((currentPlayer === player2) && landingSpot > 6){
            boardToCheck[currentPlayer.winSpace] += boardToCheck[12 - landingSpot];
            boardToCheck[12 - landingSpot] = 0;
        }
    }
    board.currentArrangement = boardToCheck;
}

function updateBoard(startSpot){
    board.currentArrangement[startSpot] = 0;
    player1.playableSpaces = board.currentArrangement.slice(0, 6);
    player2.playableSpaces = board.currentArrangement.slice(7, 13);
}

function updateScore(){
    player1.score = board.currentArrangement[6];
    player2.score = board.currentArrangement[13];
    document.getElementById("score-display1").innerHTML = player1.score;
    document.getElementById("score-display2").innerHTML = player2.score;
}

function updateDisplay(){
    for (i = 0; i < board.currentArrangement.length; i++){
        document.getElementsByClassName("pit")[i].innerHTML = "";
        for (j = 0; j < board.currentArrangement[i]; j++){
            let stone = document.createElement("div");
            stone.className = "stone";
            document.getElementsByClassName("pit")[i].appendChild(stone);
            if (board.currentArrangement[i] > 16 && document.getElementsByClassName("pit")[i].id !== "player1-winspace" && document.getElementsByClassName("pit")[i].id !== "player2-winspace"){
                document.getElementsByClassName("pit")[i].innerHTML = " x" + board.currentArrangement[i];
                document.getElementsByClassName("pit")[i].prepend(stone);
            }
        }
    }
}

function checkTurn(){
    switch (true){
        case player1.isTurn:
            return player1;
        case player2.isTurn:
            return player2;
    }
}

function switchTurn(){
    player1.isTurn = !player1.isTurn;
    player2.isTurn = !player2.isTurn;
    board.currentTurn = checkTurn();
    document.getElementById("current-turn").innerHTML = board.currentTurn.name + "'s turn";
}

function setPlayableSpace(){
    if (board.currentTurn === player1){
        for (i = 0; i < 6; i++){
            if (pitArray[i].children.length !== 0){
                pitArray[i].addEventListener("click", move);
                pitArray[i].id = "active";

            }
            else{
                pitArray[i].removeEventListener("click", move);
                pitArray[i].id = "";
            }
        }
        for (i = 7; i < 13; i++){
            pitArray[i].removeEventListener("click", move);
            pitArray[i].id = "";
        }
    }
    else if (board.currentTurn === player2){
        for (i = 7; i < 13; i++){
            if (pitArray[i].children.length !== 0){
                pitArray[i].addEventListener("click", move);
                pitArray[i].id = "active";
            }
            else{
                pitArray[i].removeEventListener("click", move);
                pitArray[i].id = "";
            }
        }
        for (i = 0; i < 6; i++){
            pitArray[i].removeEventListener("click", move);
            pitArray[i].id = "";
        }
    }
}

function checkGameOver(){
    let checkArray1 = [];
    let checkArray2 = [];
    for (i = 0; i < 6; i++){
        if (board.currentArrangement[i] === 0){
            checkArray1.push(board.currentArrangement[i]);
        }
    }
    for (i = 7; i < 13; i++){
        if (board.currentArrangement[i] === 0){
            checkArray2.push(board.currentArrangement[i]);
        }
    }
    if (checkArray1.length === 6 || checkArray2.length === 6){
        board.gameOver = true;
        console.log("Game Over!")
        let turnScreen = document.getElementsByClassName("turn-display")[0];
        turnScreen.remove();
        let winScreen = document.createElement("section");
        winScreen.id = "win-screen";
        winScreen.innerHTML = declareWinner();
        document.getElementsByTagName("main")[0].appendChild(winScreen);
        for (i = 0; i < pitArray.length; i++){
            if (pitArray[i].id === "active"){
                pitArray[i].id = "";
            }
        }
    }
}

function declareWinner(){
    let winner = '';
    if (board.currentArrangement[6] > board.currentArrangement[13]){
        winner = "Player 1 Wins!";
    }
    else if (board.currentArrangement[6] < board.currentArrangement[13]){
        winner = "Player 2 Wins!";
    }
    else if (board.currentArrangement[6] === board.currentArrangement[13]){
        winner = "It's a tie!";
    }
    console.log(winner)
    return winner;
}

let n = 0;

function resetGame(){ 
    if (board.gameOver){
        board.gameOver = false;
        board.currentTurn = player1;
        let newBoard = document.createElement("section");
        newBoard.className = "turn-display";
        let newBoardText = document.createElement("span");
        newBoardText.id = "current-turn";
        document.getElementsByTagName("main")[0].appendChild(newBoard);
        document.getElementsByClassName("turn-display")[0].appendChild(newBoardText);
        newBoardText.innerHTML = board.currentTurn.name + "'s turn";
        document.getElementById("win-screen").remove();
    }
    for (i = 0; i < board.currentArrangement.length; i++){
        board.currentArrangement[i] = board.startArrangement[i];
    }
    player1.isTurn = true;
    player2.isTurn = false;
    board.currentTurn = checkTurn();
    updateScore();
    updateDisplay();
    document.getElementById("current-turn").innerHTML = board.currentTurn.name + "'s turn";
    setPlayableSpace();
    n = 0;
    console.log("Game reset!")
}

function test(startSpot){  
    n += 1;
    console.log("Pit number " + startSpot + " was selected")
    console.log("The board after " + n + " move(s) is " + board.currentArrangement)
    console.log("Player 1's score is " + player1.score)
    console.log("Player 2's score is " + player2.score)
    console.log("Player 1's side looks like " + player1.playableSpaces)
    console.log("Player 2's side looks like " + player2.playableSpaces)
    console.log("It is " + board.currentTurn.name + "'s turn")
}