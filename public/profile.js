const student = JSON.parse(localStorage.getItem("student"));

let cropper;

loadProfile();

async function loadProfile(){

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

        document.getElementById("studentName").innerText = s.full_name;
        document.getElementById("admission").innerText = s.admission_no;
        document.getElementById("department").innerText = s.department;
        document.getElementById("level").innerText = s.level;

        if(s.profile_image){

            document.getElementById("profileImage").src =
            "/uploads/profile/" + s.profile_image;

        }

    }

}

document.getElementById("imageInput").addEventListener("change", function(e){

    const file = e.target.files[0];

    if(!file) return;

    const reader = new FileReader();

    reader.onload = function(event){

        const image = document.getElementById("cropImage");

        image.src = event.target.result;

        document.getElementById("cropContainer").style.display = "block";

        if(cropper){

            cropper.destroy();

        }

        cropper = new Cropper(image,{

            aspectRatio:1,

            viewMode:1,

            dragMode:"move",

            autoCropArea:1,

            responsive:true

        });

    };

    reader.readAsDataURL(file);

});

async function cropAndUpload(){

    const canvas = cropper.getCroppedCanvas({

        width:300,

        height:300

    });

    canvas.toBlob(async function(blob){

        const formData = new FormData();

        formData.append("photo", blob, "profile.png");

        formData.append(
            "admission_no",
            student.admission_no
        );

        const response = await fetch("/api/upload-profile",{

            method:"POST",

            body:formData

        });

        const result = await response.json();

        if(result.success){

            alert("Profile picture updated successfully.");

            loadProfile();

            document.getElementById("cropContainer").style.display = "none";

        }else{

            alert(result.message);

        }

    });

}
