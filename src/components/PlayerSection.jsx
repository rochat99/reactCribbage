import "./PlayerSection.css";

const PlayerSection = ({player, cribHand, onCardSelect, selectedCards = []}) => {

    return (
        <div className="playerSection">
            <h1>{player.name}</h1>
            <p>{player.isDealer ? "Dealer" : null}</p>
            <div className="handCards">
                {player.hand.map((card) => (
                    <div className={`card ${player.isComputer ? "hidden" : ""} ${selectedCards.some(c => c.id === card.id) ? "selected" : ""}`} key={card.id} onClick={() => onCardSelect(card)}>
                        {card.id}
                    </div>
                ))}
            </div>
            {player.isDealer && 
                <div>
                    <h2>Crib</h2>
                    <div>
                        {cribHand.map((card) => (
                            <div className={`cribCards ${player.isDealer ? "" : "hidden"}`} key={card.id}>
                                {card.id}
                            </div>
                        ))}
                    </div>
                </div>
            }
        </div>
    )
    
}

export default PlayerSection;