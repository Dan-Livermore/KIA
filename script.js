const form = document.getElementById("myForm");

form.addEventListener("submit", async (event) => {

    event.preventDefault();

    const data = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value
    };

    try {

        await fetch(
            "https://script.google.com/macros/s/AKfycbwxGVSCTvuqQst6rqg_lvyheqAZn3jVgmWpr0ZYu1ocTQFIhs8_Nl9COFm1oe02Pt4wuA/exec",
            {
                method: "POST",
                mode: "no-cors",
                body: JSON.stringify(data)
            }
        );

        alert("Submitted!");

        form.reset();

    } catch (error) {

        console.error(error);

        alert("Something went wrong.");

    }

});