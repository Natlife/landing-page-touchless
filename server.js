const express = require("express");
const {engine} = require("express-handlebars");
const app = express();
const port = 3000;

app.engine("hbs", engine({
    extname: ".hbs",
    layoutsDir: "views/layouts",
    partialsDir: "views/partials"
}));

app.set('view engine', 'hbs');
app.set('views', './views');

app.use(express.static('public'));

app.get(['/', '/index.hbs'],(req,res) => {
    res.render('index',{titlename:'Home'});
});

app.get('/download.hbs',(req,res) => {
    res.render('download',{titlename:'Download', style1: '/css/download-page-style.css'});
});

// app.get('/',(req,res) => {
//     res.render('index',{titlename:'Home'});
// });
// app.get('/',(req,res) => {
//     res.render('index',{titlename:'Home'});
// });


app.listen(port,() => {console.log("On port " + port)});