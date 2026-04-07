import './PlayArea.css'

const suitMap = { spades: 's', hearts: 'h', clubs: 'c', diamonds: 'd' };
const rankMap = { A: 'a', J: 'j', Q: 'q', K: 'k' };

function getCardClass(rank, suit) {
  const r = rankMap[rank] ?? rank.toLowerCase();
  const s = suitMap[suit];
  return `pcard-${r}${s}`;
}

const PlayArea = ({cards, tally, rounds, currentRound}) => {
  // Build a display list: group cards by round with dividers between
  const displayRounds = [];
  
  for (let i = 0; i <= currentRound; i++) {
    const roundCards = rounds[i] ?? [];
    if (roundCards.length > 0) {
      displayRounds.push({ type: 'round', cards: roundCards, index: i });
    }
  }

  return (
    <div className="playArea">
      <div className="tallyDisplay">
        <span className="tallyLabel">Count</span>
        <span className="tallyNumber">{tally}</span>
      </div>
      <div className="playedCards">
        {displayRounds.length === 0
          ? <div className="emptyPlay">Play area</div>
          : displayRounds.map((group, gi) => (
              <div key={gi} className="roundGroup">
                {group.cards.map((card) => (
                  <span
                    key={card.id}
                    className={`${getCardClass(card.rank, card.suit)} played-card ${card.owner}`}
                  />
                ))}
                {gi < displayRounds.length - 1 && (
                  <div className="roundDivider">
                    <span className="roundDividerLine" />
                    <span className="roundDividerLabel">Go</span>
                    <span className="roundDividerLine" />
                  </div>
                )}
              </div>
            ))
        }
      </div>
    </div>
  );
};

export default PlayArea;