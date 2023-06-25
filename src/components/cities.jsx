import React, { useState } from "react";

function Cities({ filterPartiesByCity }) {
  const [selectedOption, setSelectedOption] = useState("");

  const handleOptionChange = (event) => {
    const selectedCity = event.target.value;
    setSelectedOption(selectedCity);
    filterPartiesByCity(selectedCity); // Call the filterPartiesByCity function with the selected city
  };

  return (
    <div>
      <select value={selectedOption} onChange={handleOptionChange}>
        <option>City?</option>
        <option value="newyork">New York</option>
        <option value="tokyo">Tokyo</option>
        <option value="paris">Paris</option>
      </select>
      <p>You are in: {selectedOption}</p>
    </div>
  );
}

export default Cities;
