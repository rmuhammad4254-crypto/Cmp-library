const questions =
JSON.parse(localStorage.getItem("questions"));

const student =
JSON.parse(localStorage.getItem("student"));

const course_id =
localStorage.getItem("course_id");

let current = 0;

let time = 30 * 60;

let submitted = false;

const answers = {};

showQuestion();

buildNavigator();

startTimer();

function showQuestion(){

    const q = questions[current];

    document.getElementById("questionNumber").innerText =
    `Question ${current + 1} of ${questions.length}`;

    document.getElementById("question").innerText =
    q.question;

    document.getElementById("a").innerText =
    q.option_a;

    document.getElementById("b").innerText =
    q.option_b;

    document.getElementById("c").innerText =
    q.option_c;

    document.getElementById("d").innerText =
    q.option_d;

    document
    .querySelectorAll('input[name="answer"]')
    .forEach(r => r.checked = false);

    if(answers[q.id]){

        const selected =
        document.querySelector(
        `input[value="${answers[q.id]}"]`
        );

        if(selected){

            selected.checked = true;

        }

    }

    const progress =
    ((current + 1) / questions.length) * 100;

    document.getElementById("progressBar").style.width =
    progress + "%";

    updateNavigator();

}

function saveAnswer(){

    const selected =
    document.querySelector(
    'input[name="answer"]:checked'
    );

    if(selected){

        answers[
        questions[current].id
        ] = selected.value;

    }

}

function nextQuestion(){

    saveAnswer();

    if(current < questions.length - 1){

        current++;

        showQuestion();

    }

}

function previousQuestion(){

    saveAnswer();

    if(current > 0){

        current--;

        showQuestion();

    }

}

function buildNavigator(){

    const nav =
    document.getElementById("navigator");

    nav.innerHTML = "";

    for(let i = 0; i < questions.length; i++){

        nav.innerHTML += `

        <button
        id="q${i}"
        onclick="goQuestion(${i})">

        ${i + 1}

        </button>

        `;

    }

    updateNavigator();

}

function goQuestion(index){

    saveAnswer();

    current = index;

    showQuestion();

}

function updateNavigator(){

    for(let i = 0; i < questions.length; i++){

        const btn =
        document.getElementById(`q${i}`);

        if(!btn) continue;

        btn.style.background = "white";

        btn.style.color = "black";

        const qid =
        questions[i].id;

        if(answers[qid]){

            btn.style.background =
            "#28a745";

            btn.style.color =
            "white";

        }

    }

    const currentBtn =
    document.getElementById(`q${current}`);

    if(currentBtn){

        currentBtn.style.background =
        "#0d6efd";

        currentBtn.style.color =
        "white";

    }

}

function startTimer(){

    const timer =
    setInterval(function(){

        const minutes =
        Math.floor(time / 60);

        const seconds =
        time % 60;

        document.getElementById("timer").innerText =
        `${minutes}:${seconds.toString().padStart(2,"0")}`;

        time--;

        if(time < 0){

            clearInterval(timer);

            submitExam();

        }

    },1000);

}

async function submitExam(){

    if(submitted) return;

    submitted = true;

    saveAnswer();

    const confirmSubmit =
    confirm(
    "Are you sure you want to submit your examination?"
    );

    if(!confirmSubmit){

        submitted = false;

        return;

    }

    const questionIds =
    questions.map(q => q.id);

    const response =
    await fetch("/api/submit-exam",{

        method:"POST",

        headers:{

            "Content-Type":"application/json"

        },

        body:JSON.stringify({

            admission_no:
            student.admission_no,

            course_id:

            course_id,

            answers:

            answers,

            questionIds:

            questionIds

        })

    });

    const result =
    await response.json();

    if(result.success){

        alert(

`🎉 Examination Completed

Score: ${result.score}

Percentage: ${result.percentage}%

Congratulations!`

        );

        localStorage.removeItem("questions");

        window.location.href =
        "dashboard.html";

    }else{

        submitted = false;

        alert(result.message);

    }

}
