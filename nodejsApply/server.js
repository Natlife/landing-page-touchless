const express = require("express");
const { engine } = require("express-handlebars");
const app = express();
const port = 3000;

app.engine("hbs", engine({
    extname: ".hbs",
    layoutsDir: "views/layouts",
}));

app.set('view engine', 'hbs');
app.set('views', './views');

app.use(express.static('public'));

// Import router
const router = require("./routes/router");

// Use router
app.use("/", router);



app.listen(port, () => { console.log("On port " + port) });