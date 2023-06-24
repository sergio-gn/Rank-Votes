import React, { useState } from "react";

function Cities() {
  const [selectedOption, setSelectedOption] = useState("");


  const handleOptionChange = (event) => {
    const selectedCity = event.target.value;
    setSelectedOption(selectedCity);
  };
  

  return (
    <div>
      <select value={selectedOption} onChange={handleOptionChange}>
        <option value="">Qual Cidade?</option>
        <option value="Curitiba">Curitiba</option>
        <option value="Guarapuava">Guarapuava</option>
        <option value="Ponta Grossa">Ponta Grossa</option>
      </select>
      <p>Voce esta em: {selectedOption}</p>
    </div>
  );
}

export default Cities;
