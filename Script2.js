/*
Program name: Script1.js
Author: Bolla Srilakshmi Triveni
Date created: 10-20-2025
Date last edited: 12-05-2025
Version: 3.0
Description: Validation + review for homework3.html
             + live clock, cookies, and localStorage.
*/

// ===== Cookie / storage constants =====
const COOKIE_NAME = "scClinicFirstName";
const FORM_STORAGE_PREFIX = "scClinicForm_";

// ---------- Cookie helpers ----------
function setCookie(name, value, days) {
  try {
    const d = new Date();
    d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + d.toUTCString();
    document.cookie = name + "=" + encodeURIComponent(value) + ";" +
      expires + ";path=/";
  } catch (e) {
    console.warn("Unable to set cookie:", e);
  }
}

function getCookie(name) {
  try {
    const cname = name + "=";
    const decoded = decodeURIComponent(document.cookie || "");
    const parts = decoded.split(";");
    for (let part of parts) {
      part = part.trim();
      if (part.indexOf(cname) === 0) {
        return part.substring(cname.length);
      }
    }
  } catch (e) {
    console.warn("Unable to read cookie:", e);
  }
  return "";
}

function eraseCookie(name) {
  try {
    document.cookie = name +
      "=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;";
  } catch (e) {
    console.warn("Unable to erase cookie:", e);
  }
}

// ===== Simple helpers =====
function money(num) {
  if (isNaN(num)) return "";
  return "$" + num.toLocaleString("en-US", { maximumFractionDigits: 0 });
}

function todayYMD() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function parseMMDDYYYY(str) {
  // returns Date or null
  if (!str) return null;
  const parts = str.split("/");
  if (parts.length !== 3) return null;
  const [mm, dd, yyyy] = parts.map(p => parseInt(p, 10));
  if (!mm || !dd || !yyyy) return null;
  const d = new Date(yyyy, mm - 1, dd);
  if (d.getFullYear() !== yyyy || d.getMonth() !== mm - 1 || d.getDate() !== dd) {
    return null;
  }
  return d;
}

// ===== Header date/time – live clock (time-based event) =====
(function () {
  try {
    const l1 = document.getElementById("todayLine1");
    const l2 = document.getElementById("todayLine2");

    function updateHeaderClock() {
      const d = new Date();
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const dd = String(d.getDate()).padStart(2, "0");
      const yyyy = d.getFullYear();
      if (l1) {
        l1.textContent = `Today's date: ${mm}/${dd}/${yyyy}`;
      }
      if (l2) {
        // time-based event: live ticking clock
        l2.textContent = d.toLocaleTimeString();
      }
    }

    updateHeaderClock();
    setInterval(updateHeaderClock, 1000); // update every second
  } catch (e) {
    console.warn("Header clock error:", e);
  }
})();

// ===================== MAIN =====================
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("patientForm");
  if (!form) return;

  // ---- Grab elements ----
  const fname = document.getElementById("fname");
  const fnameErr = document.getElementById("fnameErr");
  const mi = document.getElementById("mi");
  const miErr = document.getElementById("miErr");
  const lname = document.getElementById("lname");
  const lnameErr = document.getElementById("lnameErr");

  const dob = document.getElementById("dob");
  const dobErr = document.getElementById("dobErr");
  const ssn = document.getElementById("ssn");
  const ssnErr = document.getElementById("ssnErr");

  const email = document.getElementById("email");
  const emailErr = document.getElementById("emailErr");
  const phone = document.getElementById("phone");
  const phoneErr = document.getElementById("phoneErr");
  const medicalId = document.getElementById("medicalId");
  const medicalIdErr = document.getElementById("medicalIdErr");

  const address1 = document.getElementById("address1");
  const addr1Err = document.getElementById("addr1Err");
  const address2 = document.getElementById("address2");
  const addr2Err = document.getElementById("addr2Err");
  const city = document.getElementById("city");
  const cityErr = document.getElementById("cityErr");
  const stateSel = document.getElementById("state");
  const stateErr = document.getElementById("stateErr");
  const zip = document.getElementById("zip");
  const zipErr = document.getElementById("zipErr");

  const travelDate = document.getElementById("travelDate");
  const travelDateErr = document.getElementById("travelDateErr");
  const moveInDate = document.getElementById("moveInDate");
  const moveInDateErr = document.getElementById("moveInDateErr");

  const userid = document.getElementById("userid");
  const userErr = document.getElementById("userErr");
  const pw = document.getElementById("pw");
  const pw2 = document.getElementById("pw2");
  const pwErr = document.getElementById("pwErr");

  const range = document.getElementById("range");
  const rangeOut = document.getElementById("range-slider");

  const salary = document.getElementById("salary");
  const salaryOut = document.getElementById("salaryOut");

  const priceMin = document.getElementById("priceMin");
  const priceMax = document.getElementById("priceMax");
  const priceOut = document.getElementById("priceOut");
  const priceDisplayValue = document.getElementById("priceDisplayValue");

  const reviewPane = document.getElementById("reviewPane");
  const reviewBody = document.getElementById("reviewBody");
  const btnValidate = document.getElementById("btnValidate");

  const rememberMe = document.getElementById("rememberMe");

  // ===== Cookie + Local Storage + greeting =====
  const greetingText = document.getElementById("greetingText");
  const notYouWrapper = document.getElementById("notYouWrapper");
  const notYouNameSpan = document.getElementById("notYouName");
  const notYouCheckbox = document.getElementById("notYouCheckbox");

  function currentFirstName() {
    return (fname && fname.value ? fname.value.trim() : "");
  }

  function storageKeyFor(firstName) {
    if (!firstName) return null;
    return FORM_STORAGE_PREFIX + encodeURIComponent(firstName.toLowerCase());
  }

  // Build a plain object with NON-secure form values
  function buildFormDataObject() {
    const data = {};
    Array.from(form.elements).forEach(el => {
      if (!el.name) return;
      const type = (el.type || "").toLowerCase();

      // Skip secure / control fields
      if (type === "password" || type === "submit" ||
        type === "reset" || type === "button" ||
        el.id === "ssn" || el.id === "medicalId") {
        return;
      }

      if (type === "radio") {
        if (el.checked) data[el.name] = el.value;
        return;
      }

      if (type === "checkbox") {
        if (!data[el.name]) data[el.name] = [];
        if (el.checked) data[el.name].push(el.value);
        return;
      }

      data[el.name] = el.value;
    });
    return data;
  }

  function applyFormDataObject(data) {
    if (!data) return;

    Array.from(form.elements).forEach(el => {
      if (!el.name || !(el.name in data)) return;
      const type = (el.type || "").toLowerCase();

      if (type === "password" || el.id === "ssn" || el.id === "medicalId") {
        return; // never prefill secure fields
      }

      if (type === "radio") {
        el.checked = (data[el.name] === el.value);
        return;
      }

      if (type === "checkbox") {
        const vals = Array.isArray(data[el.name]) ? data[el.name] : [];
        el.checked = vals.includes(el.value);
        return;
      }

      el.value = data[el.name];
    });

    // Refresh any derived UI
    try {
      updateRange();
      updateSalary();
      updatePrice();
    } catch (e) {
      console.warn("Apply data refresh error:", e);
    }
  }

  function saveFormToLocalStorage() {
    if (!window.localStorage) return;
    if (rememberMe && !rememberMe.checked) return;

    const firstName = currentFirstName();
    if (!firstName) return;

    const key = storageKeyFor(firstName);
    if (!key) return;

    try {
      const data = buildFormDataObject();
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.warn("Unable to save form data:", e);
    }
  }

  function loadFormFromLocalStorage(firstName) {
    if (!window.localStorage) return;
    const name = firstName || currentFirstName();
    if (!name) return;
    const key = storageKeyFor(name);
    if (!key) return;

    try {
      const json = localStorage.getItem(key);
      if (!json) return;
      const data = JSON.parse(json);
      applyFormDataObject(data);
    } catch (e) {
      console.warn("Unable to load form data:", e);
    }
  }

  function clearStoredFormForName(firstName) {
    if (!window.localStorage) return;
    const key = storageKeyFor(firstName);
    if (key) {
      try { localStorage.removeItem(key); } catch (e) { }
    }
  }

  function startAsNewUser(previousName) {
    const oldName = previousName || getCookie(COOKIE_NAME) || currentFirstName();
    if (oldName) {
      clearStoredFormForName(oldName);
    }
    eraseCookie(COOKIE_NAME);

    form.reset();
    if (fname) fname.value = "";

    if (greetingText) greetingText.textContent = "Welcome new user!";
    if (notYouWrapper) notYouWrapper.style.display = "none";

    try {
      updateRange();
      updateSalary();
      updatePrice();
    } catch (e) { }
  }

  // ---- Initial greeting based on cookie ----
  const cookieName = getCookie(COOKIE_NAME);
  if (cookieName) {
    if (greetingText) greetingText.textContent = `Welcome back, ${cookieName}!`;
    if (notYouWrapper) notYouWrapper.style.display = "inline-block";
    if (notYouNameSpan) notYouNameSpan.textContent = cookieName;
    if (fname && !fname.value) fname.value = cookieName;
    if (rememberMe) rememberMe.checked = true;
    // Auto-restore any saved form data
    loadFormFromLocalStorage(cookieName);
  } else {
    if (greetingText) greetingText.textContent = "Welcome new user!";
    if (notYouWrapper) notYouWrapper.style.display = "none";
  }

  // ---- Events for greeting / cookies / local storage ----
  if (notYouCheckbox) {
    notYouCheckbox.addEventListener("change", () => {
      if (notYouCheckbox.checked) {
        startAsNewUser(cookieName);
        notYouCheckbox.checked = false;
      }
    });
  }

  if (fname) {
    fname.addEventListener("blur", () => {
      const firstName = currentFirstName();
      if (!firstName) {
        eraseCookie(COOKIE_NAME);
        return;
      }

      if (!rememberMe || rememberMe.checked) {
        setCookie(COOKIE_NAME, firstName, 2);  // 48 hours
        if (greetingText) {
          greetingText.textContent = `Welcome back, ${firstName}!`;
        }
        if (notYouWrapper) {
          notYouWrapper.style.display = "inline-block";
          if (notYouNameSpan) notYouNameSpan.textContent = firstName;
        }
        saveFormToLocalStorage();
      }
    });
  }

  if (rememberMe) {
    rememberMe.addEventListener("change", () => {
      const firstName = currentFirstName() || cookieName;
      if (!firstName) return;

      if (!rememberMe.checked) {
        // user does NOT want to be remembered
        clearStoredFormForName(firstName);
        eraseCookie(COOKIE_NAME);
      } else {
        // re-enable remembering
        setCookie(COOKIE_NAME, firstName, 2);
        saveFormToLocalStorage();
      }
    });
  }

  // Save non-secure data whenever something changes / loses focus
  form.addEventListener("change", saveFormToLocalStorage);
  form.addEventListener("blur", (evt) => {
    if (evt.target && evt.target.name) {
      saveFormToLocalStorage();
    }
  }, true);

  // ===== Slider live updates =====
  function updateRange() {
    if (!range || !rangeOut) return;
    rangeOut.textContent = range.value;
  }

  function updateSalary() {
    if (!salary || !salaryOut) return;
    salaryOut.textContent = money(Number(salary.value)) + " / year";
  }

  function updatePrice() {
    if (!priceMin || !priceMax) return;
    let minV = Number(priceMin.value);
    let maxV = Number(priceMax.value);
    if (minV > maxV) {
      maxV = minV;
      priceMax.value = maxV;
    }
    const text = money(minV) + " – " + money(maxV);
    if (priceOut) priceOut.textContent = text;
    if (priceDisplayValue) priceDisplayValue.textContent = text;
  }

  // expose (in case other scripts need them)
  window.updateRange = updateRange;
  window.updateSalary = updateSalary;
  window.updatePrice = updatePrice;

  if (range) {
    range.addEventListener("input", updateRange);
    updateRange();
  }
  if (salary) {
    salary.addEventListener("input", updateSalary);
    updateSalary();
  }
  if (priceMin) {
    priceMin.addEventListener("input", updatePrice);
  }
  if (priceMax) {
    priceMax.addEventListener("input", updatePrice);
  }
  updatePrice();

  // ===== Validation helpers =====
  function setError(el, span, msg) {
    if (span) span.textContent = msg || "";
    if (el) {
      if (msg) el.classList.add("input-error");
      else el.classList.remove("input-error");
    }
  }

  function clearAllErrors() {
    const spans = document.querySelectorAll(".form-error");
    spans.forEach(s => s.textContent = "");
    const inputs = form.querySelectorAll(".input-error");
    inputs.forEach(i => i.classList.remove("input-error"));
  }

  function validateField(el, span, customFn) {
    if (!el) return true;
    let ok = el.checkValidity();
    let msg = "";

    if (!ok) {
      msg = el.validationMessage || "Invalid value.";
    }

    if (ok && typeof customFn === "function") {
      const res = customFn(el);
      if (res !== true) {
        ok = false;
        msg = res || "Invalid value.";
      }
    }

    setError(el, span, ok ? "" : msg);
    return ok;
  }

  function validateDates() {
    let ok = true;

    if (dob) {
      ok = validateField(dob, dobErr, (el) => {
        const d = parseMMDDYYYY(el.value);
        if (!d) return "Invalid date.";
        const today = new Date();
        const maxBack = new Date();
        maxBack.setFullYear(maxBack.getFullYear() - 120);
        if (d > today) return "Birthday cannot be in the future.";
        if (d < maxBack) return "Birthday cannot be more than 120 years ago.";
        return true;
      }) && ok;
    }

    const dateAfterTodayCheck = (el) => {
      const d = parseMMDDYYYY(el.value);
      if (!d) return "Invalid date.";
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (d <= today) return "Date must be after today.";
      return true;
    };

    if (travelDate) {
      ok = validateField(travelDate, travelDateErr, dateAfterTodayCheck) && ok;
    }
    if (moveInDate) {
      ok = validateField(moveInDate, moveInDateErr, dateAfterTodayCheck) && ok;
    }

    return ok;
  }

  function validatePasswords() {
    let ok = true;
    if (pw && pw2) {
      // use HTML5 patterns first
      ok = validateField(pw, null) && validateField(pw2, null) && ok;

      if (pw.value && pw2.value && pw.value !== pw2.value) {
        ok = false;
        setError(pw2, pwErr, "Passwords do not match.");
      } else {
        if (ok) setError(pw2, pwErr, "");
      }
    }
    return ok;
  }

  function validateRequiredRadios(name, message) {
    const radios = form.querySelectorAll(`input[type="radio"][name="${name}"]`);
    if (!radios.length) return true;
    const anyChecked = Array.from(radios).some(r => r.checked);
    if (!anyChecked) {
      // show error near first radio if we have a span
      const first = radios[0];
      let span = null;
      // optional: you can add dedicated spans for radio errors if you want
      if (!span && first && first.parentElement) {
        // nothing to display now, but we can use alert or console later
      }
      alert(message);
    }
    return anyChecked;
  }

  function validateForm() {
    clearAllErrors();
    let ok = true;

    ok = validateField(fname, fnameErr) && ok;
    ok = validateField(mi, miErr) && ok;
    ok = validateField(lname, lnameErr) && ok;

    ok = validateField(email, emailErr) && ok;
    ok = validateField(phone, phoneErr) && ok;
    ok = validateField(medicalId, medicalIdErr) && ok;

    ok = validateField(address1, addr1Err) && ok;
    ok = validateField(address2, addr2Err) && ok;
    ok = validateField(city, cityErr) && ok;
    ok = validateField(stateSel, stateErr, (el) =>
      el.value ? true : "Please select a state."
    ) && ok;
    ok = validateField(zip, zipErr) && ok;

    ok = validateField(userid, userErr) && ok;

    // optional SSN: validate only if provided
    if (ssn && ssn.value.trim() !== "") {
      ok = validateField(ssn, ssnErr) && ok;
    }

    ok = validateDates() && ok;
    ok = validatePasswords() && ok;

    ok = validateRequiredRadios("housing",
      "Please pick a housing option (Own / Rent / Unsure).") && ok;
    ok = validateRequiredRadios("vaccinated",
      "Please indicate vaccination status.") && ok;

    return ok;
  }

  // ===== Build review panel =====
  function buildReview() {
    if (!reviewPane || !reviewBody) return;
    reviewBody.innerHTML = "";

    const ul = document.createElement("ul");

    function add(label, val) {
      const li = document.createElement("li");
      li.textContent = `${label}: ${val}`;
      ul.appendChild(li);
    }

    add("First Name", fname.value);
    add("Middle Initial", mi.value);
    add("Last Name", lname.value);
    add("Date of Birth", dob.value);
    add("Email", email.value);
    add("Phone", phone.value);
    add("Address 1", address1.value);
    add("Address 2", address2.value);
    add("City", city.value);
    add("State", stateSel.value);
    add("Zip", zip.value);
    add("Travel Date", travelDate.value);
    add("Move-in Date", moveInDate.value);
    add("User ID", userid.value);

    // illnesses
    const illnessBoxes = form.querySelectorAll("input[name='illness']");
    const selectedIll = Array.from(illnessBoxes)
      .filter(c => c.checked)
      .map(c => c.value);
    add("Past Illnesses", selectedIll.join(", ") || "None");

    // pain
    const pain = form.querySelector("input[name='pain']:checked");
    add("Pain Level", pain ? pain.value : "Not specified");

    // vaccinated
    const vacc = form.querySelector("input[name='vaccinated']:checked");
    add("Vaccinated", vacc ? vacc.value : "Not specified");

    // housing
    const housing = form.querySelector("input[name='housing']:checked");
    add("Housing", housing ? housing.value : "Not specified");

    add("Health Rating (1–10)", range.value);
    add("Desired Salary", money(Number(salary.value)));
    add("Home Price Range",
      money(Number(priceMin.value)) + " – " + money(Number(priceMax.value)));

    reviewBody.appendChild(ul);
    reviewPane.hidden = false;
  }

  // ===== VALIDATE button =====
  if (btnValidate) {
    btnValidate.addEventListener("click", (evt) => {
      evt.preventDefault();
      if (validateForm()) {
        buildReview();

        // create submit button only after success
        let realSubmit = form.querySelector("button[type='submit']");
        if (!realSubmit) {
          realSubmit = document.createElement("button");
          realSubmit.type = "submit";
          realSubmit.textContent = "SEND THE FORM";
          realSubmit.className = "btn-submit-final";
          const actionsRow = form.querySelector(".actions-row");
          if (actionsRow) {
            actionsRow.appendChild(realSubmit);
          } else {
            form.appendChild(realSubmit);
          }
        }
      } else {
        if (reviewPane) reviewPane.hidden = true;
        alert("Please fix the highlighted errors before continuing.");
      }
    });
  }

  // ===== Final submit (allow default if valid) =====
  form.addEventListener("submit", (evt) => {
    if (!validateForm()) {
      evt.preventDefault();
      alert("Please correct the errors before submitting.");
    } else {
      // last chance to save non-secure data
      saveFormToLocalStorage();
    }
  });

  // ===== Reset: also clear cookie/localStorage if needed =====
  form.addEventListener("reset", () => {
    setTimeout(() => {
      clearAllErrors();
      if (reviewPane) reviewPane.hidden = true;
      if (rememberMe && !rememberMe.checked) {
        const n = currentFirstName() || cookieName;
        if (n) clearStoredFormForName(n);
        eraseCookie(COOKIE_NAME);
      }
      try {
        updateRange();
        updateSalary();
        updatePrice();
      } catch (e) { }
    }, 0);
  });
});
