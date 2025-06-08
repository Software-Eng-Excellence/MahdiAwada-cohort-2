import { promises as fs } from 'fs';
import { readCSVFile, writeCSVFile } from '../../src/util/parsers/csvParser';
import * as path from 'path';

const tempFile = path.join(__dirname, 'test_output.csv');
const sampleCSVPath = path.join(__dirname, 'test_input.csv');

const csvDataWithHeader = 
`Name,Age,Country
Alice,30,USA
Bob,25,Canada
`;

describe("CSV Parser" , () => {
    beforeAll( async () => {
         await fs.writeFile(sampleCSVPath, csvDataWithHeader, 'utf-8');
    });
    afterAll(async () => {
    await fs.unlink(sampleCSVPath);
    await fs.unlink(tempFile).catch(() => {});
  });
    it("Should parse csv data from the csv file", async () => {
    
        // Act
        const data = await readCSVFile(sampleCSVPath);
        // Assert
        expect(data).toEqual([
            ['Alice' , '30' , 'USA'],
            ['Bob' , '25' , 'Canada'],
        ]);
    });

    it("Should read CSV file with header", async () => {
        // Act
        const data  = await readCSVFile(sampleCSVPath, true);
        // Assert
        expect(data).toEqual([
            ['Name', 'Age', 'Country'],
            ['Alice', '30', 'USA'],
            ['Bob', '25', 'Canada'],
        ]);
    });

    it('should write CSV file correctly', async () => {
        // Arrange
        const testData: string[][] = [
            ['ID', 'Name', 'Score'],
            ['1', 'Alice', '95'],
            ['2', 'Bob', '88']
        ];

        // Act
        await writeCSVFile(tempFile, testData);

        // Assert
        const content = await fs.readFile(tempFile, 'utf-8');
        expect(content.trim()).toBe('ID,Name,Score\n1,Alice,95\n2,Bob,88');
    });

})