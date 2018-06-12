const fs = require('fs');
const parse = require('csv-parse');
const yaml = require('write-yaml');

const inputPath = './csv/moj_portfolio.csv';
const headers = ['id','name','description','theme','phase','main_benefit','product_man','service_man','team_slack','location'];
const parser = parse({columns: headers, from: 2});

const loadCsv = (inputPath) => {
  try {
    return fs.readFileSync(inputPath, 'utf8');
  } catch(err) {
    throw err;
  }
}

parser.on('readable', () => {
  while(record = parser.read()){
    createYmlFile(record);
  }
});

parser.on('error', (err) => {
  if (err) throw err;
});

parser.on('finish', () => {
  console.log('All done');
});

parser.write(loadCsv(inputPath));

parser.end();

const createYmlFile = (record) => {
  yaml('./app/data/projects/' + record.id + '.yml', record, (err) => {
    if (err) throw err;
  });
}
