const PlayArea = ({cards, tally}) => {
    return (
        <div>
            <div>
                {cards.map((card) => (
                    <div key={card.id}>
                        {card.id}
                    </div>
                ))}
            </div>
            <p>Running Tally: {tally}</p>
        </div>
    )
};

export default PlayArea;