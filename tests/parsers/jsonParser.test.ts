import { promises as fs } from 'fs';
import { parse_json_file } from '../../src/util/parsers/jsonParser';
import * as path from 'path';

const tempFile = path.join(__dirname, 'test_output.json');
const sampleJSONPath = path.join(__dirname, 'test_input.json');

const JSONData = [
  {
    "id": 1,
    "name": "Teddy Bear",
    "price": 25.99,
    "inStock": true,
    "tags": ["soft", "plush", "popular"]
  },
  {
    "id": 2,
    "name": "Lego Set",
    "price": 49.99,
    "inStock": false,
    "tags": ["educational", "plastic"]
  }
];

describe("JSON Parser", () => {
    beforeAll( async () => {
        const json_string_data = JSON.stringify(JSONData);
        await fs.writeFile(sampleJSONPath, json_string_data, 'utf-8');
    });
    afterAll( async () => {
        await fs.unlink(sampleJSONPath);
        await fs.unlink(tempFile).catch(() => {});
    });

    it("Should parse JSON data from the JSON file", async () => {
        // Act 
        const data = await parse_json_file(sampleJSONPath);
        // Assert
        expect(data).toEqual(JSONData);
    })
})