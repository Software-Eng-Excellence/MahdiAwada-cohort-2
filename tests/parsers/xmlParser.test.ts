import { promises as fs } from 'fs';
import { parse_xml_file } from '../../src/util/parsers/xmlParser';
import * as path from 'path';

const tempFile = path.join(__dirname, 'test_output.json');
const sampleXMLPath = path.join(__dirname, 'test_input.json');

const xmlData = 
`<toys>
    <toy>
        <id>1</id>
        <name>Teddy Bear</name>
        <price>25.99</price>
        <inStock>true</inStock>
        <tags>
            <tag>soft</tag>
            <tag>plush</tag>
            <tag>popular</tag>
        </tags>
    </toy>
    <toy>
        <id>2</id>
        <name>Lego Set</name>
        <price>49.99</price>
        <inStock>false</inStock>
        <tags>
            <tag>educational</tag>
            <tag>plastic</tag>
        </tags>
    </toy>
</toys>`;

describe("XML Parser", () => {
    beforeAll( async () => {
        await fs.writeFile(sampleXMLPath, xmlData, 'utf-8');
    });
    afterAll( async () => {
        await fs.unlink(sampleXMLPath);
        await fs.unlink(tempFile).catch(() => {});
    });

    it("Should parse XML data from the XML file", async () => {
        const data = await parse_xml_file(sampleXMLPath);

        expect(data).toEqual({
            toys: {
                toy: [
                    {
                        id: ['1'],
                        name: ['Teddy Bear'],
                        price: ['25.99'],
                        inStock: ['true'],
                        tags: [{ tag: ['soft', 'plush', 'popular'] }]
                    },
                    {
                        id: ['2'],
                        name: ['Lego Set'],
                        price: ['49.99'],
                        inStock: ['false'],
                        tags: [{ tag: ['educational', 'plastic'] }]
                    }
                ]
            } 
        });
    });
});
