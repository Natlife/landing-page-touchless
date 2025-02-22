const express = require("express");
const router = express.Router();
const controller = require("../controller/aboutController");

router.get("/",controller.render);

module.exports = router;
