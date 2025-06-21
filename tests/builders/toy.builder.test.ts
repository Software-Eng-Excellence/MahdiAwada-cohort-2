import { Toy } from "../../src/model/Toy.model";
import { ToyBuilder } from "../../src/model/builders/toy.builder";
describe("Toy Builder", () => {
    it("it should return a Toy object", () => {
        // Arrange
        const expectedToy = new Toy("type","age group","brand","material",true,false);
        // Act
        const toy = new ToyBuilder()
        .setType("type")
        .setAgeGroup("age group")
        .setBrand("brand")
        .setMaterial("material")
        .setBatteryRequired(true)
        .setEducational(false)
        .build();
        // Assert
        expect(toy).toEqual(expectedToy);
    });

    it("Should throw an error if a field is missing", () => {
        const toy = new ToyBuilder()
        .setType("type")
        .setAgeGroup("age group")

        expect(() => toy.build()).toThrow("Missing required properties");
    })

});