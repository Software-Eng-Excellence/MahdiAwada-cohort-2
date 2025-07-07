import { XmlToyMapper, XMLToy } from '../../src/mappers/Toy.mapper';
import { Toy } from '../../src/model/Toy.model';

describe('XmlToyMapper', () => {
    let mapper: XmlToyMapper;
    let sampleXMLToy: XMLToy;

    beforeEach(() => {
        mapper = new XmlToyMapper();
        sampleXMLToy = {
            Type: 'type',
            AgeGroup: 'age group',
            Brand: 'brand',
            Material: 'material',
            BatteryRequired: false,
            Educational: true
        };
    });

    describe('map', () => {
        it('should map XML data to Toy object', () => {
            // Act
            const result = mapper.map(sampleXMLToy);

            // Assert
            expect(result).toBeInstanceOf(Toy);
            expect(result.getType()).toBe('type');
            expect(result.getAgeGroup()).toBe('age group');
            expect(result.getBrand()).toBe('brand');
            expect(result.getMaterial()).toBe('material');
            expect(result.isBatteryRequired()).toBe(false);
            expect(result.isEducational()).toBe(true);
        });
    });

    describe('reverseMap', () => {
        it('should map Toy object back to XML data', () => {
            // Arrange
            const toy = mapper.map(sampleXMLToy);

            // Act
            const result = mapper.reverseMap(toy);

            // Assert
            expect(result).toEqual(sampleXMLToy);
        });
    });
}); 