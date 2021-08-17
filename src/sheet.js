const { GoogleSpreadsheet } = require('google-spreadsheet');
const async = require('async');
const flat = require('flat');
const ProgressBar = require('progress');

let doc;
let sheet;

const getFlats = (langs, keys) => langs.reduce((result, lang) => {
  const key = flat(keys[lang]);

  Object.keys(key).forEach((k) => {
    const val = key[k];

    if (typeof val === 'object') return;

    if (!result[k]) {
      result[k] = {};
    }

    result[k][lang] = val;
  });

  return result;
}, {});

exports.init = (docId, cred) => new Promise(async (resolve, reject) => {
  doc = new GoogleSpreadsheet(docId);

  console.log('Auth...');
  await doc.useServiceAccountAuth(cred);
  console.log('Successfully auth!');

  console.log('Get info...');
  await doc.loadInfo()
  console.log('Successfully get doc!');

  // sheet = doc.worksheets[0];
  sheet = doc.sheetsByIndex[0];
  
  console.log(doc.title)
  console.log(doc)

  resolve();
});

exports.mergepush = (keys) => new Promise((resolve, reject) => {
  const langs = Object.keys(keys);
  const flats = getFlats(langs, keys);

  sheet.getRows({
    offset: 0
  }, function( err, rows ) {
    if (err) return reject(err);
    const rowToSave = [];

    console.log(`Read ${rows.length} rows`);
    for (let i = 0; rows.length > i; i++) {
      let row = rows[i];
      const translates = flats[row.key];
      let shouldSave = false;

      if (translates) {
        langs.forEach((lang) => {
          if (!row[lang] && translates[lang]) {
            shouldSave = true;
            row[lang] = translates[lang];
          }
        });

        delete flats[row.key];
      }

      if (shouldSave) {
        rowToSave.push(new Promise((rs, rj) => {
          row.save((err) => err? rj(err): rs());
        }));
      }
    }

    let flatsKeys = Object.keys(flats);
    let hasToSave = flatsKeys.length > 0;

    if (hasToSave) {
      flatsKeys.forEach((key) => {
        const translate = flats[key];
        const rowData = { key };

        langs.forEach((lang) => { rowData[lang] = translate[lang]; });

        rowToSave.push(() => new Promise((rs, rj) => sheet.addRow(rowData, (err) => {
          if (err) return rj(err);
          rs();
        })));
      });
    }

    console.log('Row to save: ', rowToSave.length);
    let req = Promise.resolve();
    let progress = new ProgressBar('Upload keys [:bar] :percent', {
      total: rowToSave.length
    });

    rowToSave.forEach((row, i) => {
      req = req.then(() => {
        progress.tick();
        return row();
      })
    });

    req
      .then(() => resolve(rowToSave.length))
      .catch(reject);
  });
});

exports.mergepull = () => new Promise((resolve, reject) => {
  sheet.getRows({
    offset: 0
  }, (err, rows) => {
    if (err) return reject(err);

    console.log(`Read ${rows.length} rows`);

    const langs = ['en', 'ru', 'he'];//Object.keys(keys);
    const result = {};

    for (let i = 0; rows.length > i; i++) {
      let row = rows[i];
      let rowKey = row.key;

      langs.forEach((lang) => {
        if (!row[lang]) return;

        if (!result[lang]) {
          result[lang] = {};
        }
        result[lang][rowKey] = row[lang];
      });
    }

    resolve(flat.unflatten(result))
  });
});
