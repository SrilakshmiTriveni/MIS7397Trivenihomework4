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

// ----- Simple cookie helpers -----
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

// ===== Header date/time – live clock =====
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
