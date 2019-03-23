const fetch = require('node-fetch');
const moment = require('moment');
const fs = require('fs');
const jsonexport = require('jsonexport');

const urls = [
  'http://d5nxcu7vtzvay.cloudfront.net/data/realdonaldtrump/2009.json',
  'http://d5nxcu7vtzvay.cloudfront.net/data/realdonaldtrump/2010.json',
  'http://d5nxcu7vtzvay.cloudfront.net/data/realdonaldtrump/2011.json',
  'http://d5nxcu7vtzvay.cloudfront.net/data/realdonaldtrump/2012.json',
  'http://d5nxcu7vtzvay.cloudfront.net/data/realdonaldtrump/2013.json',
  'http://d5nxcu7vtzvay.cloudfront.net/data/realdonaldtrump/2014.json',
  'http://d5nxcu7vtzvay.cloudfront.net/data/realdonaldtrump/2015.json',
  'http://d5nxcu7vtzvay.cloudfront.net/data/realdonaldtrump/2016.json',
  'http://d5nxcu7vtzvay.cloudfront.net/data/realdonaldtrump/2017.json',
  'http://d5nxcu7vtzvay.cloudfront.net/data/realdonaldtrump/2018.json',
  'http://trumptwitterarchive.com/data/realdonaldtrump/2019.json',
];

async function createData () {
  const hashByDate = {};
  const responses = await Promise.all(urls.map(url => fetch(url)));
  const years = await Promise.all(responses.map(response => response.json()));

  years.forEach(year => {
    year.forEach(tweet => {
      const date = moment(tweet.created_at).format('MM-DD-YYYY');
      if (hashByDate[date]) {
        hashByDate[date] = hashByDate[date] + 1;
      } else {
        hashByDate[date] = 1;
      }
    });
  });

  const data = Object.keys(hashByDate)
    .map(date => ({ date, tweets: hashByDate[date] }))
    .sort((a, b) => moment(a.date, 'MM-DD-YYYY').toDate() - moment(b.date, 'MM-DD-YYYY').toDate());

  fs.writeFile('by-date.json', JSON.stringify(data), 'utf8', () => {
    console.log('successfully created json file');
    jsonexport(data, function (err, csv) {
      if (err) return console.log('error converting to csv', err);
      fs.writeFile('by-date.csv', csv, 'utf8', () => console.log('successfully created csv file'));
    });
  });
}

createData();
