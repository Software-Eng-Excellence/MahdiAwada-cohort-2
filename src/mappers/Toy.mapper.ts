import { Toy } from "../model/Toy.model";
import { IMapper } from "./IMapper";
import { ToyBuilder } from "../model/builders/toy.builder";

export interface XMLToy {
    Type: string;
    AgeGroup: string;
    Brand: string;
    Material: string;
    BatteryRequired: boolean;
    Educational: boolean;
}

export class XmlToyMapper implements IMapper<XMLToy, Toy>{
    map(data: XMLToy): Toy {
        return new ToyBuilder()
                .setType(data.Type)
                .setAgeGroup(data.AgeGroup)
                .setBrand(data.Brand)
                .setMaterial(data.Material)
                .setBatteryRequired(data.BatteryRequired)
                .setEducational(data.Educational)
                .build();
    }
    reverseMap(data: Toy): XMLToy {
        return {
            Type: data.getType(),
            AgeGroup: data.getAgeGroup(),
            Brand: data.getBrand(),
            Material: data.getMaterial(),
            BatteryRequired: data.isBatteryRequired(),
            Educational: data.isEducational()
        };
    }
    
}
