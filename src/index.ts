import logger from "./util/logger";
import { readCSVFile } from "./util/parsers/csvParser";
import { parse_json_file } from './util/parsers/jsonParser';
import { parse_xml_file } from "./util/parsers/xmlParser";

async function main() {

    // CSV data
    const csvData = await readCSVFile("src/data/cake orders.csv");
    csvData.forEach( row => logger.info(`CSV data: ${row}`)); 

    // JSON data
    const jsonData = await parse_json_file("./src/data/book orders.json");
    jsonData.forEach( (row: object) => logger.info(`JSON data: ${row}`));

    //XML data
    const xmlData = await parse_xml_file("./src/data/toy orders.xml");
    const rows = xmlData.data.row;
    rows.forEach((row: object) => logger.info(`XML data: ${row}`));
}

main()