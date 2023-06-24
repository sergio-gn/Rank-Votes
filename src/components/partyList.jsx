import PartyCard from "./partyCard";

function PartyList({ parties, disabledState, upVote, downVote }) {
  // Ranking sort
  parties.sort((a, b) => parseFloat(b.vote) - parseFloat(a.vote));

  return (
    <div className="ranking">
      {parties.map((party, index) => (
        <PartyCard
          key={index}
          party={party}
          disabledState={disabledState}
          upVote={upVote}
          downVote={downVote}
        />
      ))}
    </div>
  );
}

export default PartyList;