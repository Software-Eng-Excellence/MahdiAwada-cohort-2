describe("Example Suite", () => {
    beforeAll(() => {
        console.log("Before all tests");
    });

    beforeEach(() => {
        console.log("Before each test");
    });

    afterEach(() => {
        console.log("After each test");
    });

    afterAll(() => {
        console.log("After all tests");
    });

    it("should run the first test", () => {
        console.log("First test");
    });

    it("should run the second test", () => {
        console.log("Second test");
    });
})