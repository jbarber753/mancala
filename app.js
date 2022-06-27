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

//html stuff below

document.getElementById("score-display1").innerHTML = player1.score;
document.getElementById("score-display2").innerHTML = player2.score;
document.getElementById("current-turn").innerHTML = board.currentTurn.name + "'s turn";
for (i = 0; i < document.getElementsByClassName("pit").length; i++){
    document.getElementsByClassName("pit")[i].addEventListener("click", move);
}
document.getElementsByClassName("pit")[6].removeEventListener("click", move);
document.getElementsByClassName("pit")[13].removeEventListener("click", move);


//functions below

function move(beginMove){
    calculateMove(beginMove);
    checkMove (beginMove + board.currentArrangement[beginMove] % board.currentArrangement.length);
    updateBoard(beginMove);
    updateScore();
    switchTurn();
    test();
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
    for (i = 0; i < board.currentArrangement.length; i++){
        if (document.getElementsByClassName("pit")[i].children.length < board.currentArrangement[i]){
            let x = board.currentArrangement[i] - document.getElementsByClassName("pit")[i].children.length;
            while (x > 0){
                document.getElementsByClassName("pit")[i].appendChild(document.createElement("div")).className = "stone";
            }
            console.log("if while is running")
        }
        else if (document.getElementsByClassName("pit")[i].children.length > board.currentArrangement[i]){
            let x = document.getElementsByClassName("pit")[i].children.length - board.currentArrangement[i];
            while (x > 0){
                let pitDecrease = document.getElementsByClassName("pit")[i];
                if (pitDecrease.hasChildNodes){
                    pitDecrease.removeChild(pitDecrease.children[0]);
                }
                console.log("else if while is running")
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

function updateBoard(startSpot){
    board.currentArrangement[startSpot] = 0;
    player1.playableSpaces = board.currentArrangement.slice(0, 6);
    player2.playableSpaces = board.currentArrangement.slice(7, 13);
}

function updateScore(){
    player1.score = board.currentArrangement[6];
    player2.score = board.currentArrangement[13];
}

function resetGame(){
    board.currentArrangement = board.startArrangement;
}


//Console logging below

function test(){  
    let n = 0;
    n += 1;
    console.log("The board after " + n + " move(s) is " + board.currentArrangement)
    console.log("Player 1's score is " + player1.score)
    console.log("Player 2's score is " + player2.score)
    console.log("Player 1's side looks like " + player1.playableSpaces)
    console.log("Player 2's side looks like " + player2.playableSpaces)
    console.log("It is " + board.currentTurn.name + "'s turn")
}


// console.log("The board at the beginning of the game is " + board.currentArrangement)
// console.log("It is " + board.currentTurn.name + "'s turn")

// move(1)
// move(9)