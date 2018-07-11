const { getFilesFromFolder } = require("./get-files-from-folder");
const { getFilesFromZip } = require("./get-files-from-zip");
const { countWords } = require("./count-words");

module.exports = {
  getFilesFromFolder,
  getFilesFromZip,
  countWords,
};
