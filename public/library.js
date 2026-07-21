const courseId =
localStorage.getItem("course_id");


loadHandouts();



async function loadHandouts(){


const response =
await fetch("/api/library/" + courseId);



const result =
await response.json();



const box =
document.getElementById("handouts");


box.innerHTML="";



if(result.success && result.handouts.length){


result.handouts.forEach(handout=>{


box.innerHTML += `

<div>

<h3>
${handout.title}
</h3>


<a href="/uploads/${handout.filename}" target="_blank">

Open PDF

</a>


</div>

`;

});


}else{


box.innerHTML =
"No handouts available yet";


}


}
