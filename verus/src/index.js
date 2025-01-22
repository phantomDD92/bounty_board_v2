require('dotenv').config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const login = require("./routes/login")

//express setup
const app = express();
const port = 9000;

app.use(bodyParser.json({
    verify: function (req, res, buf, encoding) {
        req.rawBody = buf;
    }
}));

app.use(bodyParser.urlencoded({
    extended: false,
    verify: function (req, res, buf, encoding) {
        req.rawBody = buf;
    }
}));

app.use(cors({
    origin: '*'
}));
app.use(cookieParser());

app.use('/', login);

app.listen(port, '127.0.0.1', () => {
    console.log(`running server on port ${port}`);
});