const form =
document.getElementById("courseForm");

form.addEventListener("submit", async function(e){

    e.preventDefault();

    const response =
await fetch("/api/admin/add-course",{
        method:"POST",

        headers:{
            "Content-Type":"application/json"
        },

        body:JSON.stringify({

            course_code:
            document.getElementById("course_code").value,

            course_title:
            document.getElementById("course_title").value,

            department:
            document.getElementById("department").value,

            level:
            document.getElementById("level").value,

            semester:
document.getElementById("semester").value
        })

    });

    const result =
    await response.json();

    const message =
    document.getElementById("message");

    message.innerHTML =
    result.message;

    if(result.success){

        message.style.color="green";

        form.reset();

    }else{

        message.style.color="red";

    }

});
