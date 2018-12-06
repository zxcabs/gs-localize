module.exports = (fileList, isWin) => fileList.reduce((result, file) => {
  const lang = isWin 
    ? file.match(/\\(\w+)\.json$/)[1]
    : file.match(/\/(\w+)\.json$/)[1];
  const json = require(file);

  if (!result[lang]) {
    result[lang] = json;
  } else {
    result[lang] = Object.assign({}, result[lang], json);
  }

  return result;
}, {});
