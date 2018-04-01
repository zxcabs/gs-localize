const fs = require('fs');

module.exports = (fileList, translates) => Promise.all(fileList.map((file) => new Promise((rs, rj) => {
  const lang = file.match(/\/(\w+)\.json$/)[1];
  const json = require(file);
  const keys = Object.keys(json).sort();
  const translate = translates[lang];
  const resultJson = {};

  if (translate) {
    keys.forEach((key) => {
      resultJson[key] = Object.assign({}, json[key], translate[key]);
    });
  }

  const fileData = JSON.stringify(resultJson, null, 2);

  fs.writeFile(file, fileData, (err) => {
    if (err) return rj(err);
    rs();
  });
})));
