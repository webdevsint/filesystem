const express = require("express");
const ip = require("ip");

const bodyParser = require("body-parser");
const cors = require("cors");

const PORT = process.env.PORT || 3000;

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors());

app.use("/", require("./routes/routes"));
app.use("/root", require("./routes/folders"));

app.listen(PORT, () =>
  console.log(`Server started at http://${ip.address()}:${PORT}/`)
);
