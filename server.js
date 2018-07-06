const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();
const { readFiles } = require("./read-files");
const { readZippedFiles } = require("./read-zipped-files");

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/", readFiles, readZippedFiles, (req, res) => {
  return res.send(req.files);
});
app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "public", "index.html"))
);

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
