const board = document.querySelector('.board');

function generateBoard() {
    board.textContent = "game pieces go here";
}

window.addEventListener('load', () => {
    generateBoard();
})