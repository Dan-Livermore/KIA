const form = document.getElementById("myForm");

form.addEventListener("submit", async (event) => {

    event.preventDefault();

    const data = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value
    };

    try {

        await fetch(
            "https://script.google.com/macros/s/AKfycbxwqQu_54O2-sJfcZ_Fguu5s7_jFppkHQwRvqPLE45AKFA1a4GV3fN92EhH1EG7JaTu0Q/exec",
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