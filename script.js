const form = document.getElementById("form-kia");
const submitButton = document.getElementById("submitButton");
const statusMessage = document.getElementById("status");

const APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbx8Pm_taFzeY5wdWw2_SV1ouh0tFlSXS1GXVeSEbDXLgQiQPElmMglsFOCTPIK8B5A/exec";

let dealers = [];
let cars = [];

form.addEventListener("submit", async function (event) {
  event.preventDefault();

  submitButton.disabled = true;
  submitButton.textContent = "Submitting...";
  statusMessage.textContent = "";

  validateForm();

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
  submitButton.textContent = "Submit";
});

function validateForm() {
//   validatesEmpty();
//   validateDuplicates();
//   validateDealers();
//   validateCars();
  if (!validateCustomers()){
    submitButton.disabled = false;
    submitButton.textContent = "Submit";
    return;
  }
//   validateStartTime();
//   validateEndTime();
}

function validateEmpty() {
  // no field is empty
}

function validateDuplicates() {
  // dealer + customer + car doesnt already exist
}

function validateDealers() {
  // Dealer on list
}

function validateCars() {
  // Car on list
}

function validateCustomers() {
  // Get customer data from form
  const customerFormInput = document.getElementById("customer");
  let customer = customerFormInput.value.trim();

  // Customer Name doesn't contain non letters
  const validChars = /^[A-Za-z\s'-]+$/;
  if (!validChars.test(customer)) {
    statusMessage.textContent(
      "Customer name can only include letters, spaces, apostrophies and hyphens.",
    );
    return false;
  }

  // Customer Name must exist
  if (customer.length === 0) {
    statusMessage.textContent("Please enter a customer name.");
    return false;
  }

  //Customer Name must be shorter than 100 characters
  if (customer.length > 100) {
    statusMessage.textContent("Customer name must be under 100 characters.");
    return false;
  }

  // Capitalise
  customer = customer.toLowerCase().split(" ").map(word => word.charAt(0).toUpperCase() + word.substring(1)).join(' ');
  customerFormInput.value = customer;
  //customer = customer.replace(/^(mr|mrs|miss|ms|mx|dr)\s+/i, "");

  return true;
}

function validateStartTime() {
  // Start time not in past
}

function validateEndTime() {
  // End time is not before start time
}

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
