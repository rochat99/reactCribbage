import React from "react";
import {useState, useEffect} from "react";

//import js logic
import {createDeck, dealCards} from "../logic/makeShuffleDeck.js";

//import components
import PlayerSection from "./PlayerSection.jsx";
import Deck from "./Deck.jsx"
import PlayArea from "./PlayArea.jsx"

const GameContainer = () => {

    //states
    const [deck, setDeck] = useState(createDeck);
    const [crib, setCrib] = useState([]);
    const [gamePhase, setGamePhase] = useState("dealing");
    const [cardSelect, setCardSelect] = useState([]);
    const [starterCard, setStarterCard] = useState(null);
    const [turn, setTurn] = useState("computer");
    const [tally, setTally] = useState(0);
    const [playArea, setPlayArea] = useState([]);
    const [currentRound, setCurrentRound] = useState(0);
    const [rounds, setRounds] = useState([[],[],[]]);

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

    //dealing cards
    const handleDeal = () => {
        const deckCopy = [...deck];
        const newHumanHand = dealCards(deckCopy, 6);
        const newComputerHand = dealCards(deckCopy, 6);

        setDeck(deckCopy);
        setHumanPlayer({...humanPlayer, hand: newHumanHand});
        setComputerPlayer({...computerPlayer, hand: newComputerHand});
        setGamePhase("discard");
    }

    //selecting cards
    const handleCardSelect = (card) => {
    // check if card is already selected
        const isSelected = cardSelect.some(c => c.id === card.id);

        if (gamePhase === "pegging" && cardSelect.length === 1 && !isSelected) {
            setCardSelect([card]);
            return;
        }

        if (isSelected) {
            setCardSelect(cardSelect.filter(c => c.id !== card.id));
        } else if (cardSelect.length < (gamePhase === "pegging" ? 1 : 2)) {
            setCardSelect([...cardSelect, card]);
        }
    }

    //discarding cards into crib
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

        //select random starter card
        const randomDeckIndex = Math.floor(Math.random() * deck.length);
        const randomStarterCard = deck[randomDeckIndex];
        setStarterCard(randomStarterCard);
        setDeck(deck.filter(c => c.id !== randomStarterCard.id));

        setGamePhase("pegging")
    }

    //putting cards into play area
    const handlePlayCard = () => {

        setHumanPlayer({...humanPlayer, hand: humanPlayer.hand.filter(card => !cardSelect.some(c => c.id === card.id))});

        setCardSelect([]);

        const newTally = tally + cardSelect[0].value;
        const newPlayArea = [...playArea, {...cardSelect[0], owner: "human"}];

        setTally(newTally);
        setPlayArea(newPlayArea);
        handleRounds(newTally, newPlayArea);
        setTurn("computer");
    }

    //computer auto play
    useEffect( () => {
        setTimeout(() => {
            if (turn === "computer" && gamePhase === "pegging") {
                const hand = computerPlayer.hand;
                const randomIndex = Math.floor(Math.random() * hand.length);
                const randomCard = hand[randomIndex];
                const remainingHand = hand.filter(c=> c.id !== randomCard.id);
                const newTally = tally + randomCard.value;
                const newPlayArea = [...playArea, {...randomCard, owner: "computer"}]

                setPlayArea(newPlayArea);
                setComputerPlayer({...computerPlayer, hand: remainingHand});
                setTally(newTally);
                setTurn("human");

                handleRounds(newTally, newPlayArea);
            }
        }, 1000)
    }, [turn, gamePhase]);

    const handleRounds = (newTally, newPlayArea) => {
        const noPlayableCards = humanPlayer.hand.every(card => card.value + newTally > 31) && computerPlayer.hand.every(card => card.value + newTally > 31);

        if (newTally === 31 || noPlayableCards) {
            setCurrentRound(currentRound + 1);
        } else {
            const newRounds = [...rounds];
            newRounds[currentRound] = [...newPlayArea];
            setRounds(newRounds);
        };
    }


    //JSX
    return (
        <div>
            <PlayerSection player={computerPlayer} cribHand={crib}/>

            <Deck deck={deck} starterCard={starterCard} />

            <PlayArea cards={playArea} tally={tally}/>

            <PlayerSection player={humanPlayer} cribHand={crib} onCardSelect={handleCardSelect} selectedCards={cardSelect} />

            {gamePhase === "dealing" && <button onClick={handleDeal}>Deal Cards</button>}
            {gamePhase === "discard" && <button onClick={handleDiscard} disabled={cardSelect.length < 2}>Discard Into Crib</button>}
            {gamePhase === "pegging" && <button onClick={handlePlayCard} disabled={cardSelect.length === 0}>Play Card</button>}
        </div>
    );
};

export default GameContainer;

