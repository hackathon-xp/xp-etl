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
  if (fs.existsSync('my.json')) fs.unlinkSync('my.json');

  console.log(`base limpa`);
  console.log('obtendo informações...');
  csv()
    .fromFile(csvFilePath)
    .on('json', jsonObj => {
      let data = [];
      if (fs.existsSync('my.json')) {
        data = JSON.parse(fs.readFileSync('my.json'));
      }
      data.push(jsonObj);
      fs.writeFileSync('my.json', JSON.stringify(data));
    })
    .on('done', async error => {
      console.log('inserindo items...');
      const items = JSON.parse(fs.readFileSync('my.json'));
      const insertItem = await Promise.all(items.map(item => insert(item)));
      console.log('inserts', insertItem.length);
      console.log('end');
      process.exit(0);
    });
}

run();
