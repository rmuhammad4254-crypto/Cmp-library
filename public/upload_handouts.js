async function loadCourses(){

    const response = await fetch("/api/courses");

    const result = await response.json();

    const select = document.getElementById("course");

    select.innerHTML = "";


    if(result.success){

        result.courses.forEach(course=>{

            select.innerHTML += `

            <option value="${course.id}">

            ${course.course_code} -
            ${course.course_title}

            </option>

            `;

        });

    }

}


loadCourses();



const form =
document.getElementById("uploadForm");


form.addEventListener("submit", async(e)=>{


    e.preventDefault();


    const data = new FormData();


    data.append(
        "course_id",
        document.getElementById("course").value
    );


    data.append(
        "title",
        document.getElementById("title").value
    );


    data.append(
        "file",
        document.getElementById("pdf").files[0]
    );



    const response =
    await fetch("/api/library/upload",{

        method:"POST",

        body:data

    });


    const result =
    await response.json();


    document.getElementById("message").innerText =
    result.message;


});

