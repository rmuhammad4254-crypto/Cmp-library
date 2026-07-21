const student =
JSON.parse(localStorage.getItem("student"));

loadResults();

async function loadResults(){

    const response = await fetch("/api/my-results",{

        method:"POST",

        headers:{
            "Content-Type":"application/json"
        },

        body:JSON.stringify({

            admission_no: student.admission_no

        })

    });

    const results = await response.json();

    const tbody =
    document.getElementById("results");

    tbody.innerHTML = "";

    results.forEach(r=>{

        const percentage =
        ((r.score/r.total)*100).toFixed(1);

        tbody.innerHTML += `

<tr>

<td>${r.course_id}</td>

<td>${r.score}</td>

<td>${r.total}</td>

<td>${percentage}%</td>

<td>${percentage>=50?"✅ PASS":"❌ FAIL"}</td>

<td>${r.submitted_at}</td>

</tr>

`;

    });

}
