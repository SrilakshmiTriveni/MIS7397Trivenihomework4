/*
Program name: states.js
Description: Load state dropdown from external JSON using Fetch API.
*/

document.addEventListener("DOMContentLoaded", async function () {
  const stateSelect = document.getElementById("state");
  if (!stateSelect) return;

  while (stateSelect.options.length > 1) {
    stateSelect.remove(1);
  }

  try {
    const response = await fetch("states-data.json");
    if (!response.ok) throw new Error("HTTP error " + response.status);

    const states = await response.json();
    states.sort((a, b) => a.name.localeCompare(b.name));

    states.forEach(state => {
      const option = document.createElement("option");
      option.value = state.code;
      option.textContent = state.name;
      stateSelect.appendChild(option);
    });
  } catch (err) {
    console.error("Error loading states via Fetch:", err);
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
