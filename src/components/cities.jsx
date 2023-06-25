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
        <option>City?</option>
        <option value="NewYork">New York</option>
        <option value="Tokyo">Tokyo</option>
        <option value="Paris">Paris</option>
      </select>
      <p>You are in: {selectedOption}</p>
    </div>
  );
}

export default Cities;