// const csvFilePath = 'test.csv';
const csvFilePath = 'investments.csv';
const csv = require('csvtojson');
const mongoString =
  'mongodb://erickwendel:erick123@ds227525.mlab.com:27525/xpinvestimentos';
const mongo = require('mongojs');
const db = mongo(mongoString, ['investments']);
const fs = require('fs');

function insert(params) {
  return new Promise((resolve, reject) => {
    console.log('inserindo...', params.NM_FUNDO);
    return db.investments.save(
      params,
      (err, res) => (err ? reject(err) : resolve(res)),
    );
  });
}

async function remove(params) {
  return new Promise((resolve, reject) => {
    return db.investments.remove({}, (err, res) => {
      return err ? reject(err) : resolve(res);
    });
  });
}
async function run() {
  await remove();
  if (fs.existsSync('my.csv')) fs.unlinkSync('my.csv');

  console.log(`base limpa`);
  console.log('obtendo informações...');
  csv()
    .fromFile(csvFilePath)
    .on('json', async jsonObj => {
      // let data = null;
      // if (fs.existsSync('my.csv')) {
      //   data = fs.readFileSync('my.csv');
      // } else {
      //   data = '';
      //   fs.writeFileSync('my.csv', '');
      // }
      // const { field1 } = jsonObj;
      // if (data.indexOf(field1) !== -1) {
      //   return;
      // }
      console.log('inserindo...', jsonObj.field1);
      await insert(jsonObj);
      // fs.appendFileSync('my.csv', `${field1}\n`);
    })
    .on('done', async error => {
      // console.log('inserindo items...');
      // const items = JSON.parse(fs.readFileSync('my.csv'));
      // const insertItem = await Promise.all(items.map(item => insert(item)));
      // console.log('inserts', insertItem.length);
      console.log('end');
      // process.exit(0);
    });
}

run();
