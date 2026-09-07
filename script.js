const form = document.getElementById("form-kia");
const submitButton = document.getElementById("submitButton");
const statusMessage = document.getElementById("status");

const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbx8Pm_taFzeY5wdWw2_SV1ouh0tFlSXS1GXVeSEbDXLgQiQPElmMglsFOCTPIK8B5A/exec";

form.addEventListener("submit", async function (event) {
  event.preventDefault();

  submitButton.disabled = true;
  submitButton.textContent = "Submitting...";
  statusMessage.textContent = "";

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


let dealers = [];

async function loadDealers() {
    try {
        const response = await fetch("dealers.json");
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
                .filter(dealer =>
                    dealer.name.toLowerCase().includes(search)
                )
                .slice(0, 10);

            matches.forEach(dealer => {
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
            if (
                e.target !== dealerInput &&
                !results.contains(e.target)
            ) {
                results.innerHTML = "";
            }
        });

    } catch (error) {
        console.error("Failed to load dealers:", error);
    }
}

document.addEventListener("DOMContentLoaded", loadDealers);