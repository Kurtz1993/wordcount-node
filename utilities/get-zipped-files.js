const fs = require("fs");
const { promisify } = require("util");
const JSZip = require("jszip");
const mime = require("mime-types");

const { TEXT_FILE } = require("./valid-types");
const readFile = promisify(fs.readFile);

async function getZippedFiles(zip) {
  let files = [];

  try {
    const zipFile = await readFile(zip);
    const zipContents = await JSZip.loadAsync(zipFile);
    const zipFiles = Object.values(zipContents.files).filter(file => !file.dir);

    for (let file of zipFiles) {
      if (mime.lookup(file.name) !== TEXT_FILE) continue;

      const fileContents = await zipContents.file(file.name).async("text");

      files.push({ fileName: file.name, content: fileContents });
    }
  } catch (e) {
    console.log(e);
  }

  return files;
}

exports.getZippedFiles = getZippedFiles;
