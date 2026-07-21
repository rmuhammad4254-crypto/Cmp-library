const express = require("express");
const router = express.Router();

const multer = require("multer");
const path = require("path");

const runSQL = require("../utils/database");


// Storage for handouts
const storage = multer.diskStorage({

    destination:function(req,file,cb){

        cb(null,"uploads/");

    },


    filename:function(req,file,cb){

        const name =
        Date.now()+"-"+file.originalname;

        cb(null,name);

    }

});


const upload = multer({
    storage:storage
});



// Upload Handout

router.post(
"/upload",
upload.single("file"),
async(req,res)=>{


try{


const {
    course_id,
    title
}=req.body;


if(!req.file){

return res.json({

success:false,

message:"No PDF uploaded"

});

}



await runSQL(`

INSERT INTO handouts
(
course_id,
title,
file
)

VALUES
(
'${course_id}',
'${title}',
'${req.file.filename}'
);
`);

res.json({

success:true,

message:"Handout uploaded successfully"

});



}catch(err){


res.json({

success:false,

message:err.message

});


}


});





// Get handouts for students

router.get("/:course_id", async(req,res)=>{


try{


const handouts = await runSQL(`

SELECT *

FROM handouts

WHERE course_id='${req.params.course_id}';

`);



res.json({

success:true,

handouts:handouts

});



}catch(err){


res.json({

success:false,

message:err.message

});


}


});


module.exports = router;
