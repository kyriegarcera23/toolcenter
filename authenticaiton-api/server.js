require('dotenv').config()

const express = require("express");
const {json, urlencoded} = require("body-parser");
const cookieSession = require('cookie-session');
const cors = require("cors");
const db = require("./app/models");

// set port, listen for requests
const PORT = process.env.PORT || 3000;

const app = express();
app.set('trust proxy', true);
app.set('etag', false);

// var corsOptions = {
//   origin: ["http://crud.local","https://crud.local"],
//   credentials: true
// };

app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cookieSession({
  name: 'appSession',
  keys: [process.env.SECRET_KEY],
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));

// db.sequelize.sync();

// db.sequelize.sync({ force: true }).then(() => {
//     console.log("Drop and re-sync db.");
// });

app.get("/", (req, res) => {
  res.json({ message: "Welcome to nodejs app authentication." });
});

require("./app/routes/user.route")(app);
require("./app/routes/role.route")(app);
require("./app/routes/permission.route")(app);

app.listen(PORT, () => {
  console.log(`Server running at ${PORT}`);
});