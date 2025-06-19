import { Toy } from "../Toy.model";
import logger from "../../util/logger";

export class ToyBuilder {
    private type!: string;
    private ageGroup!: string;
    private brand!: string;
    private material!: string;
    private batteryRequired!: boolean;
    private educational!: boolean;

    public setType(type: string): ToyBuilder {
        this.type = type;
        return this;
    }

    public setAgeGroup(ageGroup: string): ToyBuilder {
        this.ageGroup = ageGroup;
        return this;
    }

    public setBrand(brand: string): ToyBuilder {
        this.brand = brand;
        return this;
    }

    public setMaterial(material: string): ToyBuilder {
        this.material = material;
        return this;
    }

    public setBatteryRequired(batteryRequired: boolean): ToyBuilder {
        this.batteryRequired = batteryRequired;
        return this;
    }

    public setEducational(educational: boolean): ToyBuilder {
        this.educational = educational;
        return this;
    }

    public build() {
        const requiredProperties = [
            this.type ,
            this.ageGroup,
            this.brand ,
            this.material,
            this.batteryRequired,
            this.educational
        ]
        for( const property of requiredProperties ) {
            if(property === undefined || property === null){
                logger.error("Missing required properties, could not build a Toy");
                throw new Error("Missing required properties");
            }
        }

        return new Toy(
            this.type,
            this.ageGroup,
            this.brand,
            this.material,
            this.batteryRequired,
            this.educational
        )
    }

}