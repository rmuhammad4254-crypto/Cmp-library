const pdf = require("pdf-parse");
const fs = require("fs");


async function extractPDF(filePath){

    const dataBuffer = fs.readFileSync(filePath);

    const data = await pdf(dataBuffer);

    return data.text;

}


module.exports = extractPDF;
