import { Book } from "../model/Book.model";
import { IMapper } from "./IMapper";
import { BookBuilder } from "../model/builders/book.builder";

export interface JSONBook {
    Book_Title: string;
    Author: string;
    Genre: string;
    Format: string;
    Language: string;
    Publisher: string;
    Special_Edition: string;
    Packaging: string;
}

export class JSONBookMapper implements IMapper<JSONBook, Book> {
    map(data: JSONBook): Book {
        return new BookBuilder()
                .setBookTitle(data.Book_Title)
                .setAuthor(data.Author)
                .setGenre(data.Genre)
                .setFormat(data.Format)
                .setLanguage(data.Language)
                .setPublisher(data.Publisher)
                .setSpecialEdition(data.Special_Edition)
                .setPackaging(data.Packaging)
                .build();
    }
    reverseMap(data: Book): JSONBook {
        return {
            Book_Title: data.getBookTitle(),
            Author: data.getAuthor(),
            Genre: data.getGenre(),
            Format: data.getFormat(),
            Language: data.getLanguage(),
            Publisher: data.getPublisher(),
            Special_Edition: data.getSpecialEdition(),
            Packaging: data.getPackaging()
        }
    }
    
}