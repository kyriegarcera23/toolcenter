require('dotenv').config()

const express = require("express");
const {json, urlencoded} = require("body-parser");
const cookieSession = require('cookie-session');
const cors = require("cors");
const db = require("./app/models");

// set port, listen for requests
const PORT = process.env.PORT || 3004;

const app = express();
app.set('trust proxy', true);
app.set('etag', false);

app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cookieSession({
  name: 'appSession',
  keys: [process.env.SECRET_KEY],
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));

app.get("/", (req, res) => {
  res.json({ message: "Welcome to nodejs app asset-inventory." });
});

require("./app/routes/asset.route")(app);
require("./app/routes/client.route")(app);
require("./app/routes/recipient.route")(app);
require("./app/routes/location.route")(app);
require("./app/routes/report.route")(app);

app.listen(PORT, () => {
  console.log(`Server running at ${PORT}`);
});