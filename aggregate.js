// Import constants
const fs = require('fs');
const countries = require('./country-list');

// Literal Constants
const countryName = 'Country Name';
const countryPopulation = 'Population (Millions) - 2012';
const countryGDP = 'GDP Billions (US Dollar) - 2012';

const outputFile = './output/output.json';


/**
 *
 * @param {*} csvText
 * @returns {*}
 */
function processCsv(csvText) {
  // Remove all the double quotes from the csv text.
  const csvTextProcessed = csvText.replace(/['"]+/g, '');

  // Split the csv text on newline to get the rows
  const csvRows = csvTextProcessed.split('\n');
  const countryDataList = [];
  const headers = csvRows[0].split(',');

  // Iterate over all the rows except the headers and create country data objects
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

/**
 * Method takes a file path and returns the text from the file.
 * @param {String} filePath
 */
function readFile(filePath) {
  // Read the data from the CSV file using the node fs package.
  return fs.readFileSync(filePath, 'utf8');
}

/**
 * Aggregates GDP and Population Data by Continents
 * @param {String} filePath
 */
const aggregate = (filePath) => {
  // Call the readFile method to get the
  const csvText = readFile(filePath);

  // Process the csv text to get the list of country data objects.
  const countryDataList = processCsv(csvText);
  const continentData = {};

  // Create continent data objects and push them into a list.
  new Set(countries.values()).forEach((continent) => {
    continentData[continent] = {
      GDP_2012: 0, POPULATION_2012: 0,
    };
  });

  // Iterate over all the country data and update the continent statistics.
  countryDataList.forEach((country) => {
    if (country[countryName] !== ' ' && countries.has(country[countryName])) {
      const continentName = countries.get(country[countryName]);
      continentData[continentName].GDP_2012 += parseFloat(country[countryGDP]);
      continentData[continentName].POPULATION_2012 += parseFloat(country[countryPopulation]);
    }
  });

  // Write the continent data into the output file.
  fs.writeFileSync(outputFile, JSON.stringify(continentData));
};

module.exports = aggregate;
