import { Book } from "../../src/model/Book.model";
import { BookBuilder } from "../../src/model/builders/book.builder";

describe("Book builder" , () => {

    it("Should return a Book object", () => {
        // Arrange
        const expectedBook = new Book("book title","author","genre","format","language","publisher","special education","packaging");
        // Act
        const book = new BookBuilder()
        .setBookTitle("book title")
        .setAuthor("author")
        .setGenre("genre")
        .setFormat("format")
        .setLanguage("language")
        .setPublisher("publisher")
        .setSpecialEdition("special education")
        .setPackaging("packaging")
        .build();

        // Assert
        expect(book).toEqual(expectedBook);
    });

    it("Should throw an error if a field is missing", () => {
        const book = new BookBuilder()
        .setBookTitle("book title")
        .setAuthor("author")
        .setGenre("genre")

        expect(() => book.build()).toThrow("Missing required properties");
    })

})


