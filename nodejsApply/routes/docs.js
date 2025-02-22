const express = require("express");
const router = express.Router();
const controller = require("../controller/docsController.js");

router.get("/",controller.render);

module.exports = router;
