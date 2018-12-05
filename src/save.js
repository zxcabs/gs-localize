const fs = require('fs');
const stringify = require('./stringify');

module.exports = (fileList, translates, isWin) => Promise.all(fileList.map((file) => new Promise((rs, rj) => {
  const lang = isWin 
    ? file.match(/(\w+)\.json$/)[1]
    : file.match(/\/(\w+)\.json$/)[1];
  const json = require(file);
  const keys = Object.keys(json);
  const translate = translates[lang];
  const resultJson = {};

  if (translate) {
    keys.forEach((key) => {
      resultJson[key] = Object.assign({}, json[key], translate[key]);
    });
  }

  const fileData = stringify(resultJson);

  fs.writeFile(file, fileData, (err) => {
    if (err) return rj(err);
    rs();
  });
})));
