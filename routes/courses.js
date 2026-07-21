const express = require("express");
const router = express.Router();
const runSQL = require("../utils/database");


// Get courses
router.get("/", async(req,res)=>{

    try{

        const courses = await runSQL(`
            SELECT *
            FROM courses;
        `);

        res.json({
            success:true,
            courses:courses
        });

    }catch(err){

        res.json({
            success:false,
            message:err.message
        });

    }

});



// Add course
router.post("/add", async(req,res)=>{

    try{

        const {
            course_code,
            course_title,
            department,
            level,
            unit
        } = req.body;


        await runSQL(`

        INSERT INTO courses
        (
            course_code,
            course_title,
            department,
            level,
            semester
        )

        VALUES
        (
            '${course_code}',
            '${course_title}',
            '${department}',
            '${level}',
            '${unit}'
        );

        `);


        res.json({

            success:true,

            message:"Course added successfully"

        });


    }catch(err){

        res.json({

            success:false,

            message:err.message

        });

    }

});


module.exports = router;
