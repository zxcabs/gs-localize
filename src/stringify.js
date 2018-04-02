const u = require('util');

function printBody(json, space, EOF) {
  return Object.keys(json)
    .sort()
    .map((key) => {
      let val = json[key];

      if (u.isObject(val)) {
        return `${space}"${key}": ${format(val, space, EOF)}`;
      } else {
        return `${space}"${key}": ${JSON.stringify(val)}`;
      }
    })
    .join(`,${EOF}`);
}

function format(json, space = '', EOF = '\n') {
  const body = printBody(json, space + '  ', EOF);
  return `{${EOF}${body}${EOF}${space}}`;
}

module.exports = function stringify(json) {
  const space = '';
  const EOF = '\n';
  return `${format(json, space, EOF)}${EOF}`;
};
