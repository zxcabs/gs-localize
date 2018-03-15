const load = require('./load');
const save = require('./save');
const sheet = require('./sheet');

module.exports = ({ docId, cred, i18nFileList }) => {
  const keys = load(i18nFileList);

  return sheet.init(docId, cred)
    .then(() => sheet.mergepush(keys))
    .then(() => sheet.mergepull(keys))
    .then((translates) => save(i18nFileList, translates))
    .catch(e => console.error(e));
};
