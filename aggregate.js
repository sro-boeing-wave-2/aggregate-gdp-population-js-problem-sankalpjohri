const fs = require('fs');
const countries = require('./country-list');

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
  // Get the list of all distinct continents.
  const continents = new Set(countries.values());
  // Create continent data objects and push them into a list.
  continents.forEach((continent) => {
    continentData[continent] = {
      GDP_2012: 0, POPULATION_2012: 0,
    };
  });
  // Iterate over all the country data and update the continent statistics.
  countryDataList.forEach((country) => {
    if (country['Country Name'] !== ' ' && countries.has(country['Country Name'])) {
      continentData[countries.get(country['Country Name'])].GDP_2012 += parseFloat(country['GDP Billions (US Dollar) - 2012']);
      continentData[countries.get(country['Country Name'])].POPULATION_2012 += parseFloat(country['Population (Millions) - 2012']);
    }
  });
  // Write the continent data into the output file.
  fs.writeFileSync('./output/output.json', JSON.stringify(continentData));
};

module.exports = aggregate;
