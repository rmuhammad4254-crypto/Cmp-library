const student = JSON.parse(localStorage.getItem("student"));
loadStudent();

async function loadStudent(){

    const response = await fetch("/api/student-profile",{

        method:"POST",

        headers:{
            "Content-Type":"application/json"
        },

        body:JSON.stringify({

            admission_no:student.admission_no

        })

    });

    const result = await response.json();

    if(result.success){

        const s = result.student;

        document.getElementById("welcome").innerText =
        "Welcome, " + s.full_name;

        document.getElementById("admission").innerText =
        s.admission_no;

        document.getElementById("level").innerText =
        s.level;

        if(s.profile_image){

            document.getElementById("profileImage").src =
            "/uploads/profile/" + s.profile_image;

        }

    }

}

loadProfile();

async function loadProfile(){

    const response = await fetch("/api/student-profile",{

        method:"POST",

        headers:{
            "Content-Type":"application/json"
        },

        body:JSON.stringify({
            admission_no: student.admission_no
        })

    });

    const result = await response.json();

    if(result.success){

        const s = result.student;

        document.getElementById("welcome").innerText =
        "Welcome, " + s.full_name;

        document.getElementById("admission").innerText =
        s.admission_no;

        document.getElementById("department").innerText =
        s.department;

        document.getElementById("level").innerText =
        s.level;


        if(s.profile_image){

            document.getElementById("dashboardProfileImage").src =
            "/uploads/profile/" + s.profile_image;
 }

    }

}

document.getElementById("welcome").innerText =
"Welcome, " + student.full_name;

document.getElementById("admission").innerText =
student.admission_no;

document.getElementById("department").innerText =
student.department;

document.getElementById("level").innerText =
student.level;

loadCourses();

async function loadCourses(){

    const response = await fetch("/api/my-courses",{

        method:"POST",

        headers:{
            "Content-Type":"application/json"
        },

        body:JSON.stringify({

            department:student.department,

            level:student.level

        })

    });

    const courses = await response.json();
    alert(JSON.stringify(courses));
    const list = document.getElementById("courseList");

    list.innerHTML = "";

    courses.forEach(course=>{

        list.innerHTML += `

<div class="card">

<h3>${course.course_code}</h3>

<p>${course.course_title}</p>


<button onclick="openLibrary(${course.id})">

📖 Handouts

</button>


<button onclick="startCBT(${course.id})">

📝 Start CBT

</button>


</div>

`;
    });

}

function startCBT(courseId){

    localStorage.setItem("course_id",courseId);

    window.location.href="/cbt.html";

}

function openLibrary(courseId){

    localStorage.setItem(
        "course_id",
        courseId
    );

    window.location.href="/library.html";

}
function logout(){

    localStorage.clear();

    window.location.href = "/login.html";
}
