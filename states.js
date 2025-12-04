/*
Program name: states.js
Author: Bolla Srilakshmi Triveni
Date created: 10-20-2025
Date last edited: 10-24-2025
Version: 2.6
Description: External state dropdown data with all 50 states, DC, and Puerto Rico - 2-letter codes only
*/

document.addEventListener('DOMContentLoaded', function() {
  const stateSelect = document.getElementById('state');
  if (!stateSelect) return;

  while (stateSelect.options.length > 1) {
    stateSelect.remove(1);
  }

  const states = [
    {code: "AL", name: "Alabama"},
    {code: "AK", name: "Alaska"},
    {code: "AZ", name: "Arizona"},
    {code: "AR", name: "Arkansas"},
    {code: "CA", name: "California"},
    {code: "CO", name: "Colorado"},
    {code: "CT", name: "Connecticut"},
    {code: "DE", name: "Delaware"},
    {code: "DC", name: "District of Columbia"},
    {code: "FL", name: "Florida"},
    {code: "GA", name: "Georgia"},
    {code: "HI", name: "Hawaii"},
    {code: "ID", name: "Idaho"},
    {code: "IL", name: "Illinois"},
    {code: "IN", name: "Indiana"},
    {code: "IA", name: "Iowa"},
    {code: "KS", name: "Kansas"},
    {code: "KY", name: "Kentucky"},
    {code: "LA", name: "Louisiana"},
    {code: "ME", name: "Maine"},
    {code: "MD", name: "Maryland"},
    {code: "MA", name: "Massachusetts"},
    {code: "MI", name: "Michigan"},
    {code: "MN", name: "Minnesota"},
    {code: "MS", name: "Mississippi"},
    {code: "MO", name: "Missouri"},
    {code: "MT", name: "Montana"},
    {code: "NE", name: "Nebraska"},
    {code: "NV", name: "Nevada"},
    {code: "NH", name: "New Hampshire"},
    {code: "NJ", name: "New Jersey"},
    {code: "NM", name: "New Mexico"},
    {code: "NY", name: "New York"},
    {code: "NC", name: "North Carolina"},
    {code: "ND", name: "North Dakota"},
    {code: "OH", name: "Ohio"},
    {code: "OK", name: "Oklahoma"},
    {code: "OR", name: "Oregon"},
    {code: "PA", name: "Pennsylvania"},
    {code: "RI", name: "Rhode Island"},
    {code: "SC", name: "South Carolina"},
    {code: "SD", name: "South Dakota"},
    {code: "TN", name: "Tennessee"},
    {code: "TX", name: "Texas"},
    {code: "UT", name: "Utah"},
    {code: "VT", name: "Vermont"},
    {code: "VA", name: "Virginia"},
    {code: "WA", name: "Washington"},
    {code: "WV", name: "West Virginia"},
    {code: "WI", name: "Wisconsin"},
    {code: "WY", name: "Wyoming"},
    {code: "PR", name: "Puerto Rico"}
  ];

  states.sort((a, b) => a.name.localeCompare(b.name));

  states.forEach(state => {
    const option = document.createElement('option');
    option.value = state.code;
    option.textContent = state.name;
    stateSelect.appendChild(option);
  });

  console.log('States dropdown loaded successfully with ' + states.length + ' options. Using 2-letter codes only.');
});
