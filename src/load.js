module.exports = (fileList) => fileList.reduce((result, file) => {
  const lang = file.match(/\/(\w+)\.json$/)[1];
  const json = require(file);

  if (!result[lang]) {
    result[lang] = json;
  } else {
    result[lang] = Object.assign({}, result[lang], json);
  }

  return result;
}, {});
