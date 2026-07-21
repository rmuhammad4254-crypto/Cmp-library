const form = document.getElementById("courseForm");

form.addEventListener("submit", async(e)=>{

    e.preventDefault();

    const data={

        course_code:document.getElementById("course_code").value,

        course_title:document.getElementById("course_title").value,

        department:document.getElementById("department").value,

        level:document.getElementById("level").value,

        semester:document.getElementById("semester").value

    };

    const response=await fetch("/api/course",{

        method:"POST",

        headers:{
            "Content-Type":"application/json"
        },

        body:JSON.stringify(data)

    });

    const result=await response.json();

    alert(result.message);

});
