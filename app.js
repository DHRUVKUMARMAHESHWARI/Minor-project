const express = require('express');
const app = express();
const path = require('path');
const cookieParser = require('cookie-parser');
const indexRouter = require("./routes/index");
require("dotenv").config();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use("/", indexRouter);



app.listen(process.env.PORT);
