import { Book, IdentifiableBook } from "../model/Book.model";
import { IMapper } from "./IMapper";
import { BookBuilder, IdentifiableBookBuilder } from "../model/builders/book.builder";

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

export interface PostgreBook {
    id: string
    Book_Title: string;
    Author: string;
    Genre: string;
    Format: string;
    Language: string;
    Publisher: string;
    Special_Edition: string;
    Packaging: string;
}

export class PostgreBookMapper implements IMapper<PostgreBook ,IdentifiableBook> {
    map(data: PostgreBook): IdentifiableBook {
        return IdentifiableBookBuilder.newBuilder()
                                        .setId(data.id)
                                        .setBook(new BookBuilder()
                                            .setBookTitle(data.Book_Title)
                                            .setAuthor(data.Author)
                                            .setGenre(data.Genre)
                                            .setFormat(data.Format)
                                            .setLanguage(data.Language)
                                            .setPublisher(data.Publisher)
                                            .setSpecialEdition(data.Special_Edition)
                                            .setPackaging(data.Packaging)
                                            .build())
                                            .build();
                                    
                                    
    }
    reverseMap(data: IdentifiableBook): PostgreBook {
        return {
            id: data.getId(),
            Book_Title: data.getBookTitle(),
            Author: data.getAuthor(),
            Genre: data.getGenre(),
            Format: data.getFormat(),
            Language: data.getLanguage(),
            Publisher: data.getPublisher(),
            Special_Edition: data.getSpecialEdition(),
            Packaging: data.getPackaging()
        };
    }
    }