const form = document.getElementById("myForm");
const submitButton = document.getElementById("submitButton");
const statusMessage = document.getElementById("status");

const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxwqQu_54O2-sJfcZ_Fguu5s7_jFppkHQwRvqPLE45AKFA1a4GV3fN92EhH1EG7JaTu0Q/exec";

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
