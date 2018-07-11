const { getZippedFiles } = require("../utilities");

exports.getFilesFromZip = async (req, res, next) => {
  const { zipFiles } = req;
  const zipFolderPromises = zipFiles
    .map(zip => getZippedFiles(zip.fullPath))
    .reduce((prev, next) => prev.concat(next), []);

  const filesInZippedFolders = await Promise.all(zipFolderPromises);
  req.zipFiles = filesInZippedFolders;

  next();
};
