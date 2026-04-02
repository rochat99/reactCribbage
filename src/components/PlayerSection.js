const PlayerSection = ({player}) => {

    return (
        <div className="playerSection">
            <h1>{player.name}</h1>
            <p>{player.isDealer ? "Dealer" : null}</p>
            <div className="handCards">
                {player.hand.map((card) => (
                    <div className={`card ${player.isComputer ? "hidden" : ""}`} key={card.id}>
                        {card.id}
                    </div>
                ))}
            </div>
        </div>
    )
    
}