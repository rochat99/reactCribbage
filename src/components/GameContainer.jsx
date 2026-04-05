import React from "react";
import {useState} from "react";
import {createDeck, dealCards} from "../logic/makeShuffleDeck.js";
import PlayerSection from "./PlayerSection.jsx";

const GameContainer = () => {

    //create states to handle deck, players, crib, card selection and game phase
    const [deck, setDeck] = useState(createDeck);
    const [crib, setCrib] = useState([]);
    const [gamePhase, setGamePhase] = useState("dealing");
    const [cardSelect, setCardSelect] = useState([]);
    const [starterCard, setStarterCard] = useState(null);

    const [humanPlayer, setHumanPlayer] = useState({
        name: "You",
        score: 0,
        hand: [],
        crib: [],
        isDealer: true,
        isComputer: false
    });
    const [computerPlayer, setComputerPlayer] = useState({
        name: "Computer",
        score: 0,
        hand: [],
        crib: [],
        isDealer: false,
        isComputer: true
    });

    const handleDeal = () => {
        const deckCopy = [...deck];
        const newHumanHand = dealCards(deckCopy, 6);
        const newComputerHand = dealCards(deckCopy, 6);

        setDeck(deckCopy);
        setHumanPlayer({...humanPlayer, hand: newHumanHand});
        setComputerPlayer({...computerPlayer, hand: newComputerHand});
        setGamePhase("discard");
    }

    const handleCardSelect = (card) => {
    // check if card is already selected
    const isSelected = cardSelect.some(c => c.id === card.id);

    if (isSelected) {
        // remove it from the array
        setCardSelect(cardSelect.filter(c => c.id !== card.id));
    } else if (cardSelect.length < 2) {
        // only add it if fewer than 2 cards are selected
        setCardSelect([...cardSelect, card]);
    }
    // if 2 already selected and card isn't one of them, do nothing
    }

    const handleDiscard = () => {

        setHumanPlayer({...humanPlayer, hand: humanPlayer.hand.filter(card => !cardSelect.some(c => c.id === card.id))});

        //randomly select 2 cards from computer's hand
        const hand = computerPlayer.hand;
        const firstIndex = Math.floor(Math.random() * hand.length);
        const firstCard = hand[firstIndex];

        const remainingHand = hand.filter(c => c.id !== firstCard.id);

        const secondIndex = Math.floor(Math.random() * remainingHand.length);
        const secondCard = remainingHand[secondIndex];

        setComputerPlayer({...computerPlayer, hand: remainingHand.filter(c => c.id !== secondCard.id)})

        setCrib([...cardSelect, firstCard, secondCard]);
        setCardSelect([]);

        setGamePhase("pegging")
    }

    return (
        <div>
            <PlayerSection player={computerPlayer} cribHand={crib}/>

            <PlayerSection player={humanPlayer} cribHand={crib} onCardSelect={handleCardSelect} selectedCards={cardSelect} />

            {gamePhase === "dealing" && <button onClick={handleDeal}>Deal Cards</button>}

            {gamePhase === "discard" && <button onClick={handleDiscard} disabled={cardSelect.length < 2}>Discard Into Crib</button>}
        </div>
    );
};

export default GameContainer;

