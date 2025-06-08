import { promises as fs } from 'fs';

/* 
JSON Parser:
Implement a JSON parser that can parse JSON files and convert them into an object.
The parser should handle all data types within the JSON, including strings, numbers, booleans, and arrays.
*/

export async function parse_json_file(filePath: string){
    try {
    const filecontent = await fs.readFile(filePath , 'utf-8');
    return JSON.parse(filecontent);
    } catch(error){
        throw new Error(`Failed reading JSON file: ${error}`);
    }
}

