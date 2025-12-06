/*
Program name: states.js
Author: Bolla Srilakshmi Triveni
Date created: 10-20-2025
Date last edited: 12-05-2025
Version: 3.0
Description: Load state dropdown from an external JSON file using Fetch API.
*/

document.addEventListener("DOMContentLoaded", async function () {
  const stateSelect = document.getElementById("state");
  if (!stateSelect) return;

  // keep the first option, remove the rest
  while (stateSelect.options.length > 1) {
    stateSelect.remove(1);
  }

  try {
    // Fetch list from external file (same folder as this JS)
    const response = await fetch("states-data.json");
    if (!response.ok) {
      throw new Error("HTTP error " + response.status);
    }

    const states = await response.json();  // expects an array of { code, name }
    states.sort((a, b) => a.name.localeCompare(b.name));

    states.forEach(state => {
      const option = document.createElement("option");
      option.value = state.code;
      option.textContent = state.name;
      stateSelect.appendChild(option);
    });

    console.log("States loaded via Fetch:", states.length);
  } catch (err) {
    console.error("Error loading states via Fetch:", err);

    // Graceful fallback – minimal list so form still works
    const fallbackStates = [
      { code: "TX", name: "Texas" },
      { code: "CA", name: "California" },
      { code: "NY", name: "New York" }
    ];

    fallbackStates.forEach(state => {
      const option = document.createElement("option");
      option.value = state.code;
      option.textContent = state.name;
      stateSelect.appendChild(option);
    });
  }
});
