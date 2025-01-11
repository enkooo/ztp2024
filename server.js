const fs = require("fs");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const { initializeClient } = require("./src/db/client");
const goodsRoutes = require("./src/routes/goods");
const requestsRoutes = require("./src/routes/requests");

let config = JSON.parse(fs.readFileSync("config.json"));
const app = express();

app.use(morgan("tiny"));
app.use(cors());
app.use(bodyParser.json());
app.use((err, req, res, next) => {
  res.status(400).json({ error: err.message });
});

app.use(express.static(config.frontend));

const api = "/api/";
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.use(api + "goods", goodsRoutes);
app.use(api + "requests", requestsRoutes);

app.use((req, res) => {
  console.log(`404: ${req.method} ${req.url}`);
  res.status(404).json({ error: "Not found" });
});

app.listen(config.port, () => {
  initializeClient(config.db).catch((err) => {
    console.error(err);
    process.exit(1);
  });
  console.log("DB connected, backend is listening on port", config.port);
});
