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
function hisHeels(starterCard) {};

//PEGGING CALCULATIONS
function peggingFifteenThirtyOne(tally) {};

function peggingSets(playArea) {};

function peggingRun(playArea) {};

function lastCard (playArea) {};

//COUNTING CALCULATIONS
function countingFifteen(hand, starterCard) {};

function countingSets(hand, starterCard) {};

function countingRun(hand, startCard) {};

function hisNobs(hand, starterCard) {};

function flush(hand) {};