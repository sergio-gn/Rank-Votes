import PartyCard from "./partyCard";

function PartyList({ parties, disabledState, upVote, downVote, selectedCity }) {
  // Ranking sort
  parties.sort((a, b) => parseFloat(b.vote) - parseFloat(a.vote));

  // Filter parties based on selected city
  const filteredParties = selectedCity
    ? parties.filter((party) => party.city === selectedCity)
    : parties;

  return (
    <div className="ranking">
      {filteredParties.map((party, index) => (
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