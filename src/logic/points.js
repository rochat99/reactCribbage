/*
15 = 2pts
31 = 2pts (only applicable in pegging phase)
pair = 2pts
triple = 6pts
double pair = 12pts
run = 1pt per card in run (minimum 3 cards, played cards don't need to be in order for a run to count (ex 3, 5, 4), cannot loop from Ace to King (ex. Ace, King, Queen is not a valid run))
his heels = 2pts (if revealed deck card is a Jack, points go to dealer)
his nobs = 1pts (if player has a Jack with the same suit as the revealed deck card)
"go" = 1pt (if player cannot play a card without going over 31. This player starts the new round in the pegging phase)
flush (all hand cards are of same suit + 1pt if starter card is of same suit) = 4pts + 1pt
*/

//HIS HEELS
function hisHeels(starterCard) {
    if (starterCard.rank === "J") {
        return 2
    };
    return 0;
};

//PEGGING CALCULATIONS
function peggingFifteenThirtyOne(newTally) {
    if (newTally === 15 || newTally === 31) {
        return 2
    };
    return 0;
};

function peggingSets(newPlayArea) {
    const lastRank = newPlayArea[newPlayArea.length - 1].rank;
    const pair = newPlayArea.slice(-2);
    const triple = newPlayArea.slice(-3);
    const doublePair = newPlayArea.slice(-4);

    if (doublePair.every(card => card.rank === lastRank)) {
        return 12;
    } else if (triple.every(card => card.rank === lastRank)) {
        return 6;
    } else if (pair.every(card => card.rank === lastRank)) {
        return 2;
    };
    return 0;
};

//helper function for peggingRun
function isRun(cards) {
    const sorted = [...cards].sort((a, b) => a.order - b.order);
    return sorted.every((card, i) => {
        if (i === 0) return true;
        return card.order === sorted[i-1].order + 1;
    });
}

function peggingRun(newPlayArea) {
    if (newPlayArea.length >= 7 && isRun(newPlayArea.slice(-7))) return 7;

    if (newPlayArea.length >= 6 && isRun(newPlayArea.slice(-6))) return 6;

    if (newPlayArea.length >= 5 && isRun(newPlayArea.slice(-5))) return 5;

    if (newPlayArea.length >= 4 && isRun(newPlayArea.slice(-4))) return 4;

    if (newPlayArea.length >= 3 && isRun(newPlayArea.slice(-3))) return 3;
    
    return 0;
};

function lastCard(newPlayArea, humanPlayer, computerPlayer, newTally) {
    const noPlayableCards = humanPlayer.hand.every(card => card.value + newTally > 31) && computerPlayer.hand.every(card => card.value + newTally > 31);
    
    if (noPlayableCards) {
        const lastCardPlayed = newPlayArea[newPlayArea.length - 1];
        if (lastCardPlayed.owner === "human") {
            return {winner: "human", points: 1};
        } else {
            return {winner: "computer", points: 1};
        }
    }
    
    return {winner: null, points: 0};
}

//COUNTING CALCULATIONS
function countingFifteen(hand, starterCard) {};

function countingSets(hand, starterCard) {};

function countingRun(hand, startCard) {};

function hisNobs(hand, starterCard) {};

function flush(hand) {};