const path = require("path");
const { promisify } = require("util");
const fs = require("fs");
const readdir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);
const { getFiles } = require("./utils");
const { TxtFile, ZipFile } = require("./valid-types");

exports.readFiles = async (req, res, next) => {
  const { filePath } = req.body;
  const dirContents = await readdir(path.resolve(filePath));

  const files = await getFiles(filePath, dirContents);
  const zippedFiles = files.filter(file => file.type === ZipFile);
  let txtFiles = files.filter(file => file.type === TxtFile);
  txtFiles = await Promise.all(
    txtFiles.map(async file => {
      try {
        const content = await readFile(file.fullPath, "utf8");

        return Object.assign({}, file, { content });
      } catch (e) {
        console.log(e);
        return file;
      }
    })
  );

  req.files = [...txtFiles, ...zippedFiles];
  req.folderPath = filePath;

  next();
};
