import './Deck.css'

const Deck = ({deck, starterCard}) => {
  return (
    <div className="deckArea">
      <div className="deckLabel">Deck</div>
      <div className="deckStack">
        <span className="pcard-back deck-card" />
        {starterCard && (
          <span className={`pcard-${({'A':'a','J':'j','Q':'q','K':'k'}[starterCard.rank] ?? starterCard.rank.toLowerCase())}${({'spades':'s','hearts':'h','clubs':'c','diamonds':'d'}[starterCard.suit])} starter-card`} />
        )}
      </div>
    </div>
  );
};

export default Deck;