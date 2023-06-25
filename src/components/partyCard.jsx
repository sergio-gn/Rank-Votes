import { TiArrowUpThick, TiArrowDownThick } from "react-icons/ti";

function PartyCard({ party, disabledState, upVote, downVote }) {
  return (
    <div className="container-card">
      <div className="buttons">
        <button disabled={disabledState[party.id]} onClick={() => upVote(party.id)}>
          <TiArrowUpThick style={{ fontSize: "2rem" }} />
        </button>
        <h2>{party.vote}</h2>
        <button disabled={disabledState[party.id]} onClick={() => downVote(party.id)}>
          <TiArrowDownThick style={{ fontSize: "2rem" }} />
        </button>
      </div>
      <div className="card d-flex">
        <h2 className="partyname">{party.name}</h2>
        <ul className="card-list">
          <li>Place: {party.place}</li>
          <li>Price: {party.price}</li>
        </ul>
      </div>
    </div>
  );
}

export default PartyCard;