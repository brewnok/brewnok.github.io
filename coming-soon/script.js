// Target: 13 September 2026, 12:00 AM IST (UTC+05:30)
const TARGET_TIMESTAMP = new Date("2026-09-13T00:00:00+05:30").getTime();

// Elements
const daysEl = document.getElementById("days");
const hoursEl = document.getElementById("hours");
const minutesEl = document.getElementById("minutes");
const secondsEl = document.getElementById("seconds");
const statusEl = document.getElementById("status");

const themeToggleBtn = document.getElementById("theme-toggle");
const notifyForm = document.getElementById("notify-form");
const emailInput = document.getElementById("email-input");
const formFeedback = document.getElementById("form-feedback");
const gcalLink = document.getElementById("gcal-link");
const icalBtn = document.getElementById("ical-btn");

// Helper to pad double digits
function pad(num) {
  return String(num).padStart(2, "0");
}

// Track previous values to trigger micro pop animation
const previousValues = {
  days: "",
  hours: "",
  minutes: "",
  seconds: ""
};

function updateElementWithAnimation(element, newValue, key) {
  if (previousValues[key] !== newValue) {
    element.textContent = newValue;
    element.classList.remove("pop-tick");
    // Trigger reflow to restart CSS animation
    void element.offsetWidth;
    element.classList.add("pop-tick");
    previousValues[key] = newValue;
  }
}

function updateCountdown() {
  const now = Date.now();
  const distance = TARGET_TIMESTAMP - now;

  if (distance <= 0) {
    daysEl.textContent = "00";
    hoursEl.textContent = "00";
    minutesEl.textContent = "00";
    secondsEl.textContent = "00";
    statusEl.textContent = "We’re officially live!";
    document.title = "We're Live! | Brewnok";
    return;
  }

  const totalSeconds = Math.floor(distance / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  updateElementWithAnimation(daysEl, pad(days), "days");
  updateElementWithAnimation(hoursEl, pad(hours), "hours");
  updateElementWithAnimation(minutesEl, pad(minutes), "minutes");
  updateElementWithAnimation(secondsEl, pad(seconds), "seconds");
}

// Theme Management
function initTheme() {
  const savedTheme = localStorage.getItem("brewnok_theme");
  if (savedTheme) {
    document.documentElement.setAttribute("data-theme", savedTheme);
  } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches) {
    document.documentElement.setAttribute("data-theme", "light");
  } else {
    document.documentElement.setAttribute("data-theme", "dark");
  }

  themeToggleBtn.addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("brewnok_theme", newTheme);
  });
}

// Calendar Integrations
function initCalendar() {
  // Target: 2026-09-13T00:00:00+05:30 is 2026-09-12T18:30:00Z
  const title = encodeURIComponent("Brewnok Official Launch");
  const details = encodeURIComponent("Brewnok is premiering today! Something new is brewing.");
  const location = encodeURIComponent("https://brewnok.com");
  const dates = "20260912T183000Z/20260912T193000Z";

  // Google Calendar URL
  gcalLink.href = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;

  // iCal (.ics) download
  icalBtn.addEventListener("click", () => {
    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Brewnok//Countdown//EN",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "BEGIN:VEVENT",
      "UID:launch-20260913T000000@brewnok.com",
      "DTSTAMP:20260907T120000Z",
      "DTSTART:20260912T183000Z",
      "DTEND:20260912T193000Z",
      "SUMMARY:Brewnok Official Launch",
      "DESCRIPTION:Brewnok is premiering today! Something new is brewing.",
      "LOCATION:https://brewnok.com",
      "STATUS:CONFIRMED",
      "END:VEVENT",
      "END:VCALENDAR"
    ].join("\r\n");

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "brewnok-launch.ics");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  });
}

// Waitlist / Notify Form
function initNotifyForm() {
  const savedEmail = localStorage.getItem("brewnok_subscribed_email");
  if (savedEmail) {
    emailInput.value = savedEmail;
    formFeedback.textContent = "✓ You are on the early-access list!";
    formFeedback.className = "form-feedback success";
  }

  notifyForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = emailInput.value.trim();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      formFeedback.textContent = "Please enter a valid email address.";
      formFeedback.className = "form-feedback error";
      emailInput.focus();
      return;
    }

    localStorage.setItem("brewnok_subscribed_email", email);
    formFeedback.textContent = "✦ You're on the list! We'll notify you first.";
    formFeedback.className = "form-feedback success";
  });
}

// Initialise Everything
document.addEventListener("DOMContentLoaded", () => {
  updateCountdown();
  setInterval(updateCountdown, 1000);
  initTheme();
  initCalendar();
  initNotifyForm();
});
