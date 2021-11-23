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
    console.log(`\nSERVER WILL LISTEN ON ${port}`);
    console.log(
      `NOW, PLEASE WAIT ${process.env.SERVER_INIT_TIME} SECONDS FOR SETTING UP THE SERVER\n`
    );

    io.initSocket(server);

    setTimeout(() => {
      server.listen(port, () => {
        console.log(`\nSERVER IS GOOD TO GO, LISTENING ON ${port}`);
      });
    }, +process.env.SERVER_INIT_TIME * 1000); // 15000
  })
  .catch((err) => {
    console.log(err);
  });
