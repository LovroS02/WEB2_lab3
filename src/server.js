const express = require("express");
const path = require("path");

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.listen(3000, () => {
    console.log("Listening on localhost:3000")
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "public/html/index.html"));
});