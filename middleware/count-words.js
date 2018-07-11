exports.countWords = async (req, res) => {
  const files = req.textFiles.concat(req.zipFiles);

  const contentString = files.reduce(
    (prev, next) => prev.concat(` ${next.content}`),
    ""
  );

  const wordCount = contentString
    .replace(/[^a-zA-Z ]/g, "")
    .toLowerCase()
    .split(" ")
    .filter(word => word)
    .reduce((count, word) => {
      count[word] = (count[word] || 0) + 1;

      return count;
    }, {});

  res.send({ wordCount });
};
