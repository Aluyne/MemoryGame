const body = document.querySelector("body");
const game = document.getElementById("game");
const startGame = document.getElementById("startGame");
const gameBoard = document.getElementById("gameBoard");
const endGame = document.getElementById("endGame");
const replayBtn = document.getElementById("replayBtn");
const backToStart = document.getElementById("backToStart");
const easyBtn = document.getElementById("easyBtn");
const mediumBtn = document.getElementById("mediumBtn");
const hardBtn = document.getElementById("hardBtn");
const moves = document.getElementById("moves");

// Les cartes

const cardBack = ["dos1.jpg"];
const cardDeck = [
    "guerrière.jpg",
    "magicien.jpg",
    "chevalier.jpg",
    "prêtresse.jpg",
    "sorcière.jpg",
    "archère.jpg",
    "alchimiste.jpg",
    "barde.jpg",
    "druide.jpg",
    "dwarf.jpg",
    "guerrière2.jpg",
    "voleuse.jpg",
    "guerrier-mage.jpg",
    "dompteuse.jpg",
    "illusionist.jpg",
];

let cardDeckCopy;
let clickedCards = [];
let compareDeck = [];
let nbrOfMoves = 0;

// mélange et selection d'un nombre de carte en focntion de la difficulté

let numCards = 6;

const randomCards = (num) => {
    const shuffleDeck = cardDeck.sort(() => Math.random() - 0.5);
    return shuffleDeck.slice(0, num);
};
console.log(randomCards(6));

// Game

const playGame = () => {
    gameBoard.style.display = "grid";
    gameBoard.className = adjustColumns();

    cardDeckCopy = randomCards(numCards);
    cardDeckCopy.push(...cardDeckCopy);
    cardDeckCopy.sort(() => Math.random() - 0.5);

    cardDeckCopy.forEach((card) => {
        const cardOnBoard = document.createElement("div");
        cardOnBoard.className =
            "w-16 h-24 md:w-24 md:h-40 bg-cover bg-center rounded-lg";
        cardOnBoard.style.backgroundImage = `url(media/img/${cardBack}`;
        cardOnBoard.setAttribute("data-face", card);
        gameBoard.appendChild(cardOnBoard);

        cardOnBoard.addEventListener("click", () => {
            if (clickedCards.length < 2) {
                console.log(nbrOfMoves);
                if (cardOnBoard.style.backgroundImage.includes(cardBack)) {
                    cardOnBoard.style.backgroundImage = `url(media/img/${card})`;
                    clickedCards.push(cardOnBoard);
                }
                if (clickedCards.length === 2) {
                    let card1 = clickedCards[0];
                    let card2 = clickedCards[1];
                    if (
                        card1.getAttribute("data-face") ===
                        card2.getAttribute("data-face")
                    ) {
                        correct.play();
                        compareDeck.push(card1.getAttribute("data-face"));
                        compareDeck.push(card2.getAttribute("data-face"));
                        nbrOfMoves++;
                        console.log(compareDeck);
                        clickedCards = [];
                    } else {
                        setTimeout(() => {
                            card1.style.backgroundImage = `url(media/img/${cardBack}`;
                            card2.style.backgroundImage = `url(media/img/${cardBack}`;
                            nbrOfMoves++;
                            clickedCards = [];
                        }, 1000);
                    }
                }
            }

            checkEnd();
        });
    });
};

// Lancer un Partie

startGame.addEventListener("click", () => {
    clickBtn.play();
    game.style.display = "none";
    playGame();
});

// Fin de partie

const checkEnd = () => {
    if (cardDeckCopy.length === compareDeck.length) {
        setTimeout(() => {
            victory.play();
            gameBoard.style.display = "none";
            endGame.style.display = "flex";

            let bestScore = getBestScore().find(
                (score) => score.difficulty === currentDifficulty()
            );

            if (bestScore && nbrOfMoves >= bestScore.moves) {
                moves.textContent = `${nbrOfMoves} tours joués`;
            } else {
                moves.textContent = `Nouveau meilleur score en ${nbrOfMoves} coups !`;
                updateBestScore(nbrOfMoves, currentDifficulty());
            }

            updateBestScore(nbrOfMoves, currentDifficulty());

            replayBtn.addEventListener("click", () => {
                replay();
            });

            backToStart.addEventListener("click", () => {
                backToMenu();
            });
        }, 2000);
    }
};

// fonction rejouer

const replay = () => {
    clickBtn.play();
    endGame.style.display = "none";
    reset();
    playGame();
};

// fonction retour au menu

const backToMenu = () => {
    clickBtn.play();
    endGame.style.display = "none";
    game.style.display = "flex";
    reset();
};

// fonction Reset

const reset = () => {
    gameBoard.innerHTML = "";
    console.log(gameBoard);
    clickedCards = [];
    compareDeck = [];
    cardDeckCopy = [];
    nbrOfMoves = 0;
    console.log(cardDeckCopy);
};

// Choix difficulté

const diffcultyChoice = (activeButton) => {
    [easyBtn, mediumBtn, hardBtn].forEach((button) => {
        button.classList.remove("bg-green-400");
        button.classList.add("bg-gray-300");
    });
    activeButton.classList.add("bg-green-400");
};

easyBtn.addEventListener("click", () => {
    clickBtn.play();
    numCards = 6;
    diffcultyChoice(easyBtn);
});

mediumBtn.addEventListener("click", () => {
    clickBtn.play();
    numCards = 10;
    diffcultyChoice(mediumBtn);
});

hardBtn.addEventListener("click", () => {
    clickBtn.play();
    numCards = 15;
    diffcultyChoice(hardBtn);
});

// Effets Sonore

const audioEffect = (effect) => {
    const audio = new Audio(`media/audio/${effect}`);
    return audio;
};

const clickBtn = audioEffect("click-menu.mp3");
const flipCard = audioEffect("flipcard.mp3");
const correct = audioEffect("correct.mp3");
const victory = audioEffect("goodresult.mp3");

// Sauvegarde - Mise a jour Score

const saveBestScore = (score) => {
    localStorage.setItem("bestScore", JSON.stringify(score));
};

const getBestScore = () => JSON.parse(localStorage.getItem("bestScore")) || [];

const currentDifficulty = () => {
    if (numCards === 6) return "Facile";
    if (numCards === 10) return "Moyen";
    if (numCards === 15) return "Difficile";
};

const updateBestScore = (nbrOfMoves, difficulty) => {
    let score = getBestScore();
    let bestScore = score.find((number) => number.difficulty === difficulty);

    if (!bestScore || nbrOfMoves < bestScore.moves) {
        if (bestScore) {
            bestScore.moves = nbrOfMoves;
        } else {
            score.push({ moves: nbrOfMoves, difficulty: difficulty });
        }
    }

    saveBestScore(score);
};

// Affichage du board

const adjustColumns = () => {
    if (numCards === 6) {
        return `grid-cols-4 bg-white bg-opacity-30 rounded-lg grid justify-center items-center gap-2 md:gap-4 p-2`;
    } else if (numCards === 10) {
        return `grid-cols-4 md:grid-cols-5 bg-white bg-opacity-30 rounded-lg grid justify-center items-center gap-2 md:gap-4 p-2`;
    } else if (numCards === 15) {
        return `grid-cols-5 md:grid-cols-6 bg-white bg-opacity-30 rounded-lg grid justify-center items-center gap-2 md:gap-4 p-2`;
    }
};
