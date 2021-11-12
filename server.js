if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const port = process.env.PORT || process.env.SERVER_PORT || 3000;
const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const routes = require("./routes");
const db = require("./src/utils/db");
const io = require("./src/helpers/socket.helper");
require("express-async-errors");

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(bodyParser.json());

app.use(routes);

const server = require("http").Server(app);

db.sync()
  .then(() => {
    server.listen(port, () => {
      console.log(`\nServer is listening on port ${port}`);
      console.log("But Please wait a few seconds for setting up (init)\n");
      io.initSocket(server);
    });
  })
  .catch((err) => {
    console.log(err);
  });
