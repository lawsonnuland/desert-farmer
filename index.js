const board = document.querySelector('.board');
let gameData = {
    plotArray: [],
    funds: 0,
    fertileTotal: 0,
    startingFertility: 1,
    level: 1,
    fertileSpeed: 1
}

//factory function for generating plot objects
const plot = (id) => {
    let fertile = false;
    let hasZai = false;
    let polluted = false;
    let golden = false;
    let color = [(255 - gameData.startingFertility), 255, 0];
    this.id = id;
    return {fertile, hasZai, color, id}
}

function generateBoard(tiles) { 
    gameData.plotArray = [];
    while(board.firstChild) {
        board.removeChild(board.firstChild);
    }

    board.style.gridTemplateColumns = `repeat(${Math.floor(Math.sqrt(tiles + 4))}, 1fr)`;

    for(let i=0; i<tiles; i++) {
        let newPlot = plot(i);
        gameData.plotArray.push(newPlot);
        let div = document.createElement('div');
        div.setAttribute('data-index', i);
        div.classList.add('tile');
        div.classList.add('dry');
        div.style.background = `rgb(${255-gameData.startingFertility}, 255, 0)`;
        board.appendChild(div);
    }

    let allTiles = document.querySelectorAll('.tile');
    allTiles.forEach(tile => {
        tile.addEventListener('click', () => {
            if (tile.classList.contains('dry') && !tile.firstChild) {
                tile.classList.add('haszai');
                gameData.plotArray[tile.getAttribute('data-index')].hasZai = true;
                let zai = document.createElement('div');
                zai.classList.add('zai');
                tile.appendChild(zai);
            }
        })
    });

    console.log(gameData.plotArray);
    return gameData.plotArray;
}

function progressTile() {
    const zaiTiles = document.querySelectorAll('.haszai');
    const fertileDisplay = document.querySelector('.fertile');
    zaiTiles.forEach(tile => {
        if (gameData.plotArray[tile.getAttribute('data-index')].color[0] >= 0) {
            gameData.plotArray[tile.getAttribute('data-index')].color[0] = gameData.plotArray[tile.getAttribute('data-index')].color[0] - gameData.fertileSpeed;
            tile.style.background = `rgb(${gameData.plotArray[tile.getAttribute('data-index')].color[0]},${gameData.plotArray[tile.getAttribute('data-index')].color[1]},${gameData.plotArray[tile.getAttribute('data-index')].color[2]})`;
        } else { 
            tile.removeChild(tile.firstChild);
            tile.classList.remove('haszai');
            tile.classList.remove('dry');
            gameData.fertileTotal++;
            fertileDisplay.textContent= `: ${gameData.fertileTotal} square meters`;
            tile.innerHTML = `<img class="sprout" src="img/sprout-svgrepo-com.svg" alt="Sprouted!">`;
        }
    })
}

function increment() {
    const fundsDisplay = document.querySelector('.funds');
    gameData.funds += gameData.fertileTotal/100;
    fundsDisplay.textContent= `: $${Math.floor(gameData.funds)}`;
}

function buttonManager() {
    const newPlot = document.querySelector('.newplot');
    const morePlots = document.querySelector('.moreplots');
    const startingUpgrade = document.querySelector('.startupgrade');
    const speed = document.querySelector('.speed');
    newPlot.textContent = `Buy new plot of land: $${(gameData.level*4)**2}`;
    morePlots.textContent = `Increase maximum plots: $${gameData.level*200}`;
    startingUpgrade.textContent = `Buy fertilizer: $${(gameData.fertileTotal+20)*gameData.startingFertility*4}`;
    speed.textContent = `Seed clouds: $${(gameData.fertileSpeed**2)*100}`;

    return {newPlot, morePlots, startingUpgrade, speed}
}



window.addEventListener('load', () => {
    let savegame = JSON.parse(localStorage.getItem("desertSave"));

    if (savegame !== null) {
        gameData = savegame;
    }

    const resetButton = document.querySelector('.reset');
    const newPlot = document.querySelector('.newplot');
    const morePlots = document.querySelector('.moreplots');
    const startingUpgrade = document.querySelector('.startupgrade');
    const speed = document.querySelector('.speed');
    const fertileDisplay = document.querySelector('.fertile');
    newPlot.addEventListener('click', () => {
        if(gameData.funds >= (gameData.level*4)**2) {
            generateBoard((gameData.level + 1)**2);
            gameData.funds -= (gameData.level*4)**2;
        }
    })

    morePlots.addEventListener('click', () => {
        if(gameData.funds >= gameData.level*200) {
            gameData.funds -= gameData.level*200;
            gameData.level++;
            generateBoard((gameData.level + 1)**2);
        }
    })

    startingUpgrade.addEventListener('click', ()=> {
        if(gameData.funds >= (gameData.fertileTotal+20*gameData.startingFertility)*4) {
            gameData.funds -= (gameData.fertileTotal+20*gameData.startingFertility)*4;
            gameData.startingFertility *=2;
        }
    })

    speed.addEventListener('click', () =>{
        if(gameData.funds >= (gameData.fertileSpeed**2)*100) {
            gameData.funds -= (gameData.fertileSpeed**2)*100;
            gameData.fertileSpeed += 1;
        }
    })

    resetButton.addEventListener('click', ()=> {
        gameData = {
            plotArray: [],
            funds: 0,
            fertileTotal: 0,
            startingFertility: 1,
            level: 1,
            fertileSpeed: 1
        }
        fertileDisplay.textContent= `: ${gameData.fertileTotal} square meters`;
        generateBoard(Math.pow(gameData.level + 1, 2));
    })

    buttonManager();
    fertileDisplay.textContent= `: ${gameData.fertileTotal} square meters`;
    generateBoard(Math.pow(gameData.level + 1, 2));
})

let gameUpdate = window.setInterval(function() {
    progressTile();
    increment();
    buttonManager();
}, 100)

let saveGameLoop = window.setInterval(function() {
  localStorage.setItem("desertSave", JSON.stringify(gameData));
}, 15000)