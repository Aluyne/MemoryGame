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
];

let cardDeckCopy;
let clickedCards = [];
let compareDeck = [];

// mélange et selection d'un nombre de carte en focntion de la difficulté

let numCards = 6;

const randomCards = (num) => {
    const shuffleDeck = cardDeck.sort(() => Math.random() - 0.5);
    return shuffleDeck.slice(0, num);
};
console.log(randomCards(6));

// Game

const playGame = () => {
    gameBoard.style.display = "flex";
    cardDeckCopy = randomCards(numCards);
    // console.log(cardDeck);
    // console.log(cardDeckCopy);
    cardDeckCopy.push(...cardDeckCopy);
    cardDeckCopy.sort(() => Math.random() - 0.5);

    cardDeckCopy.forEach((card) => {
        const cardOnBoard = document.createElement("div");
        cardOnBoard.className =
            "w-16 sm:w-28 h-24 sm:h-44 bg-cover bg-center rounded-lg";
        cardOnBoard.style.backgroundImage = `url(media/img/${cardBack}`;
        cardOnBoard.setAttribute("data-face", card);
        gameBoard.appendChild(cardOnBoard);

        cardOnBoard.addEventListener("click", () => {
            if (clickedCards.length < 2) {
                if (cardOnBoard.style.backgroundImage.includes(cardBack)) {
                    cardOnBoard.style.backgroundImage = `url(media/img/${card})`;
                    clickedCards.push(cardOnBoard);
                    // console.log(clickedCards);
                } else {
                    console.log("La carte est déjà retournée.");
                }

                if (clickedCards.length === 2) {
                    let card1 = clickedCards[0];
                    let card2 = clickedCards[1];
                    // console.log(card1, card2);
                    if (
                        card1.getAttribute("data-face") ===
                        card2.getAttribute("data-face")
                    ) {
                        correct.play()
                        compareDeck.push(card1.getAttribute("data-face"));
                        compareDeck.push(card2.getAttribute("data-face"));
                        console.log(compareDeck);
                        clickedCards = [];
                        // console.log(clickedCards);
                    } else {
                        setTimeout(() => {
                            card1.style.backgroundImage = `url(media/img/${cardBack}`;
                            card2.style.backgroundImage = `url(media/img/${cardBack}`;
                            clickedCards = [];
                            // console.log(clickedCards);
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
    clickBtn.play()
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
    clickBtn.play()
    endGame.style.display = "none";
    reset();
    playGame();
};

// fonction retour au menu

const backToMenu = () => {
    clickBtn.play()
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
    clickBtn.play()
    numCards = 6;
    diffcultyChoice(easyBtn);
});

mediumBtn.addEventListener("click", () => {
    clickBtn.play()
    numCards = 9;
    diffcultyChoice(mediumBtn);
});

hardBtn.addEventListener("click", () => {
    clickBtn.play()
    numCards = 12;
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

