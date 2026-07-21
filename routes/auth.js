const express = require("express");
const router = express.Router();

const runSQL = require("../utils/database");


// REGISTER

router.post("/register", async (req,res)=>{

    try{

        const {
            admission_no,
            full_name,
            department,
            level,
            password
        } = req.body;


        await runSQL(`
        INSERT INTO users
        (
        admission_no,
        full_name,
        department,
        level,
        password,
        role
        )

        VALUES
        (
        '${admission_no}',
        '${full_name}',
        '${department}',
        '${level}',
        '${password}',
        'student'
        );
        `);


        res.json({

            success:true,
            message:"Registration successful"

        });


    }catch(err){

        res.status(500).json({

            success:false,
            message:err.message

        });

    }

});




// LOGIN

router.post("/login", async(req,res)=>{

    try{

        const {
            admission_no,
            password
        } = req.body;


        const user = await runSQL(`

        SELECT *
        FROM users
        WHERE admission_no='${admission_no}'
        AND password='${password}';

        `);


if (user.length === 0) {
            return res.json({

                success:false,
                message:"Invalid login"

            });

        }


res.json({
    success: true,
    user: user[0]
});


    }catch(err){

        res.status(500).json({

            success:false,
            message:err.message

        });

    }


});


module.exports = router;
