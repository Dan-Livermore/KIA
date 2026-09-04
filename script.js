const form = document.getElementById("form-kia");
const submitButton = document.getElementById("submitButton");
const statusMessage = document.getElementById("status");

const APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbx8Pm_taFzeY5wdWw2_SV1ouh0tFlSXS1GXVeSEbDXLgQiQPElmMglsFOCTPIK8B5A/exec";

form.addEventListener("submit", async function (event) {
  event.preventDefault();

  submitButton.disabled = true;
  submitButton.textContent = "Submitting...";
  statusMessage.textContent = "";

  const submission = {
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

const data = [
  {
    car: "Fast Car",
    customer: "Mr Smith",
    startTime: "2026-09-03 09:14",
    endTime: "2026-09-03 12:36",
  },
  {
    car: "Blue Car",
    customer: "Mrs Jones",
    startTime: "2026-09-03 13:14",
    endTime: "2026-09-03 13:48",
  },
  {
    car: "Red Car",
    customer: "John Doe",
    startTime: "2026-09-04 14:00",
    endTime: "2026-09-04 15:00",
  },
];

buildTable(data);

function buildTable(data) {
  if (!data.length) return;

  const table = document.getElementById("table");
  const thead = table.querySelector("thead");
  const tbody = table.querySelector("tbody");

  thead.innerHTML = "";
  tbody.innerHTML = "";

  const headers = Object.keys(data[0]);

const headerRow = document.createElement("tr");

headerRow.innerHTML = `
                      <th>Car Name</th>
                      <th>Customer Name</th>
                      <th>Start Time</th>
                      <th>End Time</th>
                      <th>Delete</th>
                      `;

thead.appendChild(headerRow);

  data.forEach((item) => {
    const row = document.createElement("tr");

    headers.forEach((header) => {
      const td = document.createElement("td");
      if (header === "startTime" || header === "endTime") {
        td.textContent = new Date(item[header]).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'});
      } else {
        td.textContent = item[header];
      }
      row.appendChild(td);
    });

    tbody.appendChild(row);
  });
}
