const express = require("express");
const router = express.Router();
const { handleBFHL } = require("../controllers/bfhl");

router.post("/bfhl", handleBFHL);

module.exports = router;