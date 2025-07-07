import { JSONBookMapper, JSONBook } from '../../src/mappers/Book.mapper';
import { Book } from '../../src/model/Book.model';

describe('JSONBookMapper', () => {
    let mapper: JSONBookMapper;
    let sampleJSONBook: JSONBook;

    beforeEach(() => {
        mapper = new JSONBookMapper();
        sampleJSONBook = {
            Book_Title: 'book title',
            Author: 'author',
            Genre: 'genre',
            Format: 'format',
            Language: 'language',
            Publisher: 'publisher',
            Special_Edition: 'special edition',
            Packaging: 'packaging'
        };
    });

    describe('map', () => {
        it('should map JSON data to Book object', () => {
            // Act
            const result = mapper.map(sampleJSONBook);

            // Assert
            expect(result).toBeInstanceOf(Book);
            expect(result.getBookTitle()).toBe('book title');
            expect(result.getAuthor()).toBe('author');
            expect(result.getGenre()).toBe('genre');
            expect(result.getFormat()).toBe('format');
            expect(result.getLanguage()).toBe('language');
            expect(result.getPublisher()).toBe('publisher');
            expect(result.getSpecialEdition()).toBe('special edition');
            expect(result.getPackaging()).toBe('packaging');
        });
    });

    describe('reverseMap', () => {
        it('should map Book object back to JSON data', () => {
            // Arrange
            const book = mapper.map(sampleJSONBook);

            // Act
            const result = mapper.reverseMap(book);

            // Assert
            expect(result).toEqual(sampleJSONBook);
        });
    });
}); 