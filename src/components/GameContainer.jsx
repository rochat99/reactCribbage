import React from "react";
import {useState, useEffect} from "react";
import './GameContainer.css';

//import js logic
import {createDeck, dealCards} from "../logic/makeShuffleDeck.js";
import { peggingCalculation } from "../logic/points.js";

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
    const [goFirst, setGoFirst] = useState(null);

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
        const newHumanHand = humanPlayer.hand.filter(card => !cardSelect.some(c => c.id === card.id));
        
        setHumanPlayer({...humanPlayer, hand: newHumanHand});
        setCardSelect([]);

        const newTally = tally + cardSelect[0].value;
        const newPlayArea = [...playArea, {...cardSelect[0], owner: "human"}];

        setTally(newTally);
        setPlayArea(newPlayArea);
        handleRounds(newTally, newPlayArea, newHumanHand, computerPlayer.hand);
        applyPeggingPoints(newTally, newPlayArea, "human", newHumanHand, computerPlayer.hand);
        setTurn("computer");
    }

    //computer auto play
    useEffect(() => {
        setTimeout(() => {
            if (turn === "computer" && gamePhase === "pegging") {
                const hand = computerPlayer.hand;
                const playableCards = hand.filter(card => card.value + tally <= 31);
                
                if (playableCards.length === 0) {
                    if (goFirst === "computer" || goFirst === "human") {
                        setGoFirst(null);
                        // both said go, start new round, give go point, reset
                        setTurn(goFirst === "human" ? "human" : "computer");
                    } else {
                        setGoFirst("computer");
                        setTurn("human");
                    }
                    return;
                }

                const randomIndex = Math.floor(Math.random() * playableCards.length);
                const randomCard = playableCards[randomIndex];
                const remainingHand = hand.filter(c => c.id !== randomCard.id);
                const newTally = tally + randomCard.value;
                const newPlayArea = [...playArea, {...randomCard, owner: "computer"}];

                setPlayArea(newPlayArea);
                setComputerPlayer({...computerPlayer, hand: remainingHand});
                setTally(newTally);
                setTurn("human");

                handleRounds(newTally, newPlayArea, humanPlayer.hand, remainingHand);
                applyPeggingPoints(newTally, newPlayArea, "computer", humanPlayer.hand, remainingHand);
            }
        }, 1000)
    }, [turn, gamePhase]);

    //changing to new rounds in pegging phase
    const handleRounds = (newTally, newPlayArea, humanHand = humanPlayer.hand, computerHand = computerPlayer.hand) => {
        const noPlayableCards = humanHand.every(card => card.value + newTally > 31) && computerHand.every(card => card.value + newTally > 31);

        if (newTally === 31 || noPlayableCards) {
            // Save completed round before resetting
            const newRounds = [...rounds];
            newRounds[currentRound] = [...newPlayArea];
            setRounds(newRounds);

            setCurrentRound(prev => prev + 1);
            setPlayArea([]);
            setTally(0);
        } else {
            const newRounds = [...rounds];
            newRounds[currentRound] = [...newPlayArea];
            setRounds(newRounds);
        }
    }

    //applying points during pegging phase
    const applyPeggingPoints = (newTally, newPlayArea, currentPlayer, humanHand = humanPlayer.hand, computerHand = computerPlayer.hand) => {
        const result = peggingCalculation(newTally, newPlayArea, humanHand, computerHand);

        if (currentPlayer === "human") {
            setHumanPlayer(prev => ({...prev, score: prev.score + result.points}));
        } else {
            setComputerPlayer(prev => ({...prev, score: prev.score + result.points}));
        }

        if (result.lastCard.winner === "human") {
            setHumanPlayer(prev => ({...prev, score: prev.score + result.lastCard.points}));
        } else if (result.lastCard.winner === "computer") {
            setComputerPlayer(prev => ({...prev, score: prev.score + result.lastCard.points}));
        }
    }

    //holding states for turn and who said go first
    const handleGo = () => {
    if (goFirst === "computer") {
        setGoFirst(null);
        setTurn("computer");
    } else {
        setGoFirst("human");
        setTurn("computer");
    }
}

    const humanCanPlay = humanPlayer.hand.some(card => card.value + tally <= 31);

    //JSX
    return (
        <div className="gameContainer">

            {/* Row 1 - Computer */}
            <div className="rowComputer">
            <PlayerSection player={computerPlayer} cribHand={crib} tally={tally} />
            </div>

            {/* Row 2 - Deck + Play Area */}
            <div className="rowMiddle">
            <Deck deck={deck} starterCard={starterCard} />
            <PlayArea cards={playArea} tally={tally} rounds={rounds} currentRound={currentRound} />
            </div>

            {/* Row 3 - Human */}
            <div className="rowHuman">
            <PlayerSection
                player={humanPlayer}
                cribHand={crib}
                onCardSelect={handleCardSelect}
                selectedCards={cardSelect}
                tally={tally}
            />
            <div className="humanControls">
                {gamePhase === "dealing" && (
                <button className="btn btn-primary" onClick={handleDeal}>Deal Cards</button>
                )}
                {gamePhase === "discard" && (
                <button className="btn btn-primary" onClick={handleDiscard} disabled={cardSelect.length < 2}>
                    Discard to Crib
                </button>
                )}
                {gamePhase === "pegging" && (
                <button className="btn btn-primary" onClick={handlePlayCard} disabled={cardSelect.length === 0 || !humanCanPlay}>
                    Play Card
                </button>
                )}
                {gamePhase === "pegging" && (
                <button className="btn" onClick={handleGo} disabled={humanCanPlay}>Go</button>
                )}
            </div>
            </div>

        </div>
    );
};

export default GameContainer;

