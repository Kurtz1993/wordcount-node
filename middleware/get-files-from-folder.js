const { TEXT_FILE, ZIP_FILE } = require("../utilities/valid-types");
const { getDirFiles } = require('../utilities');

exports.getFilesFromFolder = async (req, res, next) => {
  const { filePath } = req.body;
  const files = await getDirFiles(filePath);

  req.textFiles = files.filter(file => file.type === TEXT_FILE);
  req.zipFiles = files.filter(file => file.type === ZIP_FILE);

  next();
};
