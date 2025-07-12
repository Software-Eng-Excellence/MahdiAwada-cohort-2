import { IdentifiableBook } from "model/Book.model";
import { id, Initializable, IRepository } from "repository/IRepository";
import { ConnectionManager } from "./ConnectionManager";
import logger from "util/logger";
import { DbException, InitializationException, ItemNotFoundException } from "util/exceptions/repositoryExceptions";
import { PostgreBookMapper } from "mappers/Book.mapper";

const CREATE_TABLE = `
CREATE TABLE IF NOT EXISTS book (
    id VARCHAR(255) PRIMARY KEY,
    book_title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    genre VARCHAR(255) NOT NULL,
    format VARCHAR(255) NOT NULL,
    language VARCHAR(255) NOT NULL,
    publisher VARCHAR(255) NOT NULL,
    special_edition VARCHAR(255) NOT NULL,
    packaging VARCHAR(255) NOT NULL,
);
`;

const INSERT_BOOK = `
INSERT INTO book (id, book_title, author, genre, format, language, publisher, special_edition, packaging)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);
`;

const SELECT_ALL = `SELECT * FROM book;`;

const SELECT_BY_ID = `SELECT * FROM book WHERE id = $1;`;

const UPDATE_BOOK = `
UPDATE book SET 
    book_title = $2,
    author = $3,
    genre = $4,
    format = $5,
    language = $6,
    publisher = $7,
    special_edition = $8,
    packaging = $9
WHERE id = $1;
`;

const DELETE_BOOK = `DELETE FROM book WHERE id = $1;`;

export class BookRepository implements IRepository<IdentifiableBook>, Initializable {
    async init(): Promise<void> {
        try {
            const pool = await ConnectionManager.getConnection();
            await pool.query(CREATE_TABLE);
            logger.info("Book table initialized");
        } catch (error) {
            logger.error("Failed to initialize Book table", error as Error);
            throw new InitializationException("Failed to initialize Book table", error as Error)
        }
    }
    async create(item: IdentifiableBook): Promise<id> {
        try {
                    const pool = await ConnectionManager.getConnection();
                    await pool.query(INSERT_BOOK, [
                        item.getId(),
                        item.getBookTitle(),
                        item.getAuthor(),
                        item.getGenre(),
                        item.getFormat(),
                        item.getLanguage(),
                        item.getPublisher(),
                        item.getSpecialEdition(),
                        item.getPackaging()
                    ]);
                    return item.getId();
                } catch (error) {
                     throw new DbException("Failed to create book", error as Error);
                }
    }
    async get(id: id): Promise<IdentifiableBook> {
        try {
            const pool = await ConnectionManager.getConnection();
            const result = await pool.query(SELECT_BY_ID, [id]);
            if (result.rows.length === 0) {
                throw new ItemNotFoundException(`Book with id ${id} not found`);
            }
            const mapper = new PostgreBookMapper();
            return mapper.map(result.rows[0]);
        } catch (error) {
            logger.error("Failed to get Book of id %s %o",id, error as Error);
            throw new DbException("Failed to get Book of id %s %o"+ id, error as Error);
        }
    }
    async getAll(): Promise<IdentifiableBook[]> {
        try {
            const pool = await ConnectionManager.getConnection();
            const result = await pool.query(SELECT_ALL);
            if(result.rows.length === 0) {
                throw new ItemNotFoundException("No books found");
            }
            const mapper = new PostgreBookMapper();
            return result.rows.map((book) => mapper.map(book));
        } catch (error) {
            logger.error("Failed to get all books ");
            throw new DbException("Failed to get all books", error as Error);
        }
    }
    async update(item: IdentifiableBook): Promise<void> {
         try {
            const pool = await ConnectionManager.getConnection();
            await pool.query(UPDATE_BOOK, [
                item.getId(),
                item.getBookTitle(),
                item.getAuthor(),
                item.getGenre(),
                item.getFormat(),
                item.getLanguage(),
                item.getPublisher(),
                item.getSpecialEdition(),
                item.getPackaging()
        ]);
        } catch (error) {
            logger.error("Failed to update book of id %s %o",item.getId(), error as Error);
            throw new DbException("Failed to update book of id %s %o"+ item.getId(), error as Error);
        }
    }
    async delete(id: id): Promise<void> {
        try {
            const pool = await ConnectionManager.getConnection();
            await pool.query(DELETE_BOOK, [id]); 
        } catch (error) {
            logger.error("Failed to delete Book of id %s %o",id, error as Error);
            throw new DbException("Failed to delete Book of id %s %o"+ id, error as Error);
        }
    }
    
}