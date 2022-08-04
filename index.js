const board = document.querySelector('.board');
let plotArray;
let funds = 0;
let fertileTotal = 0;

//factory function for generating plot objects
const plot = (id) => {
    let fertile = false;
    let hasZai = false;
    let color = [255, 255, 0];
    this.id = id;

    return {fertile, hasZai, color, id}
}

function generateBoard(tiles) {
    plotArray = [];
    while(board.firstChild) {
        board.removeChild(board.firstChild);
    }

    board.style.gridTemplateColumns = `repeat(${Math.floor(Math.sqrt(tiles + 4))}, 1fr)`;

    for(let i=0; i<tiles; i++) {
        let newPlot = plot(i);
        plotArray.push(newPlot);
        let div = document.createElement('div');
        div.setAttribute('data-index', i);
        div.classList.add('tile');
        div.classList.add('dry');
        board.appendChild(div);
    }

    let allTiles = document.querySelectorAll('.tile');
    allTiles.forEach(tile => {
        tile.addEventListener('click', () => {
            if (tile.classList.contains('dry') && !tile.firstChild) {
                tile.classList.add('haszai');
                plotArray[tile.getAttribute('data-index')].hasZai = true;
                let zai = document.createElement('div');
                zai.classList.add('zai');
                tile.appendChild(zai);
            }
        })
    });

    console.log(plotArray);
    return plotArray;
}

function progressTile() {
    const zaiTiles = document.querySelectorAll('.haszai');
    const fertileDisplay = document.querySelector('.fertile');
    zaiTiles.forEach(tile => {
        if (plotArray[tile.getAttribute('data-index')].color[0] >= 0) {
            plotArray[tile.getAttribute('data-index')].color[0] = plotArray[tile.getAttribute('data-index')].color[0] - 10;
            tile.style.background = `rgb(${plotArray[tile.getAttribute('data-index')].color[0]},${plotArray[tile.getAttribute('data-index')].color[1]},${plotArray[tile.getAttribute('data-index')].color[2]})`
        } else { 
            tile.removeChild(tile.firstChild);
            tile.classList.remove('haszai');
            tile.classList.remove('dry');
            fertileTotal++;
            fertileDisplay.textContent= `: ${fertileTotal} square meters`;
        }
    })
}

function increment() {
    const fundsDisplay = document.querySelector('.funds');
    funds += fertileTotal;
    fundsDisplay.textContent= `: $${funds}`;
}

window.addEventListener('load', () => {
    generateBoard(4);
})

let gameUpdate = window.setInterval(function() {
    progressTile();
    //console.log(plotArray);
    increment();
}, 1000)
//TODO  funds