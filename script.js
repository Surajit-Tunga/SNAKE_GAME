const board = document.querySelector('.board');
const startBtn = document.querySelector('.start-btn');
const modal = document.querySelector('.modal');
const startGameModal = document.querySelector('.start-game');
const restartGameModal = document.querySelector('.restart-game');
const restartBtn = document.querySelector('.restart-btn');

const highScore = document.querySelector('#high-score');
const score = document.querySelector('#score');
const time = document.querySelector('#time');

const blockHeight = 30; // Height of each block in pixels
const blockWidth = 30; // Width of each block in pixels

const cols = Math.floor(board.clientWidth / blockWidth);
const rows = Math.floor(board.clientHeight / blockHeight);

const blocks = [];

let snake = [{x:1, y:3}];

let intervalId = null; // Variable to store the interval ID for the game loop
let timeIntervalId = null; // Variable to store the interval ID for the time counter
let direction = 'right'; // Initial direction of the snake
let food = {x:Math.floor(Math.random() * rows), y:Math.floor(Math.random() * cols)}; // Random initial position for the food

let scoreCount = 0; // Variable to keep track of the player's score
let highScoreCount = parseInt(localStorage.getItem('highScore')) || 0; // Variable to keep track of the highest score achieved
let timeCount = `00-00`; // Variable to keep track of the elapsed time in seconds

highScore.innerText = highScoreCount; // Display the highest score on the page

for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
        const block = document.createElement('div'); // Create a new block element
        block.classList.add('block'); // Add the 'block' class to the element
        board.appendChild(block); // Append the block to the board
        // block.innerText = `${row},${col}`; // Set the text content of the block to its row and column indices
        blocks [`${row},${col}`] = block; // Store the block in the blocks array with a key based on its row and column   
    }
}

function render() {

    let head = null;

    blocks[`${food.x},${food.y}`].classList.add('food'); // Add the 'food' class to the block at the food's position

    if (direction === 'left') {
        head = {x: snake[0].x, y: snake[0].y - 1}; // Move left by decreasing the y-coordinate
    } else if (direction === 'right') {
        head = {x: snake[0].x, y: snake[0].y + 1}; // Move right by increasing the y-coordinate
    } else if (direction === 'up') {
        head = {x: snake[0].x - 1, y: snake[0].y}; // Move up by decreasing the x-coordinate
    } else if (direction === 'down') {
        head = {x: snake[0].x + 1, y: snake[0].y}; // Move down by increasing the x-coordinate
    }

    if (head.x < 0 || head.x >= rows || head.y < 0 || head.y >= cols) {
         clearInterval(intervalId); // Stop the game loop
         modal.style.display = 'flex'; // Show the modal when the game is over
         startGameModal.style.display = 'none'; // Hide the start game modal
         restartGameModal.style.display = 'flex'; // Show the restart game modals
        return;

    }

    if (head.x === food.x && head.y === food.y) { 
        
        blocks[`${food.x},${food.y}`].classList.remove('food');
        food = {x:Math.floor(Math.random() * rows), y:Math.floor(Math.random() * cols)};
        snake.unshift(head); // Add the new head position to the beginning of the snake array without removing the last block, effectively growing the snake
        
        scoreCount++; // Increment the score when the snake eats the food
        score.innerText = scoreCount; // Update the score display
        //console.log('Score:', scoreCount); // Log the current score to the console

        if (scoreCount > highScoreCount) {
            highScoreCount = scoreCount;
            localStorage.setItem('highScore', highScoreCount.toString()); // Store the new high score in local storage
            highScore.innerText = highScoreCount; // Update the high score display
        }
    }

    snake.forEach((block, index) => {
        blocks[`${block.x},${block.y}`].classList.remove('fill'); // Remove the 'fill' class from the current block to clear the snake's previous position
    });

    snake.unshift(head); // Add the new head position to the beginning of the snake array
    snake.pop(); // Remove the last block of the snake to maintain its length
    
    snake.forEach((block, index) => {
        const blockElement = blocks[`${block.x},${block.y}`];
        if (blockElement) {
            blockElement.classList.add('fill');
        }
    }); 
}

startBtn.addEventListener('click', () => {
    modal.style.display = 'none'; // Hide the modal when the start button is clicked
    intervalId = setInterval ( () => {
        render();
    },300); // Start the game loop when the start button is clicked

    timeIntervalId = setInterval(() => {
        let [minutes, seconds] = timeCount.split('-').map(Number); //destructure the minutes and seconds from the timeCount string and convert them to numbers
        if (seconds == 59) {
            minutes++;
            seconds = 0;
        } else {
            seconds++;
        }
        timeCount = `${minutes.toString().padStart(2, '0')}-${seconds.toString().padStart(2, '0')}`;
        time.innerText = timeCount;
    }, 1000);
});

restartBtn.addEventListener('click', restartGame); // Call the restartGame function when the restart button is clicked

function restartGame() {

    blocks[`${food.x},${food.y}`].classList.remove('food'); // Remove the 'food' class from the block at the food's position

    snake.forEach((block, index) => {
        const blockElement = blocks[`${block.x},${block.y}`];
        if (blockElement) {
            blockElement.classList.remove('fill'); // Remove the 'fill' class from the current block to clear the snake's previous position
        }
    });

    scoreCount = 0; // Reset the score to 0 when the restart button is clicked
    score.innerText = scoreCount;

    timeCount = `00-00`; // Reset the time to 0 when the restart button is clicked
    time.innerText = timeCount;
    
    direction = 'right'; // Reset the direction to right when the restart button is clicked

    modal.style.display = 'none'; // Hide the modal when the restart button is clicked
    snake = [{x:1, y:3}]; // Reset the snake to its initial position
    food = {x:Math.floor(Math.random() * rows), y:Math.floor(Math.random() * cols)}; // Reset the food to a new random position
    intervalId = setInterval ( () => {
        render();
    },300); // Restart the game loop when the restart button is clicked


}


addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft' && direction !== 'right') {
        direction = 'left'; // Change direction to left if the left arrow key is pressed and the current direction is not right
    }
    if (event.key === 'ArrowRight' && direction !== 'left') {
        direction = 'right'; // Change direction to right if the right arrow key is pressed and the current direction is not left
    }
    if (event.key === 'ArrowUp' && direction !== 'down') {
        direction = 'up'; // Change direction to up if the up arrow key is pressed and the current direction is not down
    }
    if (event.key === 'ArrowDown' && direction !== 'up') {
        direction = 'down'; // Change direction to down if the down arrow key is pressed and the current direction is not up
    }
});

