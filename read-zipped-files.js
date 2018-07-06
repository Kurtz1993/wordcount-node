const path = require("path");
const fs = require("fs");
const { promisify } = require("util");
const { ZipFile, TxtFile } = require("./valid-types");
const JSZip = require("jszip");
const mime = require("mime-types");
const readFile = promisify(fs.readFile);

exports.readZippedFiles = async (req, res, next) => {
  const { files } = req;

  const zippedFiles = files.filter(file => file.type === ZipFile);

  const filesInZip = (await Promise.all(
    zippedFiles.map(file => readZippedFile(file.fullPath))
  )).reduce((prev, next) => prev.concat(next), []);

  req.files = files
    .filter(file => file.type !== ZipFile)
    .concat(filesInZip)
    .map(file => ({
      name: file.fileName,
      wordCount: file.content && file.content.split(" ").length,
    }));

  next();
};

async function readZippedFile(file) {
  let result = [];
  try {
    const zipFile = await readFile(file);

    const zip = await JSZip.loadAsync(zipFile);
    let files = Object.values(zip.files).filter(file => !file.dir);
    for (let i = 0; i < files.length; i++) {
      let file = files[i];

      if (mime.lookup(file.name) !== TxtFile) continue;

      const content = await zip.file(file.name).async("text");
      result.push({ fileName: file.name, content });
    }
  } catch (e) {
    console.log(e);
  }

  return result;
}
