document.addEventListener('DOMContentLoaded', () => {

    const startBtn = document.getElementById('start-btn');
    const resetBtn = document.getElementById('reset-btn');
    const difficultySelect = document.getElementById('difficulty');
    const board = document.getElementById('game-board');
    const movesEl = document.getElementById('moves-count');
    const matchesEl = document.getElementById('matches-count');
    const bestEasyEl = document.getElementById('best-easy');
    const bestHardEl = document.getElementById('best-hard');
    const successMessage = document.getElementById('success-message');
    const finalStats = document.getElementById('final-stats');

    const EMOJIS = ['🍎','🚀','🎮','🎧','🏆','🐶','🌟','🎲','💡','🔥','⚽','🎵'];

    let gridCols = 4;
    let gridRows = 3;
    let totalCards = 12;
    let cards = [];
    let firstCard = null;
    let secondCard = null;
    let lockBoard = false;
    let moves = 0;
    let matches = 0;
    let gameStarted = false;

    const LS_KEY_EASY = 'memory_best_easy';
    const LS_KEY_HARD = 'memory_best_hard';

    function loadBest() {
        const be = localStorage.getItem(LS_KEY_EASY);
        const bh = localStorage.getItem(LS_KEY_HARD);
        bestEasyEl.textContent = be ? be + ' ėjimai' : '—';
        bestHardEl.textContent = bh ? bh + ' ėjimai' : '—';
    }

    loadBest();

    function setupGrid() {
        const diff = difficultySelect.value;
        if (diff === 'easy') {
            gridCols = 4; gridRows = 3; totalCards = 12;
        } else {
            gridCols = 6; gridRows = 4; totalCards = 24;
        }
        board.innerHTML = '';
        board.style.display = 'grid';
        board.style.gridTemplateColumns = `repeat(${gridCols}, 1fr)`;
        board.style.gridGap = '10px';
    }

    function buildDeck() {
        const pairs = totalCards / 2;
        const selected = EMOJIS.slice(0, pairs);
        let deck = [];
        selected.forEach(symbol => {
            deck.push({symbol, id: cryptoRandomId()});
            deck.push({symbol, id: cryptoRandomId()});
        });
        return shuffle(deck);
    }

    function renderBoard() {
        setupGrid();
        cards = buildDeck();
        cards.forEach(card => {
            const cardEl = document.createElement('button');
            cardEl.className = 'memory-card';
            cardEl.type = 'button';
            cardEl.setAttribute('data-symbol', card.symbol);
            cardEl.setAttribute('data-id', card.id);
            cardEl.style.height = '100px';
            cardEl.style.fontSize = '2rem';
            cardEl.style.borderRadius = '8px';
            cardEl.style.border = '1px solid #ccc';
            cardEl.style.background = '#f8f8f8';
            cardEl.style.display = 'flex';
            cardEl.style.alignItems = 'center';
            cardEl.style.justifyContent = 'center';

            cardEl.innerHTML = `
        <span class="card-front"></span>
        <span class="card-back" style="display:none">${card.symbol}</span>
      `;

            board.appendChild(cardEl);
            cardEl.addEventListener('click', () => onCardClick(cardEl));
        });
    }

    function onCardClick(cardEl) {
        if (!gameStarted) return;
        if (lockBoard) return;
        if (cardEl.classList.contains('matched')) return;
        if (cardEl === firstCard) return;

        flipCard(cardEl);

        if (!firstCard) {
            firstCard = cardEl;
            return;
        }

        secondCard = cardEl;
        lockBoard = true;
        moves++;
        updateStats();

        if (firstCard.dataset.symbol === secondCard.dataset.symbol) {
            firstCard.classList.add('matched');
            secondCard.classList.add('matched');
            matches++;
            resetTurn();
            updateStats();
            checkWin();
        } else {
            setTimeout(() => {
                unflipCard(firstCard);
                unflipCard(secondCard);
                resetTurn();
            }, 900);
        }
    }

    function flipCard(cardEl) {
        cardEl.querySelector('.card-front').style.display = 'none';
        cardEl.querySelector('.card-back').style.display = 'block';
    }

    function unflipCard(cardEl) {
        cardEl.querySelector('.card-front').style.display = 'block';
        cardEl.querySelector('.card-back').style.display = 'none';
    }

    function resetTurn() {
        [firstCard, secondCard] = [null, null];
        lockBoard = false;
    }

    function updateStats() {
        movesEl.textContent = moves;
        matchesEl.textContent = matches;
    }

    function checkWin() {
        const pairs = totalCards / 2;
        if (matches === pairs) {
            gameStarted = false;
            successMessage.style.display = 'block';
            finalStats.textContent = `${moves} ėjimai`;
            saveBest();
        }
    }

    function saveBest() {
        const key = difficultySelect.value === 'easy' ? LS_KEY_EASY : LS_KEY_HARD;
        const prev = parseInt(localStorage.getItem(key)) || Infinity;
        if (moves < prev) localStorage.setItem(key, moves);
        loadBest();
    }

    function resetGameState(startAfterReset=false) {
        board.innerHTML = '';
        firstCard = null;
        secondCard = null;
        lockBoard = false;
        moves = 0;
        matches = 0;
        gameStarted = false;

        updateStats();
        successMessage.style.display = 'none';

        renderBoard();

        if (startAfterReset) startGame();
    }

    function startGame() {
        if (gameStarted) return;
        gameStarted = true;
    }

    startBtn.addEventListener('click', () => resetGameState(true));
    resetBtn.addEventListener('click', () => resetGameState(true));
    difficultySelect.addEventListener('change', () => resetGameState(false));

    function shuffle(arr) {
        const a = arr.slice();
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }

    function cryptoRandomId() {
        if (crypto.randomUUID) return crypto.randomUUID();
        return Math.random().toString(36).substring(2, 10);
    }

    renderBoard();
});
