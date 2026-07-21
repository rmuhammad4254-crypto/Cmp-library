const form = document.getElementById("registerForm");

form.addEventListener("submit", async (event) => {

    event.preventDefault();

    const data = {

        admission_no:
            document.getElementById("admission_no").value,

        full_name:
            document.getElementById("full_name").value,

        department:
            document.getElementById("department").value,

        level:
            document.getElementById("level").value,

        password:
            document.getElementById("password").value

    };

    const response = await fetch("/api/register", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(data)

    });

    const result = await response.json();

    alert(result.message);

});
