// Import constants
const fs = require('fs');

// Literal Constants
const countryName = 'Country Name';
const countryPopulation = 'Population (Millions) - 2012';
const countryGDP = 'GDP Billions (US Dollar) - 2012';

const outputFile = './output/output.json';
const countryContinentFile = './country-list.json';

/**
 * Method takes a file path, reads it using the node fs package and returns the text from the file.
 * @param {String} filePath
 */
function readFile(filePath) {
  // Read the data from the CSV file using the node fs package.
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (error, data) => {
      if (error !== null) {
        reject(error);
      } else {
        resolve(data);
      }
    });
  });
}

/**
 * Writes the given data to the file.
 * @param {String} filePath
 * @param {String} data
 */
function writeFile(filePath, data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, data, (error) => {
      if (error === null) {
        resolve(data);
      } else {
        reject(error);
      }
    });
  });
}

/**
 * Takes the csv data and processes it into aggregated continent data.
 * @param {Array} headerRow
 * @param {Array} dataRows
 * @param {Objbect} countryContinentMapper
 */
function processCsvData(headerRow, dataRows, countryContinentMapper) {
  const continentAggregateData = {};
  // Get the indices of all the required values.
  const indexCountryName = headerRow.indexOf(countryName);
  const indexGDP2012 = headerRow.indexOf(countryGDP);
  const indexPopulation2012 = headerRow.indexOf(countryPopulation);

  // Process each data row and aggregate the data.
  dataRows.forEach((data) => {
    // Split the row data on comma.
    const rowCell = data.split(',');
    // Data validation checks.
    if (rowCell[indexCountryName] !== ' ' && countryContinentMapper[rowCell[indexCountryName]] !== undefined && countryContinentMapper[rowCell[indexCountryName]] !== ' ') {
      const continentName = countryContinentMapper[rowCell[indexCountryName]];
      if (continentAggregateData[continentName] === undefined) {
        // If the continent object doesn't exist then create an object and assign values.
        continentAggregateData[continentName] = {};
        continentAggregateData[continentName].GDP_2012 = parseFloat(
          rowCell[indexGDP2012],
        );
        continentAggregateData[continentName].POPULATION_2012 = parseFloat(
          rowCell[indexPopulation2012],
        );
      } else {
        //  If the continent object exists then just update the values.
        continentAggregateData[continentName].GDP_2012 += parseFloat(
          rowCell[indexGDP2012],
        );
        continentAggregateData[continentName].POPULATION_2012 += parseFloat(
          rowCell[indexPopulation2012],
        );
      }
    }
  });
  return continentAggregateData;
}

/**
 * Aggregates GDP and Population Data by Continents
 * @param {String} filePath
 */
const aggregate = filePath => new Promise((resolve, reject) => {
  // Call the readFile method to get the
  Promise.all([readFile(filePath), readFile(countryContinentFile)]).then((result) => {
    // Remove the double quotes form the csv data and split the data on newline.
    const dataRows = result[0].replace(/['"]+/g, '').split('\n');
    const headerRow = dataRows.shift().split(',');
    // Process the csv text to get the list of country data objects.
    const countryContinentMapper = JSON.parse(result[1]);
    const continentAggregateData = processCsvData(headerRow, dataRows, countryContinentMapper);

    // Write the continent data into the output file.
    writeFile(outputFile, JSON.stringify(continentAggregateData)).then(() => {
      resolve();
    }).catch((error) => {
      reject(error);
    });
  }).catch((error) => {
    reject(error);
  });
});

module.exports = aggregate;
