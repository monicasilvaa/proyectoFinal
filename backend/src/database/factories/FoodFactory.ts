import { faker } from "@faker-js/faker";
import { Food } from "../../models/Food";
import { BaseFactory } from "./BaseFactory";


export class FoodFactory extends BaseFactory<Food> {
    protected generateSpecifics(food: Food): Food{
    
    food.name = faker.lorem.word(100);

    
    return food;
  }


  
}
