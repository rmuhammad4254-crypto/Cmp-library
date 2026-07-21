const express = require("express");
const path = require("path");
const multer = require("multer");
const fs = require("fs");
const runSQL = require("./utils/database");
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const courseRoutes = require("./routes/courses");
const libraryRoutes = require("./routes/library");
const examRoutes = require("./routes/exams");
const resultRoutes = require("./routes/results");
const extractPDF = require("./utils/pdfExtractor");
const parseQuestions = require("./utils/questionParser");

const app = express();
const PORT = 3000;

app.use(express.json());

app.use(express.urlencoded({
    extended: true
}));

app.use(express.static(path.join(__dirname, "public")));

app.use("/uploads",
express.static(path.join(__dirname,"uploads")));

app.use("/api", authRoutes);

app.use("/api/admin", adminRoutes);

app.use("/api/courses", courseRoutes);

app.use("/api/library", libraryRoutes);

app.use("/api/exams", examRoutes);

app.use("/api/results", resultRoutes);
const storage = multer.diskStorage({

    destination: function(req, file, cb){

        cb(null, "uploads/");

    },

    filename: function(req, file, cb){

        const uniqueName = Date.now() + "-" + file.originalname;

        cb(null, uniqueName);

    }

});

const upload = multer({ storage });
const profileStorage = multer.diskStorage({

    destination: function(req, file, cb){

        cb(null, "uploads/profile");

    },

    filename: function(req, file, cb){

        const ext = path.extname(file.originalname);

        cb(null, "profile_" + Date.now() + ext);

    }

});

const uploadProfile = multer({

    storage: profileStorage

});

console.log("✅ Database Ready");

app.get("/", (req, res) => {

    res.send("✅ CMP Library Server Running");

});

app.post("/upload", upload.single("file"), async (req,res)=>{

    try{

        const file = req.file;
    if(!file){
    return res.status(400).json({
        success:false,
        message:"No file uploaded"
    });
}
        const pdfText = await extractPDF(file.path);
        const questions = parseQuestions(pdfText);
        const course_id = req.body.course_id;

for(const q of questions){

    await runSQL(`

    INSERT INTO questions
(
course_id,
question,
option_a,
option_b,
option_c,
option_d,
correct_answer
)

    VALUES
(
'${course_id}',
'${q.question}',
'${q.option_a}',
'${q.option_b}',
'${q.option_c}',
'${q.option_d}',
'${q.correct_answer}'
);

    `);

}



        await runSQL(`

        INSERT INTO uploads
        (
        filename,
        original_name,
        uploaded_by
        )

        VALUES
        (
        '${file.filename}',
        '${file.originalname}',
        'admin'
        );

        `);


        res.json({

            success:true,
            message:"File uploaded successfully"

        });


    }catch(err){

        res.status(500).json({

            success:false,
            message:err.message

        });

    }

});

app.get("/questions", async (req,res)=>{

    try{

        const result = await runSQL(`
SELECT *
FROM questions
ORDER BY RANDOM()
LIMIT 30;
`);

        res.json(parseQuestions(result));

    }catch(err){

        res.status(500).json({
            success:false,
            message:err.message
        });

    }

});

app.get("/uploads", async (req,res)=>{

    try{

        const files = await runSQL(`
        SELECT *
        FROM uploads
        ORDER BY id DESC;
        `);

        res.json(files);

    }catch(err){

        res.status(500).json({
            success:false,
            message:err.message
        });

    }

});

app.get("/uploads", async (req,res)=>{

    try{

        const files = await runSQL(`
        SELECT *
        FROM uploads
        ORDER BY id DESC;
        `);


        res.send(files);


    }catch(err){

        res.status(500).send(err.message);

    }

});

app.post("/api/course", async (req, res) => {

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

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

});

app.get("/api/courses", async (req, res) => {

    try {

        const result = await runSQL(`
SELECT *
FROM courses
ORDER BY level, semester, course_code;
`);

        res.send(result);

    } catch (err) {

        res.status(500).send(err.message);

    }

});

app.post("/api/my-courses", async (req, res) => {

    try {

        const { department, level } = req.body;

        console.log("Department:", department);
        console.log("Level:", level);

        const courses = await runSQL(`
SELECT *
FROM courses
WHERE TRIM(LOWER(department)) = TRIM(LOWER('${department}'))
AND TRIM(level) = TRIM('${level}');
`);

        console.log("Courses:", courses);

        res.json(courses);

    } catch (err) {

        console.log(err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

});

app.post("/api/cbt", async (req, res) => {

    try {

        const { course_id } = req.body;

        const questions = await runSQL(`

SELECT
id,
question,
option_a,
option_b,
option_c,
option_d
FROM questions
WHERE course_id='${course_id}'
ORDER BY RANDOM()
LIMIT 20;
        `);

        res.json(questions);

    } catch (err) {

        res.status(500).json({

            success:false,
            message:err.message

        });

    }

});

app.post("/api/submit-exam", async (req, res) => {

    try {

       const {
    admission_no,
    course_id,
    answers,
    questionIds
} = req.body;

        const ids = questionIds.join(",");
        const rows = await runSQL(`

             SELECT id, correct_answer
             FROM questions
             WHERE id IN (${ids});

        `);

        let score = 0;

        rows.forEach(q => {

            const correct = q.correct_answer.trim().charAt(0);

                 if (answers[q.id] === correct) {
                     score++;
                           }
        });


await runSQL(`

INSERT INTO results
(
admission_no,
course_id,
score,
total
)

VALUES
(
'${admission_no}',
'${course_id}',
'${score}',
'${rows.length}'
);

`);

res.json({

    success: true,
    score,
    total: rows.length

});

    } catch (err) {

        res.status(500).json({

            success: false,
            message: err.message

        });

    }

});

app.post("/api/my-results", async (req,res)=>{

    try{

        const { admission_no } = req.body;

        const results = await runSQL(`

SELECT *
FROM results
WHERE admission_no='${admission_no}'
ORDER BY submitted_at DESC;

        `);

        res.json(results);

    }catch(err){

        res.status(500).json({

            success:false,
            message:err.message

        });

    }

});

app.get("/api/all-results", async (req,res)=>{

    try{

        const results = await runSQL(`
SELECT
results.admission_no,
courses.course_code,
courses.course_title,
results.score,
results.total,
results.submitted_at
FROM results
JOIN courses
ON results.course_id = courses.id
ORDER BY results.submitted_at DESC;

        `);

        res.json(results);

    }catch(err){

        res.status(500).json({

            success:false,
            message:err.message

        });

    }

});

app.post("/api/search-results", async(req,res)=>{

    try{

        const { admission_no } = req.body;

        const results = await runSQL(`

SELECT
results.admission_no,
courses.course_code,
courses.course_title,
results.score,
results.total,
results.submitted_at
FROM results
JOIN courses
ON results.course_id = courses.id
WHERE results.admission_no='${admission_no}'
ORDER BY results.submitted_at DESC;
        `);

        res.json(results);

    }catch(err){

        res.status(500).json({

            success:false,
            message:err.message

        });

    }

});

app.get("/api/dashboard-stats", async (req, res) => {

    try {

        const students = await runSQL(`
SELECT COUNT(*) AS total
FROM users
WHERE role='student';
        `);

        const courses = await runSQL(`
SELECT COUNT(*) AS total
FROM courses;
        `);

        const questions = await runSQL(`
SELECT COUNT(*) AS total
FROM questions;
        `);

        const exams = await runSQL(`
SELECT COUNT(*) AS total
FROM results;
        `);

        res.json({

            students: students[0].total,
            courses: courses[0].total,
            questions: questions[0].total,
            exams: exams[0].total

        });

    } catch (err) {

        res.status(500).json({

            success: false,
            message: err.message

        });

    }

});

app.post("/api/upload-profile",
uploadProfile.single("photo"),
async (req, res) => {

    try {

        const { admission_no } = req.body;

        if (!req.file) {

            return res.json({

                success: false,
                message: "No image selected"

            });

        }

        await runSQL(`

UPDATE users
SET profile_image='${req.file.filename}'
WHERE admission_no='${admission_no}';

        `);

        res.json({

            success: true,
            filename: req.file.filename

        });

    } catch (err) {

        res.status(500).json({

            success: false,
            message: err.message

        });

    }

});

app.post("/api/student-profile", async (req, res) => {

    try{

        const { admission_no } = req.body;

const rows = await runSQL(`
SELECT
full_name,
admission_no,
department,
level,
profile_image
FROM users
WHERE admission_no='${admission_no}';
`);

        if(rows.length === 0){

            return res.json({
                success:false,
                message:"Student not found."
            });

        }

        res.json({

            success:true,
            student:rows[0]

        });

    }catch(err){

        res.json({

            success:false,
            message:err.message

        });

    }

});

app.listen(PORT, () => {

    console.log(`🚀 Server running on http://localhost:${PORT}`);

});
