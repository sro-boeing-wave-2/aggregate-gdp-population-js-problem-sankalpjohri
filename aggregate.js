/**
 * Aggregates GDP and Population Data by Continents
 * @param {*} filePath
 */

const fs = require('fs');
const countries = require('./country-list');

function processCsv(csvText) {
  const csvTextProcessed = csvText.replace(/['"]+/g, '');
  const csvRows = csvTextProcessed.split('\n');
  const countryDataList = [];
  const headers = csvRows[0].split(',');
  for (let i = 1; i < csvRows.length; i += 1) {
    if (csvRows[i].length > 0) {
      const countryData = csvRows[i].split(',');
      const countryObject = {};
      for (let j = 0; j < countryData.length; j += 1) {
        countryObject[headers[j]] = countryData[j];
      }
      countryDataList.push(countryObject);
    }
  }
  return countryDataList;
}

function readFile(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

const aggregate = (filePath) => {
  const csvText = readFile(filePath);
  const countryDataList = processCsv(csvText);
  const continentData = {};
  const continents = new Set(countries.values());
  continents.forEach((continent) => {
    continentData[continent] = {
      GDP_2012: 0, POPULATION_2012: 0,
    };
  });
  countryDataList.forEach((country) => {
    if (country['Country Name'] !== ' ' && countries.get(country['Country Name']) !== undefined) {
      continentData[countries.get(country['Country Name'])].GDP_2012 += parseFloat(country['GDP Billions (US Dollar) - 2012']);
      continentData[countries.get(country['Country Name'])].POPULATION_2012 += parseFloat(country['Population (Millions) - 2012']);
    }
  });
  fs.writeFileSync('./output/output.json', JSON.stringify(continentData));
};

aggregate('D:\\Workspace\\aggregate-gdp-population-js-problem-sankalpjohri\\data\\datafile.csv');

module.exports = aggregate;
