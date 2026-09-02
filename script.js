const form = document.getElementById("form-kia");

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const data = Object.fromEntries(
        new FormData(form).entries()
    );

    // Convert the data object to JSON
    const json = JSON.stringify(data, null, 2);

    // Create a file from the JSON
    const blob = new Blob([json], {
        type: "application/json"
    });

    // Create a temporary download link
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "schedule.json";

    // Download the file
    link.click();

    // Clean up
    URL.revokeObjectURL(url);
});
