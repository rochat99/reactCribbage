import "./PlayerSection.css";

const suitMap = { spades: 's', hearts: 'h', clubs: 'c', diamonds: 'd' };
const rankMap = { A: 'a', J: 'j', Q: 'q', K: 'k' };

function getCardClass(rank, suit) {
  const r = rankMap[rank] ?? rank.toLowerCase();
  const s = suitMap[suit];
  return `pcard-${r}${s}`;
}

const PlayerSection = ({player, cribHand, onCardSelect, selectedCards = [], tally = 0}) => {
  return (
    <div className={`playerSection ${player.isComputer ? 'computer' : 'human'}`}>

      <div className="cribArea">
        <div className="cribLabel">Crib</div>
        <div className="cribCards">
            {player.isDealer
            ? cribHand.length > 0
                ? cribHand.map((card) => (
                    <span key={card.id} className="pcard-back crib-card" />
                ))
                : <span className="cribEmpty" />
            : <span className="cribEmpty" />
            }
        </div>
    </div>

      <div className="handArea">
        <div className="playerInfo">
          <span className="playerName">{player.name}</span>
          <span className="playerScore">{player.score} pts</span>
          {player.isDealer && <span className="dealerBadge">Dealer</span>}
        </div>
        <div className="handCards">
          {player.hand.map((card) => (
            <span
              key={card.id}
              className={`${player.isComputer ? 'pcard-back' : getCardClass(card.rank, card.suit)} hand-card ${selectedCards.some(c => c.id === card.id) ? 'selected' : ''}`}
              onClick={() => !player.isComputer && onCardSelect && onCardSelect(card)}
            />
          ))}
        </div>
    </div>

    </div>
  );
};

export default PlayerSection;