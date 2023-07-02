import React, { useState } from "react";

function SelectCities({ filterPartiesByCity, parties }) {
  const [selectedOption, setSelectedOption] = useState("");

  const handleOptionChange = (event) => {
    const selectedCity = event.target.value;
    setSelectedOption(selectedCity);
    filterPartiesByCity(selectedCity);
  };

  // Extract unique city names from the parties prop
  const cities = [...new Set(parties.map((party) => party.city))];

  return (
    <div>
      <select value={selectedOption} onChange={handleOptionChange}>
        <option disabled value="">
          Please Select a City
        </option>
        {cities.map((city) => (
          <option key={city} value={city}>
            {city}
          </option>
        ))}
      </select>
      {selectedOption ? <p>You are in: {selectedOption}</p> : ""}
    </div>
  );
}

export default SelectCities;
