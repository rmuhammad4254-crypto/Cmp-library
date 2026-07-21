
const express = require("express");
const router = express.Router();
const runSQL = require("../utils/database");

// Add Course
// Add Course
router.post("/add-course", async (req, res) => {

    try {

        const {
            course_code,
            course_title,
            department,
            level,
            semester
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
            '${semester}'
        );
        `);

        res.json({
            success: true,
            message: "Course added successfully"
        });

    } catch (err) {

        res.json({
            success: false,
            message: err.message
        });

    }

});
// =========================
// GET ALL COURSES
// =========================
router.get("/courses", async (req, res) => {

    try{

        const courses = await runSQL(`
        SELECT * FROM courses
        ORDER BY level, course_code;
        `);

        res.json(courses);

    }catch(err){

        res.json([]);

    }

});


// =========================
// SAVE HANDOUT
// =========================
router.post("/add-handout", async (req,res)=>{

    try{

        const{
            course_id,
            title,
            file
        } = req.body;

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
            '${file}'
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


// =========================
// GET LIBRARY
// =========================
router.get("/library/:course_id", async(req,res)=>{

    try{

        const handouts = await runSQL(`
        SELECT *
        FROM handouts
        WHERE course_id='${req.params.course_id}'
        ORDER BY id DESC;
        `);

        res.json(handouts);

    }catch(err){

        res.json([]);

    }

});

// Dashboard Statistics
router.get("/dashboard", async (req, res) => {

    try {

        const students = await runSQL(
            "SELECT COUNT(*) AS total FROM users WHERE role='student';"
        );

        const courses = await runSQL(
            "SELECT COUNT(*) AS total FROM courses;"
        );

        const questions = await runSQL(
            "SELECT COUNT(*) AS total FROM questions;"
        );

        const handouts = await runSQL(
            "SELECT COUNT(*) AS total FROM handouts;"
        );

        res.json({

            success: true,

            students: students[0].total,

            courses: courses[0].total,

            questions: questions[0].total,

            handouts: handouts[0].total

        });

    } catch (err) {

        res.json({

            success: false,

            message: err.message

        });

    }

});

module.exports = router;
