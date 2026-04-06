import './Deck.css'

const Deck = ({deck, starterCard}) => {
    return (
        <div className="deck">
            {starterCard && <div className="card starter">{starterCard.id}</div>}
        </div>
    )
}

export default Deck;