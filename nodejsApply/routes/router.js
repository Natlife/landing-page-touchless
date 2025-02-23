// Library express
const express = require("express");

// Init router
const router = express.Router();

// Import path to other routes
const indexRouter = require("./index.js");
const aboutRouter = require("./about.js");
const docsRouter = require("./docs.js");
const downloadRouter = require("./download.js");

// Define route in router
router.use("/", indexRouter);
router.use("/docs", docsRouter);
router.use("/download", downloadRouter);
router.use("/about", aboutRouter);

// Export as a module to use
module.exports = router;
