import React from "react";
import {useState} from "react";
import {createDeck, dealCards} from "../logic/deck.js";

const GameContainer = () => {

    //create states to handle deck, players, crib and game phase
    const [deck, setDeck] = useState(createDeck);
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
    const [crib, setCrib] = useState([]);
    const [gamePhase, setGamePhase] = useState("dealing");



    return (
        
    )
}