import { promises as fs } from 'fs';
import { parseStringPromise } from 'xml2js';
/* 
XML Parser:
Implement an XML parser that can parse XML files and convert them into an object.
The parser should handle different XML structures and ensure that nested elements are properly parsed.
*/

export async function parse_xml_file(filePath: string) {
    try {
        const filecontent = await fs.readFile(filePath, 'utf-8');
        return parseStringPromise(filecontent);
    } catch(error){
        throw new Error(`Failed reading XML file: ${error}`);
    }
}