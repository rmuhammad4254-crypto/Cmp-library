const form = document.getElementById("signupForm");

form.addEventListener("submit", async function(e){

    e.preventDefault();

    const password =
    document.getElementById("password").value;

    const confirm =
    document.getElementById("confirm_password").value;

    if(password !== confirm){

        alert("Passwords do not match.");

        return;

    }

    const response = await fetch("/api/register",{

        method:"POST",

        headers:{
            "Content-Type":"application/json"
        },

        body:JSON.stringify({

            full_name:
            document.getElementById("full_name").value,

            admission_no:
            document.getElementById("admission_no").value,

            department:
            document.getElementById("department").value,

            level:
            document.getElementById("level").value,

            password:
            password

        })

    });

    const result =
    await response.json();

    alert(result.message);

    if(result.success){

        window.location.href =
        "login.html";

    }

});
