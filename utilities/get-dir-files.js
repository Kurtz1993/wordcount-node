const path = require("path");
const fs = require("fs");
const mime = require("mime-types");
const { promisify } = require("util");

const { TEXT_FILE, ZIP_FILE } = require("./valid-types");
const readdir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);

/**
 * Gets information about text and zip files inside the given directory.
 * @param {string} dirPath Path of the folder to read.
 * @returns An array containing information about the folder's text and zip files.
 */
async function getDirFiles(dirPath) {
  let files = [];

  try {
    let dirContents = await readdir(dirPath);
    const filePromises = dirContents.map(fileName => {
      const file = path.join(dirPath, fileName);

      return new Promise((resolve, reject) => {
        fs.stat(file, (error, stat) => {
          if (error) reject(error);

          resolve({
            fileName,
            stat,
            fullPath: file,
            type: mime.lookup(file),
          });
        });
      });
    });

    const dirFiles = await Promise.all(filePromises);

    for (let file of dirFiles) {
      if (file.stat.isDirectory()) {
        files = [
          ...files,
          ...(await getDirFiles(path.join(dirPath, file.fileName))),
        ];
        continue;
      }

      file.content = await readFile(file.fullPath, "utf8");

      files = [...files, file];
    }
  } catch (e) {
    console.log(e);
  }

  return files.filter(
    file => file.type === TEXT_FILE || file.type === ZIP_FILE
  );
}

exports.getDirFiles = getDirFiles;
