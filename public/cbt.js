const student = JSON.parse(localStorage.getItem("student"));

const course_id = localStorage.getItem("course_id");

loadCourse();

async function loadCourse(){

    const response = await fetch("/api/courses");

    const courses = await response.json();

    const course = courses.find(c=>c.id==course_id);

    document.getElementById("courseCode").innerText =
    course.course_code;

    document.getElementById("courseTitle").innerText =
    course.course_title;

    document.getElementById("department").innerText =
    student.department;

    document.getElementById("level").innerText =
    student.level;

    loadQuestions();

}

async function loadQuestions(){

    const response = await fetch("/api/cbt",{

        method:"POST",

        headers:{
            "Content-Type":"application/json"
        },

        body:JSON.stringify({

            course_id

        })

    });

    const questions = await response.json();

    localStorage.setItem(
        "questions",
        JSON.stringify(questions)
    );

    document.getElementById("totalQuestions").innerText =
    questions.length;

}

function startExam(){

window.location.href="/exam.html";
}
