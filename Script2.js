/*
Program: Script2.js
Author: Bolla Srilakshmi Triveni
Date last edited: 12-06-2025
Version: 3.1
Description: Validation, review, data grid, time-based event,
             cookie behavior, and localStorage for homework3.html.
*/

(function setupHeaderClock() {
  const line1 = document.getElementById("todayLine1");
  const line2 = document.getElementById("todayLine2");

  function pad2(n) {
    return String(n).padStart(2, "0");
  }

  function updateClock() {
    const d = new Date();
    const mm = pad2(d.getMonth() + 1);
    const dd = pad2(d.getDate());
    const yyyy = d.getFullYear();

    let hh = d.getHours();
    const mins = pad2(d.getMinutes());
    const secs = pad2(d.getSeconds());
    const ampm = hh >= 12 ? "PM" : "AM";
    hh = hh % 12;
    if (hh === 0) hh = 12;

    if (line1) line1.textContent = `Today: ${mm}/${dd}/${yyyy}`;
    if (line2) line2.textContent = `Time: ${pad2(hh)}:${mins}:${secs} ${ampm}`;
  }

  if (line1 || line2) {
    updateClock();
    // Time-based event (updates once per second)
    setInterval(updateClock, 1000);
  }
})();

// ===== Cookie helpers =====
function setCookie(name, value, hours) {
  const expires = new Date();
  expires.setTime(expires.getTime() + hours * 60 * 60 * 1000);
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/`;
}

function getCookie(name) {
  const prefix = name + "=";
  return document.cookie
    .split(";")
    .map(c => c.trim())
    .filter(c => c.startsWith(prefix))
    .map(c => decodeURIComponent(c.substring(prefix.length)))[0] || "";
}

function deleteCookie(name) {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
}

// ===== LocalStorage helpers =====
const STORAGE_KEY = "sccFormData";
const STORAGE_MAX_AGE_MS = 48 * 60 * 60 * 1000; // 48 hours

function safeParseJSON(str) {
  try { return JSON.parse(str); } catch { return null; }
}

// Non-secure fields to save/restore
const NON_SECURE_IDS = [
  "fname", "mi", "lname",
  "dob", "email", "phone",
  "address1", "address2", "city", "state", "zip",
  "travelDate", "moveInDate",
  "range", "salary", "priceMin", "priceMax",
  "symptoms", "otherNotes",
  "userid"
];

// simple HTML sanitizing for text fields
function stripTags(str) {
  return (str || "").replace(/[<>]/g, "");
}

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("patientForm");
  if (!form) return;

  const fname = document.getElementById("fname");
  const mi = document.getElementById("mi");
  const lname = document.getElementById("lname");
  const dob = document.getElementById("dob");
  const travelDate = document.getElementById("travelDate");
  const moveInDate = document.getElementById("moveInDate");
  const email = document.getElementById("email");
  const phone = document.getElementById("phone");
  const medicalId = document.getElementById("medicalId");
  const address1 = document.getElementById("address1");
  const address2 = document.getElementById("address2");
  const city = document.getElementById("city");
  const state = document.getElementById("state");
  const zip = document.getElementById("zip");
  const ssn = document.getElementById("ssn");

  const userid = document.getElementById("userid");
  const pw = document.getElementById("pw");
  const pw2 = document.getElementById("pw2");

  const range = document.getElementById("range");
  const rangeOut = document.getElementById("range-slider");
  const salary = document.getElementById("salary");
  const salaryOut = document.getElementById("salaryOut");
  const priceMin = document.getElementById("priceMin");
  const priceMax = document.getElementById("priceMax");
  const priceOut = document.getElementById("priceOut");
  const priceDisplayValue = document.getElementById("priceDisplayValue");

  const symptoms = document.getElementById("symptoms");
  const otherNotes = document.getElementById("otherNotes");

  const btnGetData = document.getElementById("btnGetData");
  const btnCheck = document.getElementById("btnCheck");
  const reviewPane = document.getElementById("reviewPane");
  const reviewBody = document.getElementById("reviewBody");
  const dataGrid = document.getElementById("dataGrid");

  const rememberMe = document.getElementById("rememberMe");
  const greetingText = document.getElementById("greetingText");
  const notYouWrapper = document.getElementById("notYouWrapper");
  const notYouCheckbox = document.getElementById("notYouCheckbox");
  const notYouName = document.getElementById("notYouName");

  const ssnErr = document.getElementById("ssnErr");
  const ssnConfirm = document.getElementById("ssnConfirm");
  const ssnYes = document.getElementById("ssnYes");
  const ssnNo = document.getElementById("ssnNo");
  const ssnEdit = document.getElementById("ssnEdit");

  const fnameErr = document.getElementById("fnameErr");
  const miErr = document.getElementById("miErr");
  const lnameErr = document.getElementById("lnameErr");
  const dobErr = document.getElementById("dobErr");
  const medicalIdErr = document.getElementById("medicalIdErr");
  const emailErr = document.getElementById("emailErr");
  const phoneErr = document.getElementById("phoneErr");
  const addr1Err = document.getElementById("addr1Err");
  const addr2Err = document.getElementById("addr2Err");
  const cityErr = document.getElementById("cityErr");
  const stateErr = document.getElementById("stateErr");
  const zipErr = document.getElementById("zipErr");
  const userErr = document.getElementById("userErr");
  const pwErr = document.getElementById("pwErr");
  const travelDateErr = document.getElementById("travelDateErr");
  const moveInDateErr = document.getElementById("moveInDateErr");

  // ===== Prevent HTML tags & double quotes where needed =====
  const textInputs = form.querySelectorAll('input[type="text"], input[type="email"], textarea');
  textInputs.forEach(input => {
    input.addEventListener("input", function () {
      this.value = stripTags(this.value);
    });
  });

  if (otherNotes) {
    otherNotes.addEventListener("input", function () {
      this.value = this.value.replace(/"/g, "");
    });
  }

  if (symptoms) {
    symptoms.addEventListener("input", function () {
      this.value = this.value.replace(/[<>]/g, "").replace(/"/g, "");
    });
  }

  // ===== Simple date range helpers for DOB and future dates =====
  function today() {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }
  function addYears(d, years) {
    return new Date(d.getFullYear() + years, d.getMonth(), d.getDate());
  }
  function addDays(d, days) {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate() + days);
  }
  function parseMMDDYYYY(str) {
    const m = str.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (!m) return null;
    const mm = Number(m[1]);
    const dd = Number(m[2]);
    const yyyy = Number(m[3]);
    const d = new Date(yyyy, mm - 1, dd);
    if (d.getFullYear() === yyyy && d.getMonth() === mm - 1 && d.getDate() === dd) return d;
    return null;
  }

  const todayDate = today();
  const dobMin = addYears(todayDate, -120);
  const futureMin = addDays(todayDate, 1);
  const futureMax = addYears(todayDate, 2);

  function checkDob() {
    if (!dob) return true;
    const val = stripTags(dob.value.trim());
    dob.value = val;
    if (!val) {
      dob.setCustomValidity("Date of Birth is required.");
      if (dobErr) dobErr.textContent = "Date of Birth is required.";
      return false;
    }
    const d = parseMMDDYYYY(val);
    if (!d) {
      dob.setCustomValidity("Please use MM/DD/YYYY format.");
      if (dobErr) dobErr.textContent = "Please use MM/DD/YYYY format.";
      return false;
    }
    if (d > todayDate) {
      dob.setCustomValidity("Birthday cannot be in the future.");
      if (dobErr) dobErr.textContent = "Birthday cannot be in the future.";
      return false;
    }
    if (d <= dobMin) {
      dob.setCustomValidity("Date of birth can't be 120 years ago or earlier.");
      if (dobErr) dobErr.textContent = "Date of birth can't be 120 years ago or earlier.";
      return false;
    }
    dob.setCustomValidity("");
    if (dobErr) dobErr.textContent = "";
    return true;
  }

  function checkFutureDate(el, errEl, label) {
    if (!el) return true;
    const val = stripTags(el.value.trim());
    el.value = val;
    if (!val) {
      el.setCustomValidity(`${label} is required.`);
      if (errEl) errEl.textContent = `${label} is required.`;
      return false;
    }
    const d = parseMMDDYYYY(val);
    if (!d) {
      el.setCustomValidity("Please use MM/DD/YYYY format.");
      if (errEl) errEl.textContent = "Please use MM/DD/YYYY format.";
      return false;
    }
    if (d < futureMin) {
      el.setCustomValidity(`${label} must be after today.`);
      if (errEl) errEl.textContent = `${label} must be after today.`;
      return false;
    }
    if (d > futureMax) {
      el.setCustomValidity(`${label} must be within 2 years from today.`);
      if (errEl) errEl.textContent = `${label} must be within 2 years from today.`;
      return false;
    }
    el.setCustomValidity("");
    if (errEl) errEl.textContent = "";
    return true;
  }

  if (dob) {
    dob.addEventListener("blur", checkDob);
    dob.addEventListener("input", () => { dob.setCustomValidity(""); if (dobErr) dobErr.textContent = ""; });
  }
  if (travelDate) {
    travelDate.addEventListener("blur", () => checkFutureDate(travelDate, travelDateErr, "Travel date"));
  }
  if (moveInDate) {
    moveInDate.addEventListener("blur", () => checkFutureDate(moveInDate, moveInDateErr, "Move-in date"));
  }

  // ===== First/Last name + MI formatting =====
  if (fname && fnameErr) {
    fname.addEventListener("blur", () => {
      const v = stripTags(fname.value.trim());
      fname.value = v;
      if (!v) {
        fname.setCustomValidity("First Name is required.");
        fnameErr.textContent = "First Name is required.";
      } else {
        fname.setCustomValidity("");
        fnameErr.textContent = "";
      }
    });
    fname.addEventListener("input", () => { fname.setCustomValidity(""); fnameErr.textContent = ""; });
  }

  if (lname && lnameErr) {
    lname.addEventListener("blur", () => {
      const v = stripTags(lname.value.trim());
      lname.value = v;
      if (!v) {
        lname.setCustomValidity("Last Name is required.");
        lnameErr.textContent = "Last Name is required.";
      } else if (!/^[A-Za-z'-]{1,30}$/.test(v)) {
        lname.setCustomValidity("Use letters, apostrophes, and dashes only.");
        lnameErr.textContent = "Only letters, apostrophes, and dashes allowed.";
      } else {
        lname.setCustomValidity("");
        lnameErr.textContent = "";
      }
    });
    lname.addEventListener("input", () => { lname.setCustomValidity(""); lnameErr.textContent = ""; });
  }

  if (mi && miErr) {
    mi.addEventListener("blur", () => {
      const v = stripTags(mi.value.trim());
      mi.value = v;
      if (!v) {
        mi.setCustomValidity("");
        miErr.textContent = "";
      } else if (!/^[A-Za-z]$/.test(v)) {
        mi.setCustomValidity("Middle Initial must be one letter or blank.");
        miErr.textContent = "Must be one letter or blank.";
      } else {
        mi.setCustomValidity("");
        miErr.textContent = "";
      }
    });
    mi.addEventListener("input", () => { mi.setCustomValidity(""); miErr.textContent = ""; });
  }

  // ===== Email =====
  if (email && emailErr) {
    email.addEventListener("blur", () => {
      const v = email.value.trim();
      if (!v) {
        email.setCustomValidity("Email is required.");
        emailErr.textContent = "Email is required.";
      } else if (!email.checkValidity()) {
        email.setCustomValidity("Please enter a valid email.");
        emailErr.textContent = "Please enter a valid email.";
      } else {
        email.setCustomValidity("");
        emailErr.textContent = "";
      }
    });
    email.addEventListener("input", () => { email.setCustomValidity(""); emailErr.textContent = ""; });
  }

  // ===== Phone auto-format =====
  function formatPhoneDigits(digits) {
    const d = digits.slice(0, 10);
    if (d.length <= 3) return d;
    if (d.length <= 6) return `${d.slice(0,3)}-${d.slice(3)}`;
    return `${d.slice(0,3)}-${d.slice(3,6)}-${d.slice(6)}`;
  }

  if (phone && phoneErr) {
    phone.addEventListener("input", () => {
      const digits = phone.value.replace(/\D/g, "");
      phone.value = formatPhoneDigits(digits);
      phone.setCustomValidity("");
      phoneErr.textContent = "";
    });
    phone.addEventListener("blur", () => {
      const digits = phone.value.replace(/\D/g, "");
      if (digits.length !== 10) {
        phone.setCustomValidity("Phone must be 10 digits (000-000-0000).");
        phoneErr.textContent = "Phone must be 10 digits (000-000-0000).";
      } else {
        phone.setCustomValidity("");
        phoneErr.textContent = "";
      }
    });
  }

  // ===== Medical ID: 5–20 alnum =====
  if (medicalId && medicalIdErr) {
    medicalId.addEventListener("blur", () => {
      const v = medicalId.value.trim();
      if (!v) {
        medicalId.setCustomValidity("Medical ID is required.");
        medicalIdErr.textContent = "Medical ID is required.";
      } else if (!/^[A-Za-z0-9]{5,20}$/.test(v)) {
        medicalId.setCustomValidity("Medical ID must be 5–20 letters/numbers.");
        medicalIdErr.textContent = "Must be 5–20 letters/numbers.";
      } else {
        medicalId.setCustomValidity("");
        medicalIdErr.textContent = "";
      }
    });
    medicalId.addEventListener("input", () => { medicalId.setCustomValidity(""); medicalIdErr.textContent = ""; });
  }

  // ===== Address/City/State/Zip minimal sanity checks =====
  if (address1 && addr1Err) {
    address1.addEventListener("blur", () => {
      const v = address1.value.trim();
      if (!v) {
        address1.setCustomValidity("Address Line 1 is required.");
        addr1Err.textContent = "Address Line 1 is required.";
      } else {
        address1.setCustomValidity("");
        addr1Err.textContent = "";
      }
    });
    address1.addEventListener("input", () => { address1.setCustomValidity(""); addr1Err.textContent = ""; });
  }

  if (address2 && addr2Err) {
    address2.addEventListener("blur", () => {
      const v = address2.value.trim();
      if (v && v.length < 2) {
        address2.setCustomValidity("If used, must be at least 2 characters.");
        addr2Err.textContent = "If used, must be at least 2 characters.";
      } else {
        address2.setCustomValidity("");
        addr2Err.textContent = "";
      }
    });
    address2.addEventListener("input", () => { address2.setCustomValidity(""); addr2Err.textContent = ""; });
  }

  if (city && cityErr) {
    city.addEventListener("blur", () => {
      const v = city.value.trim();
      if (!v) {
        city.setCustomValidity("City is required.");
        cityErr.textContent = "City is required.";
      } else {
        city.setCustomValidity("");
        cityErr.textContent = "";
      }
    });
    city.addEventListener("input", () => { city.setCustomValidity(""); cityErr.textContent = ""; });
  }

  if (state && stateErr) {
    state.addEventListener("blur", () => {
      const v = state.value;
      if (!v) {
        state.setCustomValidity("State is required.");
        stateErr.textContent = "State is required.";
      } else {
        state.setCustomValidity("");
        stateErr.textContent = "";
      }
    });
    state.addEventListener("change", () => { state.setCustomValidity(""); stateErr.textContent = ""; });
  }

  if (zip && zipErr) {
    zip.addEventListener("blur", () => {
      const v = zip.value.trim();
      if (!/^\d{5}$/.test(v)) {
        zip.setCustomValidity("Zip must be 5 digits.");
        zipErr.textContent = "Zip must be 5 digits.";
      } else {
        zip.setCustomValidity("");
        zipErr.textContent = "";
      }
    });
    zip.addEventListener("input", () => { zip.setCustomValidity(""); zipErr.textContent = ""; });
  }

  // ===== SSN optional + confirm =====
  function formatSSN(digits) {
    const d = digits.slice(0, 9);
    if (d.length <= 3) return d;
    if (d.length <= 5) return `${d.slice(0, 3)}-${d.slice(3)}`;
    return `${d.slice(0, 3)}-${d.slice(3, 5)}-${d.slice(5)}`;
  }

  function hideSsnConfirmControls() {
    if (!ssnConfirm) return;
    ssnConfirm.hidden = true;
    if (ssnYes) ssnYes.hidden = true;
    if (ssnNo) ssnNo.hidden = true;
    if (ssnEdit) ssnEdit.hidden = true;
  }

  if (ssn) {
    ssn.addEventListener("input", () => {
      const digits = ssn.value.replace(/\D/g, "").slice(0, 9);
      ssn.value = formatSSN(digits);
      if (digits.length === 0) {
        ssn.setCustomValidity("");
        if (ssnErr) ssnErr.textContent = "";
        hideSsnConfirmControls();
      } else if (digits.length < 9) {
        ssn.setCustomValidity("SSN must be 9 digits (123-45-6789).");
        if (ssnErr) ssnErr.textContent = "SSN must be 9 digits (123-45-6789).";
        hideSsnConfirmControls();
      } else {
        ssn.setCustomValidity("");
        if (ssnErr) ssnErr.textContent = "";
      }
    });

    ssn.addEventListener("blur", () => {
      const digits = ssn.value.replace(/\D/g, "");
      if (digits.length === 9 && ssnConfirm && ssnYes && ssnNo && ssnEdit) {
        const formatted = formatSSN(digits);
        ssn.value = formatted;
        ssn.readOnly = true;
        ssnConfirm.textContent = `SSN entered: ${formatted} — Is this correct?`;
        ssnConfirm.hidden = false;
        ssnYes.hidden = false;
        ssnNo.hidden = false;
        ssnEdit.hidden = true;
      }
    });

    if (ssnYes) {
      ssnYes.addEventListener("click", () => {
        ssn.readOnly = true;
        hideSsnConfirmControls();
      });
    }
    if (ssnNo && ssnEdit) {
      ssnNo.addEventListener("click", () => {
        ssn.readOnly = true;
        if (ssnConfirm) ssnConfirm.hidden = true;
        if (ssnYes) ssnYes.hidden = true;
        ssnNo.hidden = true;
        ssnEdit.hidden = false;
      });
      ssnEdit.addEventListener("click", () => {
        ssn.readOnly = false;
        hideSsnConfirmControls();
        ssn.focus();
      });
    }
  }

  // ===== User ID & passwords =====
  function validateUserID() {
    if (!userid || !userErr) return true;
    let value = stripTags(userid.value.trim());
    value = value.toLowerCase();
    userid.value = value;
    if (!value) {
      userid.setCustomValidity("User ID is required.");
      userErr.textContent = "User ID is required.";
      return false;
    }
    const pat = /^(?!\d)[a-z0-9_-]{5,20}$/;
    if (!pat.test(value)) {
      userid.setCustomValidity("User ID must be 5-20 chars, start with a letter, only letters/numbers/_/-.");
      userErr.textContent = "5-20 chars, start with a letter, only letters/numbers/_/-.";
      return false;
    }
    userid.setCustomValidity("");
    userErr.textContent = "";
    return true;
  }

  function checkPasswords() {
    if (!pw || !pw2 || !pwErr) return true;
    const p1 = pw.value;
    const p2 = pw2.value;
    const u = userid ? userid.value.trim().toLowerCase() : "";
    const f = fname ? fname.value.trim().toLowerCase() : "";
    const l = lname ? lname.value.trim().toLowerCase() : "";
    let msg = "";

    if (p1.length < 8) msg = "Password must be at least 8 characters long.";
    else if (p1.length > 30) msg = "Password cannot exceed 30 characters.";
    else if (!/[A-Z]/.test(p1)) msg = "Password must contain at least one uppercase letter.";
    else if (!/[a-z]/.test(p1)) msg = "Password must contain at least one lowercase letter.";
    else if (!/\d/.test(p1)) msg = "Password must contain at least one digit.";
    else if (!/[!@#%^&*()_+=\-\/><.,~`]/.test(p1))
      msg = "Password must contain at least one special character (!@#%^&*()_+=-/><.,~`).";
    else if (/"/.test(p1)) msg = "Password cannot contain double quotes (\").";

    if (!msg && u && p1.toLowerCase().includes(u)) msg = "Password cannot contain your User ID.";
    if (!msg && f && p1.toLowerCase().includes(f)) msg = "Password cannot contain your first name.";
    if (!msg && l && p1.toLowerCase().includes(l)) msg = "Password cannot contain your last name.";
    if (!msg && p2 && p1 !== p2) msg = "Passwords do not match. Please re-enter the same password.";

    if (msg) {
      pw2.setCustomValidity(msg);
      pwErr.textContent = msg;
      return false;
    }
    pw2.setCustomValidity("");
    pwErr.textContent = "";
    return true;
  }

  if (userid) {
    userid.addEventListener("blur", validateUserID);
    userid.addEventListener("input", () => {
      userid.setCustomValidity("");
      if (userErr) userErr.textContent = "";
      checkPasswords();
    });
  }
  if (pw && pw2) {
    pw.addEventListener("input", checkPasswords);
    pw2.addEventListener("input", checkPasswords);
    pw.addEventListener("blur", checkPasswords);
    pw2.addEventListener("blur", checkPasswords);
  }

  // ===== Sliders (health, salary, price range) =====
  function money(n) {
    return Number(n).toLocaleString(undefined, {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0
    });
  }

  function updateRangeOutput() {
    if (range && rangeOut) {
      rangeOut.textContent = `Health rating: ${range.value}/10`;
    }
  }
  function updateSalaryOutput() {
    if (salary && salaryOut) {
      salaryOut.textContent = money(salary.value);
    }
  }
  function updatePriceOutputs() {
    if (!priceMin || !priceMax) return;
    const minVal = Number(priceMin.value);
    const maxVal = Number(priceMax.value);
    if (priceOut) {
      priceOut.textContent = `${money(minVal)} – ${money(maxVal)}`;
    }
    if (priceDisplayValue) {
      priceDisplayValue.textContent = `${money(minVal)} to ${money(maxVal)}`;
    }
  }

  if (range) {
    updateRangeOutput();
    range.addEventListener("input", updateRangeOutput);
  }
  if (salary) {
    updateSalaryOutput();
    salary.addEventListener("input", updateSalaryOutput);
  }
  if (priceMin && priceMax) {
    updatePriceOutputs();
    priceMin.addEventListener("input", updatePriceOutputs);
    priceMax.addEventListener("input", updatePriceOutputs);
  }

  // ===== Cookie + LocalStorage behavior =====
  function buildFormSnapshot() {
    const snapshot = { savedAt: Date.now(), values: {}, remember: !!(rememberMe && rememberMe.checked) };
    NON_SECURE_IDS.forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      if (el.type === "radio") {
        // For userid etc this won't happen, but keep generic
        const checked = form.querySelector(`input[name="${el.name}"]:checked`);
        snapshot.values[el.name] = checked ? checked.value : "";
      } else {
        snapshot.values[id] = el.value;
      }
    });

    // Housing radio
    const housingChecked = form.querySelector('input[name="housing"]:checked');
    snapshot.values.housing = housingChecked ? housingChecked.value : "";

    // Vaccinated radio
    const vaccChecked = form.querySelector('input[name="vaccinated"]:checked');
    snapshot.values.vaccinated = vaccChecked ? vaccChecked.value : "";

    // Pain radio
    const painChecked = form.querySelector('input[name="pain"]:checked');
    snapshot.values.pain = painChecked ? painChecked.value : "";

    // Illness checkboxes (array)
    const illnessChecks = Array.from(form.querySelectorAll('input[name="illness"]:checked')).map(i => i.value);
    snapshot.values.illness = illnessChecks;

    return snapshot;
  }

  function saveFormToStorage(firstName) {
    if (!window.localStorage) return;
    const snap = buildFormSnapshot();
    snap.displayName = firstName || (fname ? fname.value.trim() : "");
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(snap));
  }

  function clearStorage() {
    if (window.localStorage) {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }

  function restoreFromStorageIfFresh() {
    if (!window.localStorage) return null;
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = safeParseJSON(raw);
    if (!data || !data.savedAt) {
      clearStorage();
      return null;
    }
    const age = Date.now() - data.savedAt;
    if (age > STORAGE_MAX_AGE_MS) {
      clearStorage();
      return null;
    }

    const v = data.values || {};
    NON_SECURE_IDS.forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      if (id in v) {
        el.value = v[id];
      }
    });

    // Radios & checkboxes
    if ("housing" in v) {
      const h = form.querySelector(`input[name="housing"][value="${v.housing}"]`);
      if (h) h.checked = true;
    }
    if ("vaccinated" in v) {
      const vc = form.querySelector(`input[name="vaccinated"][value="${v.vaccinated}"]`);
      if (vc) vc.checked = true;
    }
    if ("pain" in v) {
      const pc = form.querySelector(`input[name="pain"][value="${v.pain}"]`);
      if (pc) pc.checked = true;
    }

    if (Array.isArray(v.illness)) {
      form.querySelectorAll('input[name="illness"]').forEach(chk => {
        chk.checked = v.illness.includes(chk.value);
      });
    }

    // restore sliders derived label text
    updateRangeOutput();
    updateSalaryOutput();
    updatePriceOutputs();

    return data;
  }

  function applyWelcomeFromCookieAndStorage() {
    const savedName = getCookie("sccUserName");
    let usedName = savedName;
    let storageData = null;
    if (!savedName) {
      storageData = restoreFromStorageIfFresh();
      if (storageData && storageData.displayName) {
        usedName = storageData.displayName;
      }
    } else {
      storageData = restoreFromStorageIfFresh();
    }

    if (usedName && greetingText && notYouWrapper && notYouName) {
      greetingText.textContent = `Welcome back, ${usedName}!`;
      notYouName.textContent = usedName;
      notYouWrapper.style.display = "inline-block";
      if (rememberMe) rememberMe.checked = true;
    } else if (greetingText && notYouWrapper) {
      greetingText.textContent = "Welcome new user!";
      notYouWrapper.style.display = "none";
    }
  }

  function resetIdentity() {
    deleteCookie("sccUserName");
    clearStorage();
    form.reset();
    updateRangeOutput();
    updateSalaryOutput();
    updatePriceOutputs();
    if (greetingText && notYouWrapper) {
      greetingText.textContent = "Welcome new user!";
      notYouWrapper.style.display = "none";
    }
    if (notYouCheckbox) {
      notYouCheckbox.checked = false;
    }
  }

  applyWelcomeFromCookieAndStorage();

  if (notYouCheckbox) {
    notYouCheckbox.addEventListener("change", function () {
      if (this.checked) {
        resetIdentity();
      }
    });
  }

  function handleRememberMeAndPersist() {
    const firstName = fname ? fname.value.trim() : "";
    if (rememberMe && rememberMe.checked && firstName) {
      setCookie("sccUserName", firstName, 48); // 48 hours
      saveFormToStorage(firstName);
    } else {
      // user does not want to be remembered
      deleteCookie("sccUserName");
      clearStorage();
    }
  }

  // ===== Review & Data Grid =====
  function getRadioValue(name) {
    const el = form.querySelector(`input[name="${name}"]:checked`);
    return el ? el.value : "";
  }
  function getCheckboxValues(name) {
    return Array.from(form.querySelectorAll(`input[name="${name}"]:checked`)).map(i => i.value);
  }

  function buildReviewHTML() {
    const illnesses = getCheckboxValues("illness").join(", ") || "None selected";
    const pain = getRadioValue("pain") || "Not specified";
    const housing = getRadioValue("housing") || "Not specified";
    const vacc = getRadioValue("vaccinated") || "Not specified";

    const lines = [];
    lines.push(`<strong>Name:</strong> ${fname.value} ${mi.value} ${lname.value}`);
    lines.push(`<strong>DOB:</strong> ${dob.value}`);
    lines.push(`<strong>Email:</strong> ${email.value}`);
    lines.push(`<strong>Phone:</strong> ${phone.value}`);
    lines.push(`<strong>Medical ID:</strong> [hidden for privacy]`);
    lines.push(`<strong>Address:</strong> ${address1.value} ${address2.value}, ${city.value}, ${state.value} ${zip.value}`);
    lines.push(`<strong>Travel Date:</strong> ${travelDate.value}`);
    lines.push(`<strong>Move-in Date:</strong> ${moveInDate.value}`);
    lines.push(`<strong>Past Illnesses:</strong> ${illnesses}`);
    lines.push(`<strong>Health Rating:</strong> ${range.value}/10`);
    lines.push(`<strong>Pain Level:</strong> ${pain}`);
    lines.push(`<strong>Vaccinated:</strong> ${vacc}`);
    lines.push(`<strong>Housing:</strong> ${housing}`);
    lines.push(`<strong>Desired Salary:</strong> ${salaryOut.textContent}`);
    lines.push(`<strong>Home Price Range:</strong> ${priceDisplayValue.textContent}`);
    lines.push(`<strong>Symptoms:</strong> ${symptoms.value || "[none]"}`);
    lines.push(`<strong>Other Notes:</strong> ${otherNotes.value || "[none]"}`);
    lines.push(`<strong>User ID:</strong> ${userid.value}`);
    lines.push(`<strong>Remember Me:</strong> ${rememberMe && rememberMe.checked ? "Yes" : "No"}`);

    return "<ul>" + lines.map(li => `<li>${li}</li>`).join("") + "</ul>";
  }

  if (btnCheck && reviewPane && reviewBody) {
    btnCheck.addEventListener("click", () => {
      // Run all the custom checks we care about
      const ok =
        checkDob() &&
        checkFutureDate(travelDate, travelDateErr, "Travel date") &&
        checkFutureDate(moveInDate, moveInDateErr, "Move-in date") &&
        validateUserID() &&
        checkPasswords() &&
        form.reportValidity();

      if (!ok) {
        // browser will highlight invalid fields
        return;
      }
      reviewBody.innerHTML = buildReviewHTML();
      reviewPane.hidden = false;

      // If they checked remember, persist right away
      handleRememberMeAndPersist();
    });
  }

  if (btnGetData && dataGrid) {
    btnGetData.addEventListener("click", () => {
      const tbody = dataGrid.querySelector("tbody");
      tbody.innerHTML = "";

      const elements = Array.from(form.elements).filter(el => el.name && el.type !== "button" && el.type !== "submit" && el.type !== "reset");

      elements.forEach(el => {
        let value;
        if (el.type === "radio") {
          if (!el.checked) return; // only show checked radio
          value = el.value;
        } else if (el.type === "checkbox") {
          if (!el.checked) return;
          value = el.value;
        } else if (el.tagName.toLowerCase() === "select") {
          value = el.value;
        } else {
          value = el.value;
        }

        const tr = document.createElement("tr");
        const tdName = document.createElement("td");
        const tdType = document.createElement("td");
        const tdValue = document.createElement("td");

        tdName.textContent = el.name;
        tdType.textContent = el.type || el.tagName.toLowerCase();
        tdValue.textContent = value;

        tr.appendChild(tdName);
        tr.appendChild(tdType);
        tr.appendChild(tdValue);
        tbody.appendChild(tr);
      });
    });
  }

  // ===== Form submit handler =====
  form.addEventListener("submit", function (e) {
    // Run custom checks before default browser validation
    const ok =
      checkDob() &&
      checkFutureDate(travelDate, travelDateErr, "Travel date") &&
      checkFutureDate(moveInDate, moveInDateErr, "Move-in date") &&
      validateUserID() &&
      checkPasswords();

    if (!ok || !form.reportValidity()) {
      e.preventDefault();
      return;
    }

    // On successful submit, handle cookies + localStorage
    handleRememberMeAndPersist();
    // Allow navigation to thankyou-2.html
  });
});
