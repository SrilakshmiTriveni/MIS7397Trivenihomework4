/*
Program name: Script1.js
Author: Bolla Srilakshmi Triveni
Date created: 10-20-2025
Date last edited: 11-02-2025
Version: 2.7
Description: Full JS validation and review for homework3.html:
- Header date
- Live validation on input/blur
- DOB strict 120y rule
- ZIP strict 5 digits
- SSN format & confirm
- UserID/password rules
- Validate button, only show real Submit when NO errors.
*/

// ===== Header date/time (simple MM/DD/YYYY on the right) =====
(function () {
  try {
    const d = new Date();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const yyyy = d.getFullYear();
    const l1 = document.getElementById("todayLine1");
    const l2 = document.getElementById("todayLine2");
    if (l1) l1.textContent = `Today's date: ${mm}/${dd}/${yyyy}`;
    if (l2) l2.textContent = "";
  } catch (e) {}
})();

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("patientForm");
  if (!form) return; // allow Script1.js on thankyou-1.html safely

  // ---- Grab elements
  const fname = document.getElementById("fname"); const fnameErr = document.getElementById("fnameErr");
  const mi = document.getElementById("mi");       const miErr = document.getElementById("miErr");
  const lname = document.getElementById("lname"); const lnameErr = document.getElementById("lnameErr");

  const dob = document.getElementById("dob");     const dobErr = document.getElementById("dobErr");
  const travelDate = document.getElementById("travelDate"); const travelDateErr = document.getElementById("travelDateErr");
  const moveInDate = document.getElementById("moveInDate"); const moveInDateErr = document.getElementById("moveInDateErr");

  const email = document.getElementById("email"); const emailErr = document.getElementById("emailErr");
  const phone = document.getElementById("phone"); const phoneErr = document.getElementById("phoneErr");
  const pain = document.getElementById("pain");
  const symptoms = document.getElementById("symptoms");

  // SSN elements (optional)
  const ssn = document.getElementById("ssn");     const ssnErr = document.getElementById("ssnErr");
  const ssnConfirm = document.getElementById("ssnConfirm");
  const ssnYes = document.getElementById("ssnYes");
  const ssnNo  = document.getElementById("ssnNo");
  const ssnEdit= document.getElementById("ssnEdit");

  const medicalId = document.getElementById("medicalId"); const medicalIdErr = document.getElementById("medicalIdErr");

  const address1 = document.getElementById("address1"); const addr1Err = document.getElementById("addr1Err");
  const address2 = document.getElementById("address2"); const addr2Err = document.getElementById("addr2Err");
  const city = document.getElementById("city");         const cityErr = document.getElementById("cityErr");
  const state = document.getElementById("state");       const stateErr = document.getElementById("stateErr");
  const zip = document.getElementById("zip");           const zipErr = document.getElementById("zipErr");

  const range = document.getElementById("range"); const rangeOut = document.getElementById("range-slider");

  const userid = document.getElementById("userid"); const userErr = document.getElementById("userErr");

  const pw = document.getElementById("pw");
  const pw2 = document.getElementById("pw2"); const pwErr = document.getElementById("pwErr");

  // Salary / price sliders
  const salary = document.getElementById("salary"); const salaryOut = document.getElementById("salaryOut");
  const priceMin = document.getElementById("priceMin");
  const priceMax = document.getElementById("priceMax");
  const priceOut = document.getElementById("priceOut");
  const priceDisplayValue = document.getElementById("priceDisplayValue");

  const validateBtn  = document.getElementById("btnValidate");
  const reviewPane = document.getElementById("reviewPane");
  const reviewBody = document.getElementById("reviewBody");

  // ===== HTML Tag Prevention =====
  const preventHTMLTags = (input) => input.replace(/[<>]/g, '');

  (function setupHTMLTagPrevention() {
    const textInputs = form.querySelectorAll('input[type="text"], input[type="email"], textarea');
    textInputs.forEach(input => {
      input.addEventListener('input', function () {
        this.value = preventHTMLTags(this.value);
      });
    });

    const notes = document.getElementById("otherNotes");
    if (notes) {
      notes.addEventListener("input", () => {
        notes.value = notes.value.replace(/"/g, "");
      });
    }

    if (symptoms) {
      symptoms.addEventListener("input", () => {
        symptoms.value = symptoms.value.replace(/[<>]/g, "").replace(/"/g, "");
      });
    }
  })();

  // ===== Date helpers and range computation =====
  function calculateDateRanges() {
    const today = new Date();
    const minBirthDate = new Date(today.getFullYear() - 120, today.getMonth(), today.getDate());
    const minFutureDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return { minBirthDate, minFutureDate, today };
  }
  const toMMDDYYYY = (dt) => {
    const mm = String(dt.getMonth() + 1).padStart(2, '0');
    const dd = String(dt.getDate()).padStart(2, '0');
    const yyyy = dt.getFullYear();
    return `${mm}/${dd}/${yyyy}`;
  };
  const addYears = (dt, years) => new Date(dt.getFullYear() + years, dt.getMonth(), dt.getDate());
  const addDays  = (dt, days)  => new Date(dt.getFullYear(), dt.getMonth(), dt.getDate() + days);

  function setDataMinMax(el, minDate, maxDate) {
    if (!el) return;
    if (minDate) el.setAttribute('data-min', toMMDDYYYY(minDate));
    if (maxDate) el.setAttribute('data-max', toMMDDYYYY(maxDate));
  }
  function parseMMDDYYYY(v) {
    const m = v.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (!m) return null;
    const [, mm, dd, yyyy] = m;
    const d = new Date(Number(yyyy), Number(mm) - 1, Number(dd));
    return (d && d.getMonth() === Number(mm) - 1 && d.getDate() === Number(dd) && d.getFullYear() === Number(yyyy)) ? d : null;
  }
  function checkAgainstDataRange(el, errEl, label) {
    const raw = (el.value || "").trim();
    const val = parseMMDDYYYY(raw);
    if (!val) return true;
    const minStr = el.getAttribute('data-min');
    const maxStr = el.getAttribute('data-max');
    const min = minStr ? parseMMDDYYYY(minStr) : null;
    const max = maxStr ? parseMMDDYYYY(maxStr) : null;
    if (min && val < min) {
      const msg = `${label} cannot be before ${minStr}.`;
      el.setCustomValidity(msg); if (errEl) errEl.textContent = msg; return false;
    }
    if (max && val > max) {
      const msg = `${label} cannot be after ${maxStr}.`;
      el.setCustomValidity(msg); if (errEl) errEl.textContent = msg; return false;
    }
    return true;
  }

  (function setDynamicDateRanges() {
    const { today, minBirthDate } = calculateDateRanges();
    const dobMin = minBirthDate;
    const dobMax = today;
    const tomorrow = addDays(today, 1);
    const futureMax = addYears(today, 2);

    setDataMinMax(dob, dobMin, dobMax);
    setDataMinMax(travelDate, tomorrow, futureMax);
    setDataMinMax(moveInDate, tomorrow, futureMax);

    dob.title = `Birthday cannot be in the future and cannot be 120 years ago or earlier (must be after ${toMMDDYYYY(dobMin)} and on/before ${toMMDDYYYY(dobMax)}). Format: MM/DD/YYYY`;
    travelDate.title = `Travel date must be after today. Allowed: ${toMMDDYYYY(tomorrow)} to ${toMMDDYYYY(futureMax)}. Format: MM/DD/YYYY`;
    moveInDate.title = `Move-in date must be after today. Allowed: ${toMMDDYYYY(tomorrow)} to ${toMMDDYYYY(futureMax)}. Format: MM/DD/YYYY`;
  })();

  // ===== Helpers =====
  const money = (n) => n.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 });
  const getRadio = (name) => {
    const el = form.querySelector(`input[name="${name}"]:checked`);
    return el ? el.value : "";
  };
  const getChecks = (name) => Array.from(form.querySelectorAll(`input[name="${name}"]:checked`)).map(i => i.value);
  const first5Zip = (raw) => {
    const m = (raw || "").match(/\d{5}/);
    return m ? m[0] : "";
  };

  // ===== SSN format + confirm (optional) =====
  const formatSSN = (digits) => {
    const d = digits.slice(0, 9);
    if (d.length <= 3) return d;
    if (d.length <= 5) return `${d.slice(0, 3)}-${d.slice(3)}`;
    return `${d.slice(0, 3)}-${d.slice(3, 5)}-${d.slice(5)}`;
  };
  function hideAllSsnControls() {
    if (!ssnConfirm) return;
    ssnConfirm.hidden = ssnYes.hidden = ssnNo.hidden = ssnEdit.hidden = true;
  }
  function showConfirmLine(formatted) {
    if (!ssnConfirm) return;
    ssnConfirm.textContent = `SSN entered: ${formatted} — Is this correct?`;
    ssnConfirm.hidden = ssnYes.hidden = ssnNo.hidden = false;
    ssnEdit.hidden = true;
  }
  function lockAndHide() {
    if (!ssn) return;
    ssn.readOnly = true;
    ssn.dataset.confirmed = "true";
    hideAllSsnControls();
  }
  function showEditOnly() {
    if (!ssn) return;
    ssn.readOnly = true;
    ssn.dataset.confirmed = "false";
    ssnConfirm.hidden = true;
    ssnYes.hidden = true;
    ssnNo.hidden = true;
    ssnEdit.hidden = false;
  }
  function unlockForEdit() {
    if (!ssn) return;
    ssn.readOnly = false;
    ssn.dataset.confirmed = "false";
    hideAllSsnControls();
    ssn.focus();
  }
  function updateSSN() {
    if (!ssn) return;
    const digits = ssn.value.replace(/\D/g, "").slice(0, 9);
    ssn.value = formatSSN(digits);
    if (digits.length === 9) {
      ssn.setCustomValidity("");
      if (ssnErr) ssnErr.textContent = "";
    } else if (digits.length === 0) {
      ssn.setCustomValidity("");
      if (ssnErr) ssnErr.textContent = "";
      hideAllSsnControls();
      ssn.dataset.confirmed = "false";
    } else {
      ssn.setCustomValidity("SSN must be 9 digits (e.g., 123-45-6789).");
      if (ssnErr) ssnErr.textContent = "SSN must be 9 digits (e.g., 123-45-6789).";
      hideAllSsnControls();
    }
  }
  if (ssn) {
    ssn.addEventListener("input", updateSSN);
    ssn.addEventListener("blur", () => {
      const digits = ssn.value.replace(/\D/g, "");
      if (digits.length === 9) {
        const formatted = formatSSN(digits);
        ssn.value = formatted;
        ssn.readOnly = true;
        showConfirmLine(formatted);
      }
    });
    ssnYes?.addEventListener("click", () => {
      const digits = ssn.value.replace(/\D/g, "");
      if (digits.length === 9) lockAndHide();
    });
    ssnNo?.addEventListener("click", showEditOnly);
    ssnEdit?.addEventListener("click", unlockForEdit);
  }

  // ===== User ID =====
  const validateUserID = () => {
    let value = userid.value.trim();
    userid.value = value.toLowerCase();
    value = userid.value;
    if (!value) {
      userid.setCustomValidity("User ID is required.");
      userErr.textContent = "User ID is required.";
      return false;
    }
    const pat = /^(?!\d)[a-z0-9_-]{5,20}$/;
    if (!pat.test(value)) {
      if (value.length < 5 || value.length > 20) {
        userid.setCustomValidity("User ID must be 5-20 characters.");
        userErr.textContent = "Must be 5-20 characters.";
      } else if (/^\d/.test(value)) {
        userid.setCustomValidity("User ID must start with a letter.");
        userErr.textContent = "Must start with a letter.";
      } else if (/\s/.test(value)) {
        userid.setCustomValidity("User ID cannot contain spaces.");
        userErr.textContent = "No spaces allowed.";
      } else if (/[^a-z0-9_-]/.test(value)) {
        userid.setCustomValidity("Only letters, numbers, underscore, dash.");
        userErr.textContent = "Only letters, numbers, _, - allowed.";
      } else {
        userid.setCustomValidity("Invalid User ID format.");
        userErr.textContent = "Invalid format.";
      }
      return false;
    }
    userid.setCustomValidity("");
    userErr.textContent = "";
    return true;
  };
  userid.addEventListener("input", validateUserID);
  userid.addEventListener("blur", validateUserID);

  // ===== Passwords =====
  const checkPasswords = () => {
    let msg = "";
    const u = userid.value.trim().toLowerCase();
    const f = fname.value.trim().toLowerCase();
    const l = lname.value.trim().toLowerCase();
    const p1 = pw.value;
    const p2 = pw2.value;

    if (p1.length < 8) msg = "Password must be at least 8 characters long.";
    else if (p1.length > 30) msg = "Password cannot exceed 30 characters.";
    else if (!/(?=.*[A-Z])/.test(p1)) msg = "Password must contain at least one uppercase letter (A-Z).";
    else if (!/(?=.*[a-z])/.test(p1)) msg = "Password must contain at least one lowercase letter (a-z).";
    else if (!/(?=.*\d)/.test(p1)) msg = "Password must contain at least one digit (0-9).";
    else if (!/(?=.*[!@#%^&*()_+=\-\/><.,~`])/.test(p1))
      msg = "Password must contain at least one special character (!@#%^&*()_+=-/><.,~`).";
    else if (/"/.test(p1)) msg = "Password cannot contain double quotes (\").";

    if (!msg) {
      if (u && p1.toLowerCase().includes(u)) msg = "Password cannot contain your User ID.";
      else if (f && p1.toLowerCase().includes(f)) msg = "Password cannot contain your first name.";
      else if (l && p1.toLowerCase().includes(l)) msg = "Password cannot contain your last name.";
    }
    if (!msg && p2 && p1 !== p2) msg = "Passwords do not match. Please re-enter the same password.";

    if (msg) {
      pw2.setCustomValidity(msg);
      pwErr.textContent = msg;
    } else {
      pw2.setCustomValidity("");
      pwErr.textContent = "";
    }
  };
  pw.addEventListener("input", checkPasswords);
  pw2.addEventListener("input", checkPasswords);
  pw.addEventListener("blur", checkPasswords);
  pw2.addEventListener("blur", checkPasswords);
  userid.addEventListener("input", () => {
    userErr.textContent = "";
    checkPasswords();
  });

  // ===== MI =====
  const formatMI = () => {
    mi.value = preventHTMLTags(mi.value);
    const v = mi.value.trim();
    if (v === "") {
      mi.setCustomValidity("");
      miErr.textContent = "";
      return;
    }
    if (!/^[A-Za-z]$/.test(v)) {
      mi.setCustomValidity("Middle Initial must be exactly one letter (A–Z) or blank.");
      miErr.textContent = "Must be one letter or blank.";
    } else {
      mi.setCustomValidity("");
      miErr.textContent = "";
    }
  };
  mi.addEventListener("input", formatMI);
  mi.addEventListener("blur", formatMI);

  // ===== Last Name =====
  const validateLastName = () => {
    const value = preventHTMLTags(lname.value.trim());
    lname.value = value;
    if (!value) {
      lname.setCustomValidity("Last Name is required.");
      lnameErr.textContent = "Last Name is required.";
      return false;
    }
    const pattern = /^[A-Za-z'-]{1,30}$/;
    if (!pattern.test(value)) {
      lname.setCustomValidity("Last Name: Use letters, apostrophes, and dashes only.");
      lnameErr.textContent = "Only letters, apostrophes, and dashes allowed.";
      return false;
    }
    if (value.length > 30) {
      lname.setCustomValidity("Last Name must be 1-30 characters.");
      lnameErr.textContent = "Must be 1-30 characters.";
      return false;
    }
    lname.setCustomValidity("");
    lnameErr.textContent = "";
    return true;
  };
  lname.addEventListener("input", validateLastName);
  lname.addEventListener("blur", validateLastName);

  // ===== DOB / Travel / Move-in =====
  function validateDOB() {
    const value = preventHTMLTags(dob.value.trim());
    dob.value = value;
    const pattern = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/((19|20)\d{2})$/;
    if (!value) {
      dob.setCustomValidity("Date of Birth is required.");
      dobErr.textContent = "Date of Birth is required.";
      return false;
    }
    if (!pattern.test(value)) {
      dob.setCustomValidity("Please use MM/DD/YYYY format.");
      dobErr.textContent = "Please use MM/DD/YYYY format.";
      return false;
    }

    const [m, d, y] = value.split('/').map(Number);
    const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if (m === 2) {
      const leap = (y % 4 === 0 && y % 100 !== 0) || (y % 400 === 0);
      if (d > (leap ? 29 : 28)) {
        dob.setCustomValidity("Invalid day for February.");
        dobErr.textContent = "Invalid day for February.";
        return false;
      }
    } else if (d > daysInMonth[m - 1]) {
      dob.setCustomValidity("Invalid date.");
      dobErr.textContent = "Invalid date.";
      return false;
    }

    const { minBirthDate, today } = calculateDateRanges();
    const birthDate = new Date(y, m - 1, d);

    if (birthDate > today) {
      dob.setCustomValidity("Birthday cannot be in the future.");
      dobErr.textContent = "Birthday cannot be in the future.";
      return false;
    }
    if (birthDate <= minBirthDate) {
      dob.setCustomValidity("Date of birth can't be 120 years ago or earlier.");
      dobErr.textContent = "Date of birth can't be 120 years ago or earlier.";
      return false;
    }

    if (!checkAgainstDataRange(dob, dobErr, "Date of Birth")) return false;

    dob.setCustomValidity("");
    dobErr.textContent = "";
    return true;
  }

  function validateFutureDateGeneric(el, errEl, label) {
    const value = preventHTMLTags(el.value.trim());
    el.value = value;
    const pattern = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/((19|20)\d{2})$/;
    if (!value) {
      el.setCustomValidity(`${label} is required.`);
      if (errEl) errEl.textContent = `${label} is required.`;
      return false;
    }
    if (!pattern.test(value)) {
      el.setCustomValidity("Please use MM/DD/YYYY format.");
      if (errEl) errEl.textContent = "Please use MM/DD/YYYY format.";
      return false;
    }

    const [m, d, y] = value.split('/').map(Number);
    const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if (m === 2) {
      const leap = (y % 4 === 0 && y % 100 !== 0) || (y % 400 === 0);
      if (d > (leap ? 29 : 28)) {
        el.setCustomValidity("Invalid day for February.");
        if (errEl) errEl.textContent = "Invalid day for February.";
        return false;
      }
    } else if (d > daysInMonth[m - 1]) {
      el.setCustomValidity("Invalid date.");
      if (errEl) errEl.textContent = "Invalid date.";
      return false;
    }

    const { minFutureDate } = calculateDateRanges();
    const date = new Date(y, m - 1, d);
    if (date <= minFutureDate) {
      el.setCustomValidity(`${label} must be after today.`);
      if (errEl) errEl.textContent = `${label} must be after today.`;
      return false;
    }

    if (!checkAgainstDataRange(el, errEl, label)) return false;

    el.setCustomValidity("");
    if (errEl) errEl.textContent = "";
    return true;
  }
  const validateTravelDate = () => validateFutureDateGeneric(travelDate, travelDateErr, "Travel date");
  const validateMoveInDate = () => validateFutureDateGeneric(moveInDate, moveInDateErr, "Move-in date");

  function setupDateAutoFormat(el) {
    el.addEventListener("input", function () {
      let v = preventHTMLTags(this.value.replace(/\D/g, ''));
      if (v.length >= 2) v = v.substring(0, 2) + '/' + v.substring(2);
      if (v.length >= 5) v = v.substring(0, 5) + '/' + v.substring(5, 9);
      this.value = v;
    });
  }
  setupDateAutoFormat(dob);
  setupDateAutoFormat(travelDate);
  setupDateAutoFormat(moveInDate);
  dob.addEventListener("blur", validateDOB);
  travelDate.addEventListener("blur", validateTravelDate);
  moveInDate.addEventListener("blur", validateMoveInDate);

  // ===== Medical ID =====
  const validateMedicalId = () => {
    const value = preventHTMLTags(medicalId.value.trim());
    medicalId.value = value;
    if (!value) {
      medicalId.setCustomValidity("Medical ID is required.");
      medicalIdErr.textContent = "Medical ID is required.";
      return false;
    }
    if (!/^[A-Za-z0-9]{5,20}$/.test(value)) {
      medicalId.setCustomValidity("Medical ID must be 5-20 alphanumeric characters.");
      medicalIdErr.textContent = "Must be 5-20 letters/numbers.";
      return false;
    }
    medicalId.setCustomValidity("");
    medicalIdErr.textContent = "";
    return true;
  };
  medicalId.addEventListener("input", validateMedicalId);
  medicalId.addEventListener("blur", validateMedicalId);

  // ===== State =====
  const validateState = () => {
    if (!state.value) {
      state.setCustomValidity("Please select a state.");
      stateErr.textContent = "Please select a state.";
      return false;
    }
    state.setCustomValidity("");
    stateErr.textContent = "";
    return true;
  };
  state.addEventListener("change", validateState);
  state.addEventListener("blur", validateState);

  // ===== Email =====
  function validateEmail() {
    let value = preventHTMLTags(email.value.trim());
    value = value.toLowerCase();
    email.value = value;
    const pat = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!value) {
      email.setCustomValidity("Email is required.");
      emailErr.textContent = "Email is required.";
      return false;
    }
    if (!pat.test(value)) {
      email.setCustomValidity("Use format: name@domain.tld");
      emailErr.textContent = "Use format: name@domain.tld";
      return false;
    }
    email.setCustomValidity("");
    emailErr.textContent = "";
    return true;
  }
  email.addEventListener("input", validateEmail);
  email.addEventListener("blur", validateEmail);

  // ===== Phone =====
  const formatPhone = (d) => (
    d.length <= 3
      ? d
      : d.length <= 6
        ? `${d.slice(0, 3)}-${d.slice(3)}`
        : `${d.slice(0, 3)}-${d.slice(3, 6)}-${d.slice(6, 10)}`
  );
  function updatePhone() {
    const digits = preventHTMLTags(phone.value.replace(/\D/g, "")).slice(0, 10);
    phone.value = formatPhone(digits);
    if (digits.length === 10) {
      phone.setCustomValidity("");
      phoneErr.textContent = "";
    }
  }
  function validatePhoneOnBlur() {
    const digits = phone.value.replace(/\D/g, "");
    if (digits.length !== 10) {
      phone.setCustomValidity("Phone must be exactly 10 digits in format 000-000-0000.");
      phoneErr.textContent = "Must be 10 digits: 000-000-0000";
    } else {
      phone.setCustomValidity("");
      phoneErr.textContent = "";
    }
  }
  phone.addEventListener("input", updatePhone);
  phone.addEventListener("blur", validatePhoneOnBlur);

  // ===== Address =====
  const validateAddress1 = () => {
    const value = preventHTMLTags(address1.value.trim());
    address1.value = value;
    if (!value) {
      address1.setCustomValidity("Address Line 1 is required.");
      addr1Err.textContent = "Address Line 1 is required.";
      return false;
    }
    if (value.length < 2 || value.length > 30) {
      address1.setCustomValidity("Address Line 1 must be 2-30 characters.");
      addr1Err.textContent = "Must be 2-30 characters.";
      return false;
    }
    address1.setCustomValidity("");
    addr1Err.textContent = "";
    return true;
  };
  const validateAddress2 = () => {
    const value = preventHTMLTags(address2.value.trim());
    address2.value = value;
    if (value && (value.length < 2 || value.length > 30)) {
      address2.setCustomValidity("If provided, Address Line 2 must be 2-30 characters.");
      addr2Err.textContent = "If entered, 2–30 chars.";
      return false;
    }
    address2.setCustomValidity("");
    addr2Err.textContent = "";
    return true;
  };
  const validateCity = () => {
    const value = preventHTMLTags(city.value.trim());
    city.value = value;
    if (!value) {
      city.setCustomValidity("City is required.");
      cityErr.textContent = "City is required.";
      return false;
    }
    if (value.length < 2 || value.length > 30) {
      city.setCustomValidity("City must be 2-30 characters.");
      cityErr.textContent = "Must be 2-30 characters.";
      return false;
    }
    city.setCustomValidity("");
    cityErr.textContent = "";
    return true;
  };
  address1.addEventListener("blur", validateAddress1);
  address2.addEventListener("blur", validateAddress2);
  city.addEventListener("blur", validateCity);

  // ===== ZIP =====
  const validateZip = () => {
    const value = preventHTMLTags(zip.value.trim());
    zip.value = value;
    if (!value) {
      zip.setCustomValidity("ZIP Code is required.");
      zipErr.textContent = "ZIP Code is required.";
      return false;
    }
    const pat = /^\d{5}$/;
    if (!pat.test(value)) {
      zip.setCustomValidity("Use 12345 format (5 digits).");
      zipErr.textContent = "Use 12345 format (5 digits).";
      return false;
    }
    zip.setCustomValidity("");
    zipErr.textContent = "";
    return true;
  };
  zip.addEventListener("input", validateZip);
  zip.addEventListener("blur", validateZip);

  // ===== Range & Money =====
  const updateRange = () => {
    rangeOut.textContent = `Current: ${range.value}`;
  };
  range.addEventListener("input", updateRange);
  updateRange();

  function updateSalary() {
    salaryOut.textContent = `${money(Number(salary.value))} / year`;
  }
  function updatePrice() {
    let minV = Number(priceMin.value);
    let maxV = Number(priceMax.value);
    if (minV > maxV) {
      maxV = minV;
      priceMax.value = maxV;
    }
    const text = `${money(minV)} – ${money(maxV)}`;
    if (priceOut) priceOut.textContent = text;
    if (priceDisplayValue) priceDisplayValue.textContent = text;
  }
  salary.addEventListener("input", updateSalary);
  priceMin.addEventListener("input", updatePrice);
  priceMax.addEventListener("input", updatePrice);
  updateSalary();
  updatePrice();

  // ===== Review / Validate panel =====
  const prettyPhone = (raw) => {
    const d = (raw || "").replace(/\D/g, "");
    if (d.length !== 10) return raw || "(not provided)";
    return `(${d.slice(0, 3)}) -${d.slice(3, 6)}-${d.slice(6)}`;
  };
  const yn = (b) => (b ? "Y" : "N");

  function buildReview() {
    // Run validations/normalizations so pass/error show correctly
    updatePhone();
    validateZip();
    validateEmail();
    formatMI();
    validateLastName();
    checkPasswords();
    validateDOB();
    validateTravelDate();
    validateMoveInDate();
    validateAddress1();
    validateAddress2();
    validateCity();
    validateState();
    validateMedicalId();
    validateUserID();

    const firstValid = fname.checkValidity() && mi.checkValidity() && lname.checkValidity();
    const dobValid = dob.checkValidity();
    const travelValid = travelDate.checkValidity();
    const moveInValid = moveInDate.checkValidity();
    const emailValid = email.checkValidity();
    const phoneValid = phone.checkValidity();
    const address1Valid = address1.checkValidity();
    const address2Valid = address2.checkValidity();
    const cityValid = city.checkValidity();
    const stateValid = state.checkValidity();
    const zipValid = zip.checkValidity();
    const userOk = userid.checkValidity();
    const medOk = medicalId.checkValidity();
    const pwOk = pw.checkValidity() && pw2.checkValidity() && !pwErr.textContent;

    const allValid =
      firstValid && dobValid && travelValid && moveInValid &&
      emailValid && phoneValid && address1Valid && address2Valid &&
      cityValid && stateValid && zipValid && userOk && medOk && pwOk;

    const first = fname.value.trim();
    const mid   = mi.value.trim();
    const last  = lname.value.trim();

    const housingVal    = getRadio("housing");
    const vaccinatedVal = getRadio("vaccinated");
    const illnesses     = getChecks("illness");
    const has = (name) => illnesses.includes(name);

    const phonePretty = prettyPhone(phone.value);
    const zip5 = first5Zip(zip.value);

    const addrLines = [
      address1.value.trim() || "(missing)",
      address2.value.trim(),
      `${city.value.trim() || "(city?)"}, ${state.value || "(state?)"} ${zip5 || "(zip?)"}`
    ].filter(Boolean);

    const notesVal = (document.getElementById("otherNotes")?.value.trim() || "(none)")
      .replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const painVal = getRadio("pain") || "(not selected)";
    const symptomsVal = (symptoms?.value.trim() || "(none)")
      .replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

    const actionControls = allValid
      ? `
        <button type="button" class="btn-review" id="btnReviewSubmit">SUBMIT</button>
        <input type="reset" value="START OVER" />
      `
      : `
        <div style="margin-top:10px; font-weight:700; color:#b00020; text-align:center;">
          Please fix the errors highlighted above before you can submit.
        </div>
        <input type="reset" value="START OVER" />
      `;

    reviewBody.innerHTML = `
      <div style="text-align:center;font-weight:700;margin-bottom:10px;">PLEASE REVIEW THIS INFORMATION</div>

      <div class="rev-row">
        <span class="rev-key">First, MI, Last Name</span><span class="rev-sep">:</span>
        <span class="rev-val">${first} ${mid} ${last}</span>
        <span class="rev-status ${firstValid ? 'ok' : 'err'}">
          ${firstValid ? 'pass' : 'ERROR: Check name formats'}
        </span>
      </div>

      <div class="rev-row">
        <span class="rev-key">Date of Birth</span><span class="rev-sep">:</span>
        <span class="rev-val">${dob.value || "(not selected)"}</span>
        <span class="rev-status ${dobValid ? 'ok' : 'err'}">
          ${dobValid ? 'pass' : 'ERROR: Invalid or out of range'}
        </span>
      </div>

      <div class="rev-row">
        <span class="rev-key">Travel Date</span><span class="rev-sep">:</span>
        <span class="rev-val">${travelDate.value || "(not selected)"}</span>
        <span class="rev-status ${travelValid ? 'ok' : 'err'}">
          ${travelValid ? 'pass' : 'ERROR: Must be after today'}
        </span>
      </div>

      <div class="rev-row">
        <span class="rev-key">Move-In Date</span><span class="rev-sep">:</span>
        <span class="rev-val">${moveInDate.value || "(not selected)"}</span>
        <span class="rev-status ${moveInValid ? 'ok' : 'err'}">
          ${moveInValid ? 'pass' : 'ERROR: Must be after today'}
        </span>
      </div>

      <div class="rev-row">
        <span class="rev-key">Email address</span><span class="rev-sep">:</span>
        <span class="rev-val">${email.value.trim()}</span>
        <span class="rev-status ${emailValid ? 'ok' : 'err'}">
          ${emailValid ? 'pass' : 'ERROR: Invalid email'}
        </span>
      </div>

      <div class="rev-row">
        <span class="rev-key">Phone number</span><span class="rev-sep">:</span>
        <span class="rev-val">${phonePretty}</span>
        <span class="rev-status ${phoneValid ? 'ok' : 'err'}">
          ${phoneValid ? 'pass' : 'ERROR: Format 000-000-0000'}
        </span>
      </div>

      <div class="rev-row">
        <span class="rev-key">Address</span><span class="rev-sep">:</span>
        <span class="rev-val" style="white-space:pre-line;">
${addrLines.join('\n')}
        </span>
        <span class="rev-status ${address1Valid && address2Valid && cityValid && stateValid && zipValid ? 'ok' : 'err'}">
          ${address1Valid && address2Valid && cityValid && stateValid && zipValid ? 'pass' : 'ERROR: Check address fields / ZIP'}
        </span>
      </div>

      <div style="margin:14px 0 6px; font-weight:700; text-align:center;">REQUESTED INFO</div>

      <div class="rev-row"><span class="rev-key">Chicken Pox</span><span class="rev-sep">:</span><span class="rev-val">${yn(has("Chicken Pox"))}</span></div>
      <div class="rev-row"><span class="rev-key">Measles</span><span class="rev-sep">:</span><span class="rev-val">${yn(has("Measles"))}</span></div>
      <div class="rev-row"><span class="rev-key">Mumps</span><span class="rev-sep">:</span><span class="rev-val">${yn(has("Mumps"))}</span></div>
      <div class="rev-row"><span class="rev-key">Heart Disease</span><span class="rev-sep">:</span><span class="rev-val">${yn(has("Heart Disease"))}</span></div>
      <div class="rev-row"><span class="rev-key">Diabetic</span><span class="rev-sep">:</span><span class="rev-val">${yn(has("Diabetic"))}</span></div>
      <div class="rev-row"><span class="rev-key">Covid-19</span><span class="rev-sep">:</span><span class="rev-val">${yn(has("Covid-19"))}</span></div>

      <div class="rev-row"><span class="rev-key">Housing</span><span class="rev-sep">:</span><span class="rev-val">${housingVal || "(not selected)"}</span></div>
      <div class="rev-row"><span class="rev-key">Vaccinated</span><span class="rev-sep">:</span><span class="rev-val">${vaccinatedVal || "(not selected)"}</span></div>
      <div class="rev-row"><span class="rev-key">Level of Pain indicated</span><span class="rev-sep">:</span><span class="rev-val">${painVal}</span></div>
      <div class="rev-row"><span class="rev-key">Described Symptoms</span><span class="rev-sep">:</span><span class="rev-val">${symptomsVal}</span></div>

      <div class="rev-row">
        <span class="rev-key">Other notes</span><span class="rev-sep">:</span>
        <span class="rev-val">${notesVal}</span>
      </div>

      <div class="rev-row">
        <span class="rev-key">User ID</span><span class="rev-sep">:</span>
        <span class="rev-val">${userid.value.trim().toLowerCase()}</span>
        <span class="rev-status ${userOk ? 'ok' : 'err'}">
          ${userOk ? 'pass' : 'ERROR: Check format'}
        </span>
      </div>

      <div class="rev-row">
        <span class="rev-key">Password</span><span class="rev-sep">:</span>
        <span class="rev-val">${pw.value.replace(/</g, "&lt;").replace(/>/g, "&gt;")} <em>(normally we wouldn’t display this)</em></span>
        <span class="rev-status ${pwOk ? 'ok' : 'err'}">
          ${pwOk ? 'pass' : 'ERROR: Strength / match / contains name or id'}
        </span>
      </div>

      <div style="margin-top:14px; display:flex; gap:12px; justify-content:center; flex-wrap:wrap;">
        ${actionControls}
      </div>
    `;

    const submitBtn = document.getElementById("btnReviewSubmit");
    if (submitBtn) {
      submitBtn.addEventListener("click", () => form.requestSubmit());
    }

    reviewPane.hidden = false;
    reviewPane.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  validateBtn.addEventListener("click", buildReview);

  // ===== Submit guard =====
  form.addEventListener("submit", (e) => {
    userid.value = userid.value.trim().toLowerCase();

    const ok =
      validateDOB() && validateTravelDate() && validateMoveInDate() &&
      validateAddress1() && validateAddress2() && validateCity() &&
      validateZip() && validateEmail() && validateUserID() &&
      validateLastName() && validateState() && validateMedicalId();

    if (ssn) {
      const ssnDigits = ssn.value.replace(/\D/g, "");
      if (ssnDigits.length === 9 && ssn.dataset.confirmed !== "true") {
        e.preventDefault();
        ssn.readOnly = true;
        if (ssnErr) ssnErr.textContent = "Please confirm your SSN.";
        if (ssnConfirm) {
          ssnConfirm.textContent = `SSN entered: ${ssn.value} — Is this correct?`;
          ssnConfirm.hidden = false;
          ssnYes.hidden = false;
          ssnNo.hidden = false;
          ssnEdit.hidden = true;
        }
        return;
      }
    }

    if (!form.checkValidity() || !ok) {
      e.preventDefault();
      form.reportValidity();
    }
  });
});
