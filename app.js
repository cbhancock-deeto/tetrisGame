document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid');
    var squares = Array.from(document.querySelectorAll('.grid div'));
    const scoreDisplay = document.querySelector('#scoreNumber');
    const startBtn = document.querySelector('#start-button');
    const row = 10;
    var score = 0;
    var timeIncrement = 600;
    var timer;
    const startingPosition = 4;
    const startingRotation = 1;
    var currentRotation;


    const itetromino = [
        [row, row + 1, row + 2, row + 3],
        [2, row + 2, 2 * row + 2, 3 * row + 2],
        [2 * row, 2 * row + 1, 2 * row + 2, 2 * row + 3],
        [1, row + 1, 2 * row + 1, 3 * row + 1]
    ];
    const jtetromino = [
        [0, row, row + 1, row + 2],
        [1, 2, row + 1, 2 * row + 1],
        [row, row + 1, row + 2, 2 * row + 2],
        [1, row + 1, row * 2, row * 2 + 1]
    ];
    const ltetromino = [
        [2, row, row + 1, row + 2],
        [1, row + 1, row * 2 + 1, row * 2 + 2],
        [row, row + 1, row + 2, row * 2],
        [0, 1, row + 1, 2 * row + 1]
    ];
    const otetromino = [
        [1, 2, row + 1, row + 2],
        [1, 2, row + 1, row + 2],
        [1, 2, row + 1, row + 2],
        [1, 2, row + 1, row + 2]
    ];
    const stetromino = [
        [1, 2, row, row + 1],
        [1, row + 1, row + 2, row * 2 + 2],
        [row + 1, row + 2, row * 2, row * 2 + 1],
        [0, row, row + 1, row * 2 + 1]
    ];
    const ttetromino = [
        [1, row, row + 1, row + 2],
        [1, row + 1, row + 2, row * 2 + 1],
        [row, row + 1, row + 2, 2 * row + 1],
        [1, row, row + 1, 2 * row + 1]
    ];
    const ztetromino = [
        [0, 1, row + 1, row + 2],
        [2, row + 1, row + 2, 2 * row + 1],
        [row, row + 1, row * 2 + 1, 2 * row + 2],
        [1, row, row + 1, 2 * row]
    ];
    const theTetrominoes = [
        itetromino,
        jtetromino,
        ltetromino,
        otetromino,
        stetromino,
        ttetromino,
        ztetromino
    ];


    var currentPosition = startingPosition;
    var currentRotation = startingRotation;

    // Randomly select a tetromino
    var randTetro = Math.floor(Math.random() * theTetrominoes.length);

    // Establishing first tetromino to show up on screen
    currentTetro = theTetrominoes[randTetro][startingRotation];
    draw();


        // add functionality to the button
        startBtn.addEventListener('click',()=>{
            if(timer){
                clearInterval(timer);
                timer = null;
            } else{
                draw();
                timer = setInterval(moveDown,1000);
            }
        })


    function control(e) {

        if (e.keyCode === 38) {
            rotateTetro();
        } else if (e.keyCode === 37) {
            moveLeft();
        } else if (e.keyCode === 39) {
            moveRight();
        } else if (e.keyCode === 40) {
            moveDown();
        }
    }

    document.addEventListener('keyup', control);


    function incrementScore(){
        console.log("inside increment score");
        score += 10;
        scoreDisplay.innerHTML = score;
    }
console.log(scoreDisplay);



    
    // check if any squares to the left are occupied
    // check if moving left would move off grid
    // adjust currentPosition -= 1 if both are false
    function moveLeft() {
        //evaluate if it's on left edge first
        // it is true if it is at the left edge
        const atLeftEdge = currentTetro.some(index => (currentPosition + index) % row === 0);
        if (!atLeftEdge) {
            if (!currentTetro.some(index => squares[currentPosition + index - 1].classList.contains("occupied"))) {
                undraw();
                currentPosition -= 1;
                draw();
            }
        }
    }

    function moveRight() {
        const atRightEdge = currentTetro.some(index => (currentPosition + index) % row === 9);
        if (!atRightEdge) {
            if (!currentTetro.some(index => squares[currentPosition + index + 1].classList.contains("occupied"))) {
                undraw();
                currentPosition += 1;
                draw();
            }
        }
    }

    function moveDown() {
        undraw();
        currentPosition += row;
        draw();

        
        evaluate();

    }

    function evaluate(){

        // check if the next tetromino position is occupied
        // if it is, lock the tetromino and begin next tetromino falling
        if (evaluateNextSquares()) {
            setCurrentToOccupied();
            nextTetromino();
        }
        evaluateRows();
    }

    function evaluateRows(){
        // start from top
        // check to see if squares 0-9, 10-19, 20-29, 30-39, 40-49, 50-59, 60-69, 70-79, 80-89, 90-99, etc.
        // have consecutive squares with the class "occupied"
        // if they do, remove them and slide all occupied squares down
        for(let i = 0; i<199; i+= row){
            const checkRow = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9];

            if( checkRow.every(index => squares[index].classList.contains('occupied'))){
                incrementScore();
                checkRow.forEach(index => {
                    squares[index].classList.remove('occupied');
                    squares[index].classList.remove('tetromino');

                })
                const squaresRemoved = squares.splice(i,row);
                squares = squaresRemoved.concat(squares);
                squares.forEach(cell => grid.appendChild(cell));
            }
        }

    }


    function rotateTetro() {
        currentRotation++;
        currentRotation = currentRotation % 4;
        undraw();
        currentTetro = theTetrominoes[randTetro][currentRotation];
        draw();
    }

    function evaluateNextSquares() {
        if (currentTetro.some(index => squares[currentPosition + index + row].classList.contains('occupied'))) { return true; }
        else { return false; }
    }

    // begins new tetromino
    function nextTetromino() {
        // Randomly select a tetromino
        randTetro = Math.floor(Math.random() * theTetrominoes.length);

        // Establishing first tetromino to show up on screen
        currentTetro = theTetrominoes[randTetro][startingRotation];
        currentPosition = startingPosition;
    }

    // adds class occupied to current tetromino
    function setCurrentToOccupied() {
        currentTetro.forEach(index => squares[currentPosition + index].classList.add('occupied'));
    }

    function draw() {
        currentTetro.forEach(index => {
            squares[currentPosition + index].classList.add('tetromino');
        })
    }

    function undraw() {
        currentTetro.forEach(index => {
            squares[currentPosition + index].classList.remove('tetromino');
        })
    }


})