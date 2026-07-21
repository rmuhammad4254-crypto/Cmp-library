loadStats();


async function loadStats(){

    const response =
    await fetch("/api/dashboard-stats");

    const stats =
    await response.json();

    document.getElementById("students").innerText =
    stats.students;

    document.getElementById("courses").innerText =
    stats.courses;

    document.getElementById("questions").innerText =
    stats.questions;

    document.getElementById("exams").innerText =
    stats.exams;

}

async function loadFiles(){

    const response = await fetch("/uploads");

    const files = await response.text();


    document.getElementById("fileList").innerHTML = files;

}


loadFiles();
document.getElementById("uploadBtn").onclick = () => {

    window.location.href = "upload.html";

};

document.getElementById("resultsBtn").onclick = () => {

    window.location.href = "admin-results.html";

};

document.getElementById("logoutBtn").onclick = () => {

    localStorage.clear();

    window.location.href = "login.html";

};

loadDashboard();

async function loadDashboard() {

    const response = await fetch("/api/admin/dashboard");

    const result = await response.json();

    if (!result.success) return;

    document.getElementById("students").innerText =
        result.students;

    document.getElementById("courses").innerText =
        result.courses;

    document.getElementById("questions").innerText =
        result.questions;

    document.getElementById("handouts").innerText =
        result.handouts;

}
