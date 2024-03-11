import { faker } from "@faker-js/faker";
import { FoodAttribute } from "../../models/FoodAttribute";
import { BaseFactory } from "./BaseFactory";


export class FoodAttributeFactory extends BaseFactory<FoodAttribute> {
    protected generateSpecifics(foodAttribute: FoodAttribute): FoodAttribute{
    
        foodAttribute.name = faker.lorem.word(100);
        foodAttribute.value = faker.number.int({min:0, max: 9999});
    
    return foodAttribute;
  }


  
}
