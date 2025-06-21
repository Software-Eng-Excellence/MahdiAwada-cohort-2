import { Cake } from "../../src/model/Cake.model";
import { CakeBuilder } from "../../src/model/builders/cake.builder";
import logger from "../../src/util/logger";

describe("Cake builder", () => {

    let cakeBuilder: CakeBuilder;
    
    beforeEach(() => {
        cakeBuilder = new CakeBuilder();
    })

    it("Should return a Cake object" , () => {
        // Arrange
        const expectedCake = new Cake("type", "flavor", "filling", 10,  2,  "frostingType", "frostingFlavor", "decorationType", "decorationColor", "customMessage", "shape", "allergies", "specialIngredients", "packagingType" );
        // Act
        const cake = cakeBuilder
        .setType("type")
        .setFlavor("flavor")
        .setFilling("filling")
        .setSize(10)
        .setLayers(2)
        .setFrostingType("frostingType")
        .setFrostingFlavor("frostingFlavor")
        .setDecorationType("decorationType")
        .setDecorationColor("decorationColor")
        .setCustomMessage("customMessage")
        .setShape("shape")
        .setAllergies("allergies")
        .setSpecialIngredients("specialIngredients")
        .setPackagingType("packagingType")
        .build();
        // Assert
        expect(cake).toEqual(expectedCake);      
    });

    it("Should throw an error if a missed field" , () => {
        // Act
        const cake = cakeBuilder
        .setType("type")
        .setFlavor("flavor")
        .setSize(10)

        // Assert
        const spy = jest.spyOn(logger, 'error');
        expect(() => cake.build()).toThrow("Missing required properties");
        expect(spy).toHaveBeenCalledWith("Missing required properties, could not build a cake");

    })

});