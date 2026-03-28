function createDeck() {

    //create arrays to hold deck, ranks and suits 
    const deck = [];
    const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    const suits = ['spades', 'hearts', 'clubs', 'diamonds'];

    //push object into deck where object holds card rank, suit, value, order and id
    for (let s of suits) {
        for (let r of ranks) {

            let cardValue;

            //define card point value
            if (['J', 'Q', 'K'].includes(r)) {
                cardValue = 10;
            } else if (r === 'A') {
                cardValue = 1;
            } else {
                cardValue = parseInt(r);
            };

            //define order number to identify runs
            let cardOrder = ranks.indexOf(r) + 1;

            //create card object and push into deck

            deck.push({
                rank: r,
                suit: s,
                id: r + s,
                value: cardValue,
                order: cardorder
            });
        };
    };

    return deck;

}

//shuffle deck using Fisher-Yates method
function shuffleDeck(deck) {

    for (let i = deck.length - 1; i > 0; i--) {
        
        const j = Math.floor(Math.random() * (i + 1));

        [deck[i], deck[j]] = [deck[j], deck[i]];
    };

    return deck;

};

export function dealCards(deck, count) {
    return deck.splice(0, count);
}