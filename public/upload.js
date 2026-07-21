async function loadCourses(){

    const response = await fetch("/api/courses");

    const result = await response.json();

    const select = document.getElementById("course");

    select.innerHTML = "";


    if(result.success){

        result.courses.forEach(course => {

            select.innerHTML += `

            <option value="${course.id}">

            ${course.course_code} - ${course.course_title}

            </option>

            `;

        });

    }else{

        select.innerHTML = `
        <option>
        No courses available
        </option>
        `;

    }

}


loadCourses();



const form =
document.getElementById("uploadForm");


form.addEventListener("submit", async(e)=>{


    e.preventDefault();


    const file =
    document.getElementById("pdf").files[0];


    const course_id =
    document.getElementById("course").value;


    const formData =
    new FormData();


    formData.append(
        "file",
        file
    );


    formData.append(
        "course_id",
        course_id
    );



    const response =
    await fetch("/upload",{

        method:"POST",

        body:formData

    });



    const result =
    await response.json();



    const message =
    document.getElementById("message");


    message.innerText =
    result.message;


});
