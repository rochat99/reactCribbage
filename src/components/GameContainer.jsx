import React from "react";
import {useState} from "react";
import {createDeck, dealCards} from "../logic/makeShuffleDeck.js";
import PlayerSection from "./PlayerSection.jsx";

const GameContainer = () => {

    //create states to handle deck, players, crib and game phase
    const [deck, setDeck] = useState(createDeck);
    const [crib, setCrib] = useState([]);
    const [gamePhase, setGamePhase] = useState("dealing");

    const [humanPlayer, setHumanPlayer] = useState({
        name: "You",
        score: 0,
        hand: [],
        isDealer: true,
        isComputer: false
    });
    const [computerPlayer, setComputerPlayer] = useState({
        name: "Computer",
        score: 0,
        hand: [],
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
    }

    return (
        <div>
            <PlayerSection player={computerPlayer}/>
            <PlayerSection player={humanPlayer} />
            <button onClick={handleDeal}>Deal Cards</button>
        </div>
    );
};

export default GameContainer;