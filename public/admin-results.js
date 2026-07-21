loadResults();
async function searchResult(){

    const admission_no =
    document.getElementById("search").value;

    const response =
    await fetch("/api/search-results",{

        method:"POST",

        headers:{
            "Content-Type":"application/json"
        },

        body:JSON.stringify({

            admission_no

        })

    });

    const results =
    await response.json();

    const tbody =
    document.getElementById("results");

    tbody.innerHTML = "";

    results.forEach(r=>{

const percentage =
((r.score / r.total) * 100).toFixed(1);

tbody.innerHTML += `

<tr>

<td>${r.admission_no}</td>

<td>${r.course_code}</td>

<td>${r.course_title}</td>

<td>${r.score}/${r.total}</td>

<td>${percentage}%</td>

<td>${percentage >= 50 ? "✅ PASS" : "❌ FAIL"}</td>

<td>${r.submitted_at}</td>

</tr>

`;

    });

}


async function loadResults(){

    const response =
    await fetch("/api/all-results");

    const results =
    await response.json();

    const tbody =
    document.getElementById("results");

    tbody.innerHTML = "";

    results.forEach(r=>{

        const percentage =
((r.score / r.total) * 100).toFixed(1);

tbody.innerHTML += `

<tr>

<td>${r.admission_no}</td>

<td>${r.course_code}</td>

<td>${r.course_title}</td>

<td>${r.score}/${r.total}</td>

<td>${percentage}%</td>

<td>${percentage >= 50 ? "✅ PASS" : "❌ FAIL"}</td>

<td>${r.submitted_at}</td>

</tr>

`;

    });

}
