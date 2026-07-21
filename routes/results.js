const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
    res.json({
        success: true,
        message: "Courses route working"
    });
});

module.exports = router;
