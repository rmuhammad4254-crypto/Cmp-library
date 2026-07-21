let allCourses = [];

loadCourses();

async function loadCourses(){

    const response = await fetch("/api/courses");

    const result = await response.json();

    if(result.success){

        allCourses = result.courses;

        displayCourses(allCourses);

    }

}

function displayCourses(courses){

    const table = document.getElementById("courseTable");

    table.innerHTML = "";

    courses.forEach(course=>{

        table.innerHTML += `

        <tr>

            <td>${course.course_code}</td>

            <td>${course.course_title}</td>

            <td>${course.department}</td>

            <td>${course.level}</td>

            <td>${course.unit}</td>

            <td>

                <button
                class="delete"
                onclick="deleteCourse(${course.id})">

                Delete

                </button>

            </td>

        </tr>

        `;

    });

}

async function deleteCourse(id){

    if(!confirm("Delete this course?")){

        return;

    }

    const response = await fetch(`/api/courses/${id}`,{

        method:"DELETE"

    });

    const result = await response.json();

    alert(result.message);

    loadCourses();

}

document
.getElementById("search")
.addEventListener("keyup",function(){

    const keyword =
    this.value.toLowerCase();

    const filtered =
    allCourses.filter(course=>

        course.course_code
        .toLowerCase()
        .includes(keyword)

        ||

        course.course_title
        .toLowerCase()
        .includes(keyword)

        ||

        course.department
        .toLowerCase()
        .includes(keyword)

    );

    displayCourses(filtered);

});
