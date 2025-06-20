import { readCSVFile } from "./util/parsers/csvParser";
import { CSVCakeMapper } from "./mappers/Cake.mapper";
import logger from "./util/logger";
import { CSVOrderMapper } from "./mappers/Order.mapper";

async function main() {
    const data = await readCSVFile("./src/data/cake orders.csv")
    const cakeMapper = new CSVCakeMapper();
    const orderMapper = new CSVOrderMapper(cakeMapper)
    const orders = data.map(row => orderMapper.map(row));

    logger.info("List of cakes: \n %o",orders);
}

main()