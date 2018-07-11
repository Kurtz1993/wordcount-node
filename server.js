const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");

const {
  getFilesFromFolder,
  getFilesFromZip,
  countWords,
} = require("./middleware");

const app = express();

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/", getFilesFromFolder, getFilesFromZip, countWords);

app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "public", "index.html"))
);

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
