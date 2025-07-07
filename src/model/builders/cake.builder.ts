import logger from "../../util/logger";
import { Cake, IdentifiableCake } from "../Cake.model";

export class CakeBuilder {
    private type!: string;
    private flavor!: string;
    private filling!: string;
    private size!: number;
    private layers!: number;
    private frostingType!: string;
    private frostingFlavor!: string;
    private decorationType!: string;
    private decorationColor!: string;
    private customMessage!: string;
    private shape!: string;
    private allergies!: string;
    private specialIngredients!: string;
    private packagingType!: string;

    public setType(type: string): CakeBuilder {
        this.type = type;
        return this;
    }
    public setFlavor(flavor: string): CakeBuilder {
        this.flavor = flavor;
        return this;
    }

    public setFilling(filling: string): CakeBuilder {
        this.filling = filling;
        return this;
    }

    public setSize(size: number): CakeBuilder {
        this.size = size;
        return this;
    }

    public setLayers(layers: number): CakeBuilder {
        this.layers = layers;
        return this;
    }

    public setFrostingType(frostingType: string): CakeBuilder {
        this.frostingType = frostingType;
        return this;
    }

    public setFrostingFlavor(frostingFlavor: string): CakeBuilder {
        this.frostingFlavor = frostingFlavor;
        return this;
    }

    public setDecorationType(decorationType: string): CakeBuilder {
        this.decorationType = decorationType;
        return this;
    }

    public setDecorationColor(decorationColor: string): CakeBuilder {
        this.decorationColor = decorationColor;
        return this;
    }

    public setCustomMessage(customMessage: string): CakeBuilder {
        this.customMessage = customMessage;
        return this;
    }

    public setShape(shape: string): CakeBuilder {
        this.shape = shape;
        return this;
    }

    public setAllergies(allergies: string): CakeBuilder {
        this.allergies = allergies;
        return this;
    }

    public setSpecialIngredients(specialIngredients: string): CakeBuilder {
        this.specialIngredients = specialIngredients;
        return this;
    }

    public setPackagingType(packagingType: string): CakeBuilder {
        this.packagingType = packagingType;
        return this;
    }
    
    public static newBuilder(): CakeBuilder {
        return new CakeBuilder();
    }

    build(): Cake {
        const requiredProperties = [
            this.type,
            this.flavor,
            this.filling,
            this.size,
            this.layers,
            this.frostingType,
            this.frostingFlavor,
            this.decorationType,
            this.decorationColor,
            this.customMessage,
            this.shape,
            this.allergies,
            this.specialIngredients,
            this.packagingType
        ];

        for ( const property of requiredProperties ) {
            if (property === undefined || property === null) {
                logger.error("Missing required properties, could not build a cake");
                throw new Error("Missing required properties");
            }
        }

        return new Cake(
            this.type,
            this.flavor,
            this.filling,
            this.size,
            this.layers,
            this.frostingType,
            this.frostingFlavor,
            this.decorationType,
            this.decorationColor,
            this.customMessage,
            this.shape,
            this.allergies,
            this.specialIngredients,
            this.packagingType
        )
    }
}

export class IdentifiableCakeBuilder {
    private id!: string;
    private cake!: Cake;

    public static newBuilder(): IdentifiableCakeBuilder {
        return new IdentifiableCakeBuilder();
    }

    setId(id: string): IdentifiableCakeBuilder {
        this.id = id;
        return this;
    }
    setCake(cake: Cake): IdentifiableCakeBuilder {
        this.cake = cake;
        return this;
    }
    build(): IdentifiableCake {
        if(!this.id || !this.cake ) {
            logger.error("Missing required properties, could not build an identifiable cake");
            throw new Error("Missing required properties");
        }
        return new IdentifiableCake(
            this.id,
            this.cake.getType(),
            this.cake.getFlavor(),
            this.cake.getFilling(),
            this.cake.getSize(),
            this.cake.getLayers(),
            this.cake.getFrostingType(),
            this.cake.getFrostingFlavor(),
            this.cake.getDecorationType(),
            this.cake.getDecorationColor(),
            this.cake.getCustomMessage(),
            this.cake.getShape(),
            this.cake.getAllergies(),
            this.cake.getSpecialIngredients(),
            this.cake.getPackagingType()
        );
    }
}