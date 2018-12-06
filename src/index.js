const load = require('./load');
const save = require('./save');
const sheet = require('./sheet');
const os = require('os')
const isWin = os.platform() === 'win32'

module.exports = ({ docId, cred, i18nFileList }) => {
  const keys = load(i18nFileList, isWin);

  return sheet.init(docId, cred)
    .then(() => sheet.mergepush(keys))
    .then(() => sheet.mergepull(keys))
    .then((translates) => save(i18nFileList, translates, isWin))
    .catch(e => console.error(e));
};
