const path = require("path");
const fs = require("fs");
const mime = require("mime-types");
const { promisify } = require("util");
const readdir = promisify(fs.readdir);
const { TxtFile, ZipFile } = require("./valid-types");

async function getFiles(folder) {
  let files = [];
  try {
    let dirFiles = await readdir(folder);
    const items = await Promise.all(
      dirFiles.map(fileName => {
        let item = path.join(folder, fileName);
        return new Promise((resolve, reject) => {
          fs.stat(item, (err, stat) => {
            if (err) reject(err);

            resolve({
              fileName,
              stat,
              fullPath: item,
              type: mime.lookup(item),
            });
          });
        });
      })
    );

    for (let i = 0; i < items.length; i++) {
      let item = items[i];
      try {
        if (item.stat.isDirectory()) {
          files = [
            ...files,
            ...(await getFiles(path.join(folder, item.fileName))),
          ];
          continue;
        }

        files.push(item);
      } catch (e) {
        console.log(e);
      }
    }

    return files.filter(file => file.type === TxtFile || file.type === ZipFile);
  } catch (e) {
    console.log(e);
  }
}

exports.getFiles = getFiles;
