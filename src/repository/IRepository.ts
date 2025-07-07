/**
 * Represents an entity with a unique identifier.
 */
export type id = string;
export interface ID {
    /**
     * Retrieves the unique identifier of the entity.
     * @returns {string} The unique identifier as a string.
     */
    getId(): string;
}

export interface Initializable {
    /**
     * init - Initializes the creation of required tables and establishes a connection
     * 
     * @throws InitializationException - If initialization process fails.
     * 
     * @returns A promise that resolves when the initialization is complete.
     */
    init(): Promise<void>;
}

/**
 * Generic repository interface for managing entities of type T.
 * 
 * @template T - The type of items managed by the repository, which must extend ID.
 */
export interface IRepository<T extends ID> {
    /**
     * Creates a new item in the repository.
     * 
     * @param {T} item - The item to be created.
     * @returns {Promise<ID>} A promise that resolves to the created item's ID.
     * @throws {InvalidItemException} Thrown when the provided item is invalid.
     * @throws {DbException} - Thrown when an error occurs while interacting with the database 
    */
    create(item: T): Promise<id>;

    /**
     * Retrieves an item from the repository by its ID.
     * 
     * @param {ID} id - The ID of the item to retrieve.
     * @returns {Promise<T>} A promise that resolves to the found item.
     * @throws {DbException} - Thrown when an error occurs while interacting with the database 
     * @throws {ItemNotFoundException} Thrown when no item with the specified ID exists.
     */
    get(id: id): Promise<T>;

    /**
     * Retrieves all items from the repository.
    * @throws {DbException} - Thrown when an error occurs while interacting with the database 
     * @returns {Promise<T[]>} A promise that resolves to an array of all items.
     */
    getAll(): Promise<T[]>;

    /**
     * Updates an existing item in the repository.
     * 
     * @param {T} item - The item with updated data.
     * @returns {Promise<void>} A promise that resolves when the update is complete.
     * @throws {ItemNotFoundException} Thrown when the item does not exist.
     * @throws {InvalidItemException} Thrown when the provided item is invalid.
     * @throws {DbException} - Thrown when an error occurs while interacting with the database 
     */
    update(item: T): Promise<void>;

    /**
     * Deletes an item from the repository by its ID.
     * 
     * @param {ID} id - The ID of the item to delete.
     * @returns {Promise<void>} A promise that resolves when the deletion is complete.
     * @throws {ItemNotFoundException} Thrown when no item with the specified ID exists.
     * @throws {DbException} - Thrown when an error occurs while interacting with the database 
     */
    delete(id: id): Promise<void>;
}

export interface InitializableRepository<T extends ID> extends IRepository<T>, Initializable {

}