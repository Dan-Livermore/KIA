const form = document.getElementById("form-kia");
const submitButton = document.getElementById("submitButton");
const statusMessage = document.getElementById("status");

const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbx8Pm_taFzeY5wdWw2_SV1ouh0tFlSXS1GXVeSEbDXLgQiQPElmMglsFOCTPIK8B5A/exec";

let dealers = [];
let cars = [];
let bookings = [];

window.addEventListener("load", () =>{
  const backgroundImages = [
    "Assets/EV2Exterior1.jpg",
    "Assets/EV2Exterior2.jpg",
    "Assets/EV2Exterior3.jpg",
  ];

  const random = Math.floor(Math.random() * 3);
  document.body.style.backgroundImage = `url(${backgroundImages[random]})`;
});

// Formats a Date for a datetime-local input
function formatDateTimeLocal(date) {
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60000);
  return localDate.toISOString().slice(0, 16);
}

// Set default values when the page loads
window.addEventListener("load", () => {
  const start = new Date(Date.now()); //+ 1800000); // 30 mins from now
  const end = new Date(start.getTime() + 1800000); // 30 mins after start

  document.getElementById("start-time").value =
    formatDateTimeLocal(start);

  document.getElementById("end-time").value =
    formatDateTimeLocal(end);
});

// Keep end time valid when start time changes
document.getElementById("start-time").addEventListener("change", () => {
  const startTime = new Date(
    document.getElementById("start-time").value
  ).getTime();

  const endTimeInput = document.getElementById("end-time");
  const endTime = new Date(endTimeInput.value).getTime();

  // Move end time forward if less than 30 minutes
  if (endTime < startTime + 1800000) {
    endTimeInput.value = formatDateTimeLocal(
      new Date(startTime + 1800000)
    );
  }
});


form.addEventListener("submit", async function (event) {
  event.preventDefault();

  submitButton.disabled = true;
  submitButton.textContent = "Submitting...";
  statusMessage.textContent = "";

  if (!(await validateForm())){
    submitButton.disabled = false;
    submitButton.textContent = "Submit";
    return;
  };

  const submission = {
    dealer: document.getElementById("dealer").value.trim(),
    car: document.getElementById("car").value.trim(),
    customer: document.getElementById("customer").value.trim(),
    starttime: document.getElementById("start-time").value.trim(),
    endtime: document.getElementById("end-time").value.trim(),
  };

  try {
    const response = await fetch(APPS_SCRIPT_URL, {
      method: "POST",

      body: JSON.stringify(submission),
    });

    const result = await response.json();

    if (result.success) {
      statusMessage.textContent =
        "Thank you! Your submission has been received.";

      form.reset();
    } else {
      throw new Error(result.error || "Submission failed.");
    }
  } catch (error) {
    console.error("Submission error:", error);

    statusMessage.textContent =
      "Sorry, something went wrong. Please try again.";
  }

  submitButton.disabled = false;
statusMessage.style.color = "green";
  submitButton.textContent = "Submit";
});

async function loadDealers() {
  try {
    const response = await fetch("./dealers.json");
    dealers = await response.json();

    const dealerInput = document.getElementById("dealer");
    const results = document.getElementById("results");

    dealerInput.addEventListener("input", () => {
      const search = dealerInput.value.toLowerCase().trim();

      results.innerHTML = "";

      if (search.length < 2) {
        return;
      }

      const matches = dealers
        .filter((dealer) => dealer.name.toLowerCase().includes(search))
        .slice(0, 10);

      matches.forEach((dealer) => {
        const div = document.createElement("div");
        div.className = "result-item";
        div.textContent = dealer.name;

        div.addEventListener("click", () => {
          dealerInput.value = dealer.name;
          results.innerHTML = "";
        });

        results.appendChild(div);
      });
    });

    document.addEventListener("click", (e) => {
      if (e.target !== dealerInput && !results.contains(e.target)) {
        results.innerHTML = "";
      }
    });
  } catch (error) {
    console.error("Failed to load dealers:", error);
  }
}
document.addEventListener("DOMContentLoaded", loadDealers);

async function loadCars() {
  try {
    const response = await fetch("./cars.json");
    cars = await response.json();

    const carInput = document.getElementById("car");
    const results = document.getElementById("car-results");

    carInput.addEventListener("click", () => {
      results.innerHTML = "";

      cars.forEach((car) => {
        const div = document.createElement("div");
        div.className = "result-item";
        div.textContent = car.name;

        div.addEventListener("click", () => {
          carInput.value = car.name;
          results.innerHTML = "";
        });

        results.appendChild(div);
      });
    });

    document.addEventListener("click", (e) => {
      if (e.target !== carInput && !results.contains(e.target)) {
        results.innerHTML = "";
      }
    });
  } catch (error) {
    console.error("Failed to load cars:", error);
  }
}
document.addEventListener("DOMContentLoaded", loadCars);
