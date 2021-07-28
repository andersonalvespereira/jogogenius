let order = [];
let clickedOrder = [];
var score = 0;
let difficulty = 50;
let difficultyInc = 5;


// 0 - verde
// 1 - vermelho
// 2 - amarelo
// 3 - azul

const blue = document.querySelector('.blue');
const red = document.querySelector('.red');
const green = document.querySelector('.green');
const yellow = document.querySelector('.yellow');

// Cria a ordem de cores aleatorias.
let shuffleOrder = () => {
    let colorOrder = Math.floor(Math.random() * 4);
    order[order.length] = colorOrder;
    clickedOrder = [];

    for(let i in order) {
        let elementColor = createColorElement(order[i]);
        lightColor(elementColor, Number(i) + 1);
    }
}

// Acende a próxima cor
let lightColor = (element, number) => {
    
    number = number * 1200;
    setTimeout(() => {
        element.classList.add('selected');
    }, number - 500);
    setTimeout(() => {
        element.classList.remove('selected');
    }, number - difficulty);
    difficulty =+ difficultyInc;
}

// Comparar se as cores foram selecionadas na mesma ordem que apareceram no jogo.
let checkOrder = () => {
    for(let i in clickedOrder) {
        if (clickedOrder[i] != order[i]) {
            gameOver();
            break;
        }
    }
    if(clickedOrder.length == order.length){
        alert(`Pontuação: ${score}\nVocê acertou! Clique em OK para iniciando próximo nível.`);
        nextLevel();
    }
}

// Função para o clique do usuario.
let click = (color) =>  {
    clickedOrder[clickedOrder.length] = color;
    createColorElement(color).classList.add('selected');

    setTimeout(() => {
        createColorElement(color).classList.remove('selected');
        checkOrder();
    },250);
}

// Função que retorna a cor
let createColorElement = (color) => {
    if(color == 0) {
        return green;
    } else if(color == 1) {
        return red;
    } else if(color == 2) {
        return yellow;
    } else if(color == 3) {
        return blue;
    }
}

// Função para o próximo nivel do jogo.
let nextLevel = () => {
    score++;
    shuffleOrder();
}

// Função para game over.
let gameOver = () => {
    alert(`Pontuação: ${score}!\nVocê perdeu o jogo!\nClique em OK para iniciar um novo jogo`);
    order = [];
    clickedOrder = [];

    
    playGame();
   
}

// Função de inicio de jogo.
let playGame = () => {
    alert('Bem vindo ao Gênisis! Clique em OK para iniciar o jogo!');
    score = 0;
    difficulty = 50
    nextLevel();
}


// Eventos de cliques para  as cores.
green.onclick = () => click(0);
red.onclick = () => click(1);
yellow.onclick = () => click(2);
blue.onclick = () => click(3);

// Inicio do jogo.
playGame();