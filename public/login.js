// ==============================
// CMP Library Login
// ==============================

const form = document.getElementById("loginForm");
const loginBtn = document.getElementById("loginBtn");
const message = document.getElementById("message");

// ==============================
// Login
// ==============================

form.addEventListener("submit", async function (e) {

    e.preventDefault();

    message.style.display = "none";

    loginBtn.disabled = true;
    loginBtn.innerHTML = "⏳ Logging in...";

    const data = {

        admission_no: document.getElementById("admission_no").value.trim(),

        password: document.getElementById("password").value

    };

    try{

        const response = await fetch("/api/login",{

            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify(data)

        });

        const result = await response.json();

        loginBtn.disabled = false;
        loginBtn.innerHTML = "Login";

        if(result.success){

            message.style.display = "block";
            message.className = "success";
            message.innerHTML = "✅ Login successful!";

            localStorage.setItem(
                "student",
                JSON.stringify(result.user)
            );

            setTimeout(function(){

                if(result.user.role === "admin"){

                    window.location.href = "/admin.html";

                }else{

                    window.location.href = "/dashboard.html";

                }

            },1000);

        }else{

            message.style.display = "block";
            message.className = "error";
            message.innerHTML = "❌ " + result.message;

        }

    }catch(err){

        loginBtn.disabled = false;
        loginBtn.innerHTML = "Login";

        message.style.display = "block";
        message.className = "error";
        message.innerHTML = "⚠ Unable to connect to the server.";

    }

});


// ==============================
// Show / Hide Password
// ==============================

const togglePassword =
document.getElementById("togglePassword");

const password =
document.getElementById("password");

togglePassword.addEventListener("click", function(){

    if(password.type === "password"){

        password.type = "text";

        togglePassword.innerHTML = "🙈";

    }else{

        password.type = "password";

        togglePassword.innerHTML = "👁️";

    }

});
