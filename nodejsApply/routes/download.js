const express = require("express");
const router = express.Router();
const controller = require("../controller/downloadController");

router.get("/",controller.render);

module.exports = router;
