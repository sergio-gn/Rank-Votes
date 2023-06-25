import React, { useState } from "react";

function selectCities({ filterPartiesByCity }) {
  const [selectedOption, setSelectedOption] = useState("");

  const handleOptionChange = (event) => {
    const selectedCity = event.target.value;
    setSelectedOption(selectedCity);
    filterPartiesByCity(selectedCity);
  };

  return (
    <div>
      <select value={selectedOption} onChange={handleOptionChange}>
        <option disabled value="">
          Please Select a City
        </option>
        <option value="newyork">New York</option>
        <option value="tokyo">Tokyo</option>
        <option value="paris">Paris</option>
      </select>
      {selectedOption ? ( <p>You are in: {selectedOption}</p>) : ("")}
    </div>
  );
}

export default selectCities;
