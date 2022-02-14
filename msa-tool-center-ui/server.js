require('dotenv').config();
const express = require("express");

const PORT = process.env.PORT || 4000;

const app = express();

app.set('trust proxy', 1);

app.use(express.static(__dirname + '/dist/'));

app.get(/.*/, (req, res) => {
    res.sendFile(__dirname + '/dist/index.html');
});

app.listen(PORT, () => {
  console.log(`Server running at ${PORT}`);
});