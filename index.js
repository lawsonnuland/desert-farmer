const board = document.querySelector('.board');

function generateBoard(tiles) {
    let greenTiles=0;
    while(board.firstChild) {
        board.removeChild(board.firstChild);
    }

    board.style.gridTemplateColumns = `repeat(${Math.floor(Math.sqrt(tiles + 4))}, 1fr)`;

    for(let i=0; i<tiles; i++) {
        let div = document.createElement('div');
        div.classList.add('tile');
        board.appendChild(div);
    }

    let allTiles = document.querySelectorAll('.tile');
    allTiles.forEach(tile => {
        tile.addEventListener('click', () => {
            if (tile.classList.contains('wet')) {
                tile.style.background = "green";
                greenTiles++;
                if(greenTiles == tiles) {
                    //alert("All green!");
                }
            } else {
                tile.style.background = "teal";
                tile.classList.add('wet');
            }
        })
    });
}

window.addEventListener('load', () => {
    generateBoard(4);
})

//TODO Add zai, funds, changing land over time