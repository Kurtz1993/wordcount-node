const path = require("path");
const fs = require("fs");
const { promisify } = require("util");
const readdir = promisify(fs.readdir);

const folder = "C:\\Users\\luis_hernandez\\Desktop\\test-files";

function readFiles(folder) {
  let files = [];

  readdir(folder)
    .then(files => {
      return Promise.all(
        files.map(fileName => {
          let item = path.join(folder, fileName);
          return new Promise((resolve, reject) => {
            fs.stat(item, (err, stat) => {
              if (err) reject(err);

              resolve({ fileName, stat, fullPath: item });
            });
          });
        })
      );
    })
    .then(items => {
      items.forEach(item => {
        if (item.stat.isDirectory()) {
          readFiles(path.join(folder, item.fileName));
          return;
        }

        files.push(item);
      });
    })
    .catch(err => console.log(err));
}

async function readFilesAsync(folder) {
  let files = [];
  try {
    let dirFiles = await readdir(folder);
    const items = await Promise.all(
      dirFiles.map(fileName => {
        let item = path.join(folder, fileName);
        return new Promise((resolve, reject) => {
          fs.stat(item, (err, stat) => {
            if (err) reject(err);

            resolve({ fileName, stat, fullPath: item });
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
            ...await readFilesAsync(path.join(folder, item.fileName)),
          ];
          continue;
        }

        files.push(item);
      } catch (e) {
        console.log(e);
      }
    }

    return files;
  } catch (e) {
    console.log(e);
  }
}

// readFiles(folder);
readFilesAsync(folder)
  .then(files => {
    files.forEach(file => console.log(file.fullPath))
  })
  .catch(e => console.log(e));
