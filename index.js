let numPlayers;
let numImpostors;
let playerNames = [];
let impostorIndexes = [];
let cards = [];
let impostors = [];
let currentPlayerIndex = 0;
let chosenCardIndex = null;
let gameStarted = false;

function setupPlayers() {
  numPlayers = parseInt(document.getElementById('num-players').value);
  if (isNaN(numPlayers) || numPlayers < 3) {
    alert('O jogo requer no mínimo 3 jogadores.');
    return;
  }
  document.getElementById('player-input').style.display = 'none';
  const playerNamesDiv = document.getElementById('player-names');
  playerNamesDiv.innerHTML = '';
  for (let i = 0; i < numPlayers; i++) {
    playerNamesDiv.innerHTML += `<input type="text" placeholder="Nome do jogador ${
      i + 1
    }" id="player-${i}" required><br>`;
  }
  document.getElementById('impostor-input').style.display = 'block';
}

function setupImpostores() {
  numImpostors = parseInt(document.getElementById('num-impostors').value);
  if (isNaN(numImpostors) || numImpostors < 1) {
    alert('O jogo requer no mínimo 1 impostor.');
    return;
  }
  if (numImpostors >= numPlayers) {
    alert('O número de impostores tem de ser inferior ao número de jogadores.');
    return;
  }
  if (numImpostors + 1 >= numPlayers) {
    alert(
      'Tem de haver uma diferença de pelo menos 2 jogadores a mais do que os impostores.'
    );
    return;
  }
  document.getElementById('impostor-input').style.display = 'none';
  document.getElementById('game-setup').style.display = 'block';
}

function startGame(firstStart = true) {
  if (firstStart) {
    playerNames = [];
    for (let i = 0; i < numPlayers; i++) {
      const playerName = document.getElementById(`player-${i}`).value;
      if (playerName.trim() === '') {
        alert('Todos os nomes de jogadores devem ser preenchidos.');
        return;
      }
      playerNames.push(playerName);
    }
  } else {
    // reset game
    document.getElementById('start-message').style.display = 'none';
    document.getElementById('final-message').style.display = 'none';
    currentPlayerIndex = 0;
    chosenCardIndex = null;
    gameStarted = false;
    impostorIndexes = [];
    impostors = [];
  }

  // Escolhe uma palavra comum aleatória do arquivo words.js
  const words = getCommonWords();
  if (words.length === 0) {
    alert('O arquivo de palavras não contém palavras válidas.');
    return;
  }

  const randomIndex = Math.floor(Math.random() * words.length);
  const commonObjectWord = words[randomIndex];

  // Gerar index diferentes para cada impostor
  for (var i = 0; i < numImpostors; i++) {
    let included = true;
    while (included) {
      const impostorIndex = Math.floor(Math.random() * numPlayers);
      if (!impostorIndexes.includes(impostorIndex)) {
        impostorIndexes.push(impostorIndex);
        included = false;
      } else {
        included = true;
      }
    }
  }

  // Define as cartas para cada jogador
  cards = Array(numPlayers).fill(commonObjectWord);
  for (var i = 0; i < impostorIndexes.length; i++) {
    cards[impostorIndexes[i]] = 'Impostor';
  }
  cards = shuffleArray(cards);
  console.log(cards);
  document.getElementById('game-setup').style.display = 'none';
  document.getElementById('turn-info').style.display = 'block';
  gameStarted = true;
  updateCurrentPlayer();
  renderCards();
}

function renderCards() {
  const cardsDiv = document.getElementById('cards');
  cardsDiv.innerHTML = '';
  cards.forEach((card, index) => {
    if (index === chosenCardIndex) return; // Não renderizar carta escolhida
    const disabledClass = chosenCardIndex !== null ? 'disabled' : '';
    cardsDiv.innerHTML += `<div class="card hidden ${disabledClass}" id="card-${index}" onclick="revealCard(${index}, this)">
        <div class="card-content">Carta ${index + 1}</div>
        </div>`;
  });
  document.getElementById('game-board').style.display = 'block';
}

function revealCard(index, element) {
  if (!gameStarted || chosenCardIndex !== null) return; // Jogo não começou ou carta já escolhida
  chosenCardIndex = index;
  element.innerHTML = `<div class="card-content">${cards[index]}</div>`;
  element.classList.remove('hidden');
  element.classList.add('disabled');
  document.getElementById('next-turn').style.display = 'block';

  // save impostor player index
  if (cards[index] === 'Impostor') {
    impostors.push(currentPlayerIndex);
  }
}

function updateCurrentPlayer() {
  document.getElementById(
    'current-player'
  ).innerText = `Vez de ${playerNames[currentPlayerIndex]}`;
}

function nextPlayer() {
  if (chosenCardIndex !== null) {
    // Remove a carta escolhida do jogo
    cards.splice(chosenCardIndex, 1);
    chosenCardIndex = null;
  }

  const revealedCards = document.querySelectorAll('.card:not(.hidden)');
  revealedCards.forEach((card) => (card.style.display = 'none')); // Ocultar a carta revelada
  document.getElementById('next-turn').style.display = 'none';

  if (currentPlayerIndex === numPlayers - 1) {
    document.getElementById('turn-info').style.display = 'none';
    document.getElementById('game-board').style.display = 'none';
    document.getElementById('start-message').style.display = 'block';
  } else {
    currentPlayerIndex = (currentPlayerIndex + 1) % numPlayers;
    updateCurrentPlayer();
    renderCards();
  }
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function showImpostor() {
  console.log(impostors);
  document.getElementById('start-message').style.display = 'none';
  const showImpostorDiv = document.getElementById('show-impostor');
  showImpostorDiv.innerHTML = '';

  for (var i = 0; i < impostors.length; i++) {
    const playerNameImpostor = playerNames[impostors[i]];
    showImpostorDiv.innerHTML += `<p>${playerNameImpostor}</p>`;
  }
  document.getElementById('final-message').style.display = 'block';
}
