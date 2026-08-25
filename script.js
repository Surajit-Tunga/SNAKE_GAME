const board = document.querySelector('.board');
const blockHeight = 30; // Height of each block in pixels
const blockWidth = 30; // Width of each block in pixels

const cols = Math.floor(board.clientWidth / blockWidth);
const rows = Math.floor(board.clientHeight / blockHeight);

const blocks = []

const snake = [
    {x:1, y:3},
    {x:1, y:4},
    {x:1, y:5}
]

for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
        const block = document.createElement('div'); // Create a new block element
        block.classList.add('block'); // Add the 'block' class to the element
        board.appendChild(block); // Append the block to the board
        // block.innerText = `${row},${col}`; // Set the text content of the block to its row and column indices
        blocks [`${row},${col}`] = block; // Store the block in the blocks array with a key based on its row and column   
    }
}

function renderSnake() {
    snake.forEach((block, index) => {
        const blockElement = blocks[`${block.x},${block.y}`];
        if (blockElement) {
            blockElement.classList.add('fill');
        }
    });
}

renderSnake();
